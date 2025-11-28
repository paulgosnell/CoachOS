import { NextResponse } from 'next/server'
import { sendSubscriptionActivatedEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const { email, userName, expiresAt } = await request.json()

    if (!email || !expiresAt) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await sendSubscriptionActivatedEmail(email, userName || 'there', new Date(expiresAt))

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Send subscription email error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
