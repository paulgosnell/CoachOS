import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { DB_BACKED_PAGE_PREFIXES, MAINTENANCE_MESSAGE, MAINTENANCE_MODE } from '@/lib/maintenance'

export async function updateSession(request: NextRequest) {
  // Maintenance mode: the database is down, so never call Supabase. API calls
  // get a 503 the client can show; DB-backed pages go to /maintenance; pure
  // marketing pages render as normal, with no banner.
  if (MAINTENANCE_MODE) {
    const path = request.nextUrl.pathname
    if (path === '/maintenance') {
      return NextResponse.next({ request })
    }
    if (path.startsWith('/api/')) {
      return NextResponse.json(
        { error: MAINTENANCE_MESSAGE, maintenance: true },
        { status: 503, headers: { 'Retry-After': '3600' } }
      )
    }
    const needsDb = DB_BACKED_PAGE_PREFIXES.some(
      (prefix) => path === prefix || path.startsWith(`${prefix}/`)
    )
    if (needsDb) {
      const url = request.nextUrl.clone()
      url.pathname = '/maintenance'
      url.search = ''
      return NextResponse.rewrite(url)
    }
    return NextResponse.next({ request })
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  await supabase.auth.getUser()

  return response
}
