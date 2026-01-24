import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// Internal emails to exclude from analytics
const INTERNAL_EMAILS = [
  'paul@thriveventurelabs.com',
  'paul@p0stman.com',
]

const INTERNAL_DOMAINS = [
  'thriveventurelabs.com',
  'p0stman.com',
]

function isInternalUser(email: string | undefined): boolean {
  if (!email) return false

  // Check exact email matches
  if (INTERNAL_EMAILS.includes(email.toLowerCase())) return true

  // Check domain matches
  const domain = email.toLowerCase().split('@')[1]
  if (domain && INTERNAL_DOMAINS.includes(domain)) return true

  return false
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { path, referrer, sessionId, isInternal: clientIsInternal } = body

    // Skip tracking for bots
    const userAgent = req.headers.get('user-agent') || null
    if (userAgent && /bot|crawler|spider|crawling/i.test(userAgent)) {
      return NextResponse.json({ ok: true })
    }

    // Vercel provides geo data in headers (free)
    const country = req.headers.get('x-vercel-ip-country') || null
    const city = req.headers.get('x-vercel-ip-city') || null

    // Simple device detection
    let deviceType = 'desktop'
    if (userAgent) {
      if (/mobile/i.test(userAgent)) deviceType = 'mobile'
      else if (/tablet|ipad/i.test(userAgent)) deviceType = 'tablet'
    }

    const supabase = await createClient()

    // Get user if authenticated
    const { data: { user } } = await supabase.auth.getUser()

    // Check if this is internal traffic
    const isInternal = clientIsInternal || isInternalUser(user?.email)

    await supabase.from('page_views').insert({
      path,
      referrer: referrer || null,
      user_agent: userAgent,
      country,
      city,
      device_type: deviceType,
      session_id: sessionId || null,
      user_id: user?.id || null,
      is_internal: isInternal,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    // Silent fail - don't break the site for analytics
    console.error('Analytics error:', error)
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
