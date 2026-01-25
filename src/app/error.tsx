'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console in development
    console.error('[Error Boundary]', error)
  }, [error])

  return (
    <main className="min-h-screen bg-titanium-950 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-red-500/10 p-6">
            <AlertTriangle className="h-12 w-12 text-red-400" />
          </div>
        </div>

        <h1 className="text-2xl font-serif font-bold text-white mb-4">
          Something went wrong
        </h1>

        <p className="text-silver-light mb-8">
          We hit an unexpected error. This has been logged and we&apos;ll look into it.
          In the meantime, you can try again or head back home.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-navy-500 to-navy-600 px-6 py-3 font-medium text-white shadow-lg transition-all hover:from-navy-400 hover:to-navy-500"
          >
            <RefreshCw className="h-5 w-5" />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-6 py-3 font-medium text-silver hover:text-white hover:bg-white/10 transition-all"
          >
            <Home className="h-5 w-5" />
            Go Home
          </Link>
        </div>

        {error.digest && (
          <p className="mt-8 text-xs text-silver-dark">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </main>
  )
}
