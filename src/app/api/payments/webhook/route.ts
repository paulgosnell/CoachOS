import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendSubscriptionActivatedEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

// Revolut webhook event types
type WebhookEventType = 'ORDER_COMPLETED' | 'ORDER_AUTHORISED' | 'ORDER_PAYMENT_DECLINED' | 'ORDER_PAYMENT_FAILED'

interface RevolutWebhookPayload {
  event: WebhookEventType
  order_id: string
  merchant_order_ext_ref?: string
  timestamp: string
}

/**
 * Verify Revolut webhook signature
 * Revolut uses HMAC-SHA256 with the webhook secret
 */
function verifySignature(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')

  // Use timing-safe comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  try {
    const webhookSecret = process.env.REVOLUT_WEBHOOK_SECRET

    if (!webhookSecret) {
      console.error('[Webhook] Missing REVOLUT_WEBHOOK_SECRET')
      return NextResponse.json({ error: 'Configuration error' }, { status: 500 })
    }

    // Get raw body for signature verification
    const rawBody = await req.text()

    // Revolut sends signature in header
    const signature = req.headers.get('revolut-signature') || req.headers.get('x-revolut-signature')

    if (!signature) {
      console.error('[Webhook] Missing signature header')
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 })
    }

    // Verify signature
    if (!verifySignature(rawBody, signature, webhookSecret)) {
      console.error('[Webhook] Invalid signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    // Parse payload
    const payload: RevolutWebhookPayload = JSON.parse(rawBody)

    console.log('[Webhook] Received event:', payload.event, 'Order:', payload.order_id)

    // Handle different event types
    switch (payload.event) {
      case 'ORDER_COMPLETED':
        await handleOrderCompleted(payload)
        break

      case 'ORDER_PAYMENT_FAILED':
      case 'ORDER_PAYMENT_DECLINED':
        await handleOrderFailed(payload)
        break

      default:
        console.log('[Webhook] Unhandled event type:', payload.event)
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('[Webhook] Error processing webhook:', error)
    // Return 200 to prevent retries for parsing errors
    // Revolut will retry on 5xx errors
    return NextResponse.json({ received: true, error: 'Processing error' })
  }
}

async function handleOrderCompleted(payload: RevolutWebhookPayload) {
  const supabase = createAdminClient()

  // Check if we already processed this order (idempotency)
  const { data: existingSubscription } = await supabase
    .from('subscriptions')
    .select('id, status')
    .eq('revolut_order_id', payload.order_id)
    .single()

  if (existingSubscription?.status === 'active') {
    console.log('[Webhook] Order already processed:', payload.order_id)
    return
  }

  // Fetch order details from Revolut to get user info
  const revolutApiKey = process.env.REVOLUT_API_KEY
  if (!revolutApiKey) {
    throw new Error('Missing REVOLUT_API_KEY')
  }

  const orderResponse = await fetch(
    `https://merchant.revolut.com/api/1.0/orders/${payload.order_id}`,
    {
      headers: {
        'Authorization': `Bearer ${revolutApiKey}`,
        'Content-Type': 'application/json',
      },
    }
  )

  if (!orderResponse.ok) {
    console.error('[Webhook] Failed to fetch order from Revolut:', orderResponse.status)
    throw new Error('Failed to fetch order details')
  }

  const orderData = await orderResponse.json()

  // Extract user_id from metadata (set during order creation)
  const userId = orderData.metadata?.user_id

  if (!userId) {
    console.error('[Webhook] No user_id in order metadata:', payload.order_id)
    throw new Error('Missing user_id in order metadata')
  }

  // Calculate subscription period (1 month from now)
  const startedAt = new Date()
  const expiresAt = new Date()
  expiresAt.setMonth(expiresAt.getMonth() + 1)

  // Create or update subscription
  if (existingSubscription) {
    // Update existing subscription
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        status: 'active',
        started_at: startedAt.toISOString(),
        expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingSubscription.id)

    if (updateError) {
      console.error('[Webhook] Failed to update subscription:', updateError)
      throw updateError
    }
  } else {
    // Create new subscription
    const { error: insertError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        status: 'active',
        plan: 'pro',
        revolut_order_id: payload.order_id,
        amount: orderData.order_amount?.value ? orderData.order_amount.value / 100 : 40,
        currency: orderData.order_amount?.currency || 'GBP',
        started_at: startedAt.toISOString(),
        expires_at: expiresAt.toISOString(),
        metadata: {
          revolut_order_data: {
            created_at: orderData.created_at,
            completed_at: orderData.completed_at,
          },
        },
      })

    if (insertError) {
      console.error('[Webhook] Failed to create subscription:', insertError)
      throw insertError
    }
  }

  // Get user email for confirmation
  const { data: profile } = await supabase
    .from('profiles')
    .select('email, name')
    .eq('id', userId)
    .single()

  if (profile?.email) {
    try {
      await sendSubscriptionActivatedEmail(profile.email, profile.name || 'there')
      console.log('[Webhook] Confirmation email sent to:', profile.email)
    } catch (emailError) {
      // Don't fail the webhook for email errors
      console.error('[Webhook] Failed to send confirmation email:', emailError)
    }
  }

  console.log('[Webhook] Subscription activated for user:', userId)
}

async function handleOrderFailed(payload: RevolutWebhookPayload) {
  const supabase = createAdminClient()

  // Update subscription status if exists
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'inactive',
      updated_at: new Date().toISOString(),
      metadata: {
        failure_reason: payload.event,
        failed_at: payload.timestamp,
      },
    })
    .eq('revolut_order_id', payload.order_id)

  if (error) {
    console.error('[Webhook] Failed to update failed order:', error)
  }

  console.log('[Webhook] Order failed:', payload.order_id, payload.event)
}
