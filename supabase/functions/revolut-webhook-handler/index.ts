import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    const body = await req.json()
    console.log('Webhook received:', body)

    const { event, order } = body

    if (event !== 'ORDER_COMPLETED') {
      // Only process completed orders
      return new Response(JSON.stringify({ received: true }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (!order || !order.metadata || !order.metadata.user_id) {
      console.error('Invalid webhook payload - missing user_id')
      return new Response(JSON.stringify({ error: 'Invalid payload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const { user_id, plan } = order.metadata
    const orderId = order.id

    // Create Supabase client with service role
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // Check if subscription already exists for this order
    const { data: existingSubscription } = await supabaseAdmin
      .from('subscriptions')
      .select('id')
      .eq('revolut_order_id', orderId)
      .single()

    if (existingSubscription) {
      console.log('Subscription already processed for order:', orderId)
      return new Response(JSON.stringify({ received: true }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Calculate subscription dates (30 days from now)
    const startedAt = new Date()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    // Create subscription
    const { error: subscriptionError } = await supabaseAdmin
      .from('subscriptions')
      .insert({
        user_id,
        plan,
        status: 'active',
        revolut_order_id: orderId,
        amount: order.order_amount?.value ? order.order_amount.value / 100 : 0,
        currency: order.order_amount?.currency || 'GBP',
        started_at: startedAt.toISOString(),
        expires_at: expiresAt.toISOString(),
        metadata: {
          order_id: orderId,
          public_id: order.public_id,
          completed_at: new Date().toISOString(),
        },
      })

    if (subscriptionError) {
      console.error('Failed to create subscription:', subscriptionError)
      return new Response(
        JSON.stringify({ error: 'Failed to create subscription' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    console.log('Subscription activated for user:', user_id)

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
})
