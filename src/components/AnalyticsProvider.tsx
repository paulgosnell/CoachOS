'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

function generateSessionId(): string {
  if (typeof window === 'undefined') return ''

  let sessionId = sessionStorage.getItem('analytics_session')
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem('analytics_session', sessionId)
  }
  return sessionId
}

function checkIsInternal(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('analytics_internal') === 'true'
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isFirstRender = useRef(true)

  // Allow ?internal=true to mark browser as internal (for testing)
  useEffect(() => {
    if (searchParams?.get('internal') === 'true') {
      localStorage.setItem('analytics_internal', 'true')
    }
    if (searchParams?.get('internal') === 'false') {
      localStorage.removeItem('analytics_internal')
    }
  }, [searchParams])

  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')

    // Fire-and-forget tracking
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: url,
        referrer: isFirstRender.current ? document.referrer : null,
        sessionId: generateSessionId(),
        isInternal: checkIsInternal(),
      }),
    }).catch(() => {
      // Silent fail - never break the site for analytics
    })

    isFirstRender.current = false
  }, [pathname, searchParams])

  return <>{children}</>
}
