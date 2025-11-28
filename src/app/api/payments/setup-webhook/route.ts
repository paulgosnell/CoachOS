import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { webhookUrl } = await request.json()

    if (!webhookUrl) {
      return NextResponse.json({ error: 'webhookUrl is required' }, { status: 400 })
    }

    // Register webhook with Revolut
    const revolutResponse = await fetch('https://merchant.revolut.com/api/1.0/webhooks', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REVOLUT_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: webhookUrl,
        events: ['ORDER_COMPLETED'],
      }),
    })

    if (!revolutResponse.ok) {
      const errorText = await revolutResponse.text()
      console.error('Revolut webhook registration error:', errorText)
      return NextResponse.json(
        { error: 'Failed to register webhook with Revolut' },
        { status: 500 }
      )
    }

    const webhook = await revolutResponse.json()

    return NextResponse.json({
      success: true,
      webhookId: webhook.id,
      url: webhook.url,
      events: webhook.events,
      message: 'Webhook registered successfully',
    })
  } catch (error: any) {
    console.error('Setup webhook error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get all registered webhooks
export async function GET() {
  try {
    const revolutResponse = await fetch('https://merchant.revolut.com/api/1.0/webhooks', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.REVOLUT_API_KEY}`,
      },
    })

    if (!revolutResponse.ok) {
      const errorText = await revolutResponse.text()
      console.error('Revolut get webhooks error:', errorText)
      return NextResponse.json(
        { error: 'Failed to get webhooks from Revolut' },
        { status: 500 }
      )
    }

    const webhooks = await revolutResponse.json()

    return NextResponse.json({
      success: true,
      webhooks,
    })
  } catch (error: any) {
    console.error('Get webhooks error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
