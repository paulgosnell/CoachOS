// Maintenance mode: set NEXT_PUBLIC_MAINTENANCE_MODE=true in Vercel and redeploy
// when the database is unavailable. Middleware sends every DB-backed page to
// /maintenance and every API call gets a 503, while marketing pages stay up
// untouched. Inlined at build time, so toggling it needs a redeploy.
export const MAINTENANCE_MODE = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true'

export const MAINTENANCE_MESSAGE = 'System maintenance, we will be back up later today.'

// Page routes that read or write the database, so they cannot work during
// maintenance. Everything not listed here (marketing, blog, legal, static
// metadata routes) passes through untouched.
export const DB_BACKED_PAGE_PREFIXES = [
  '/auth',
  '/dashboard',
  '/chat',
  '/sessions',
  '/tasks',
  '/goals',
  '/settings',
  '/admin',
  '/onboarding',
  '/brain-dump',
  '/progress',
  '/subscribe',
  '/voice-coach',
]
