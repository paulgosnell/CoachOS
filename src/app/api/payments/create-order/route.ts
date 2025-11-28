import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { plan } = await request.json()

    if (plan !== 'pro') {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    // Get user profile for email
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', user.id)
      .single()

    // Define subscription pricing
    const pricing = {
      pro: {
        amount: 9.99,
        currency: 'GBP',
        description: 'Coach OS Pro - Monthly Subscription',
      },
    }

    const orderData = pricing[plan as keyof typeof pricing]

    // Create order with Revolut
    const revolutResponse = await fetch('https://merchant.revolut.com/api/1.0/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REVOLUT_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(orderData.amount * 100), // Convert to cents
        currency: orderData.currency,
        description: orderData.description,
        customer_email: profile?.email || user.email,
        metadata: {
          user_id: user.id,
          plan: plan,
          user_name: profile?.full_name || 'Unknown',
        },
      }),
    })

    if (!revolutResponse.ok) {
      const errorText = await revolutResponse.text()
      console.error('Revolut API error:', errorText)
      return NextResponse.json(
        { error: 'Failed to create payment order' },
        { status: 500 }
      )
    }

    const order = await revolutResponse.json()

    return NextResponse.json({
      orderId: order.id,
      checkoutUrl: order.checkout_url,
      publicId: order.public_id,
    })
  } catch (error: any) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
