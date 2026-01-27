'use client'

import Link from 'next/link'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-titanium-950 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <span className="text-8xl font-serif font-bold text-gradient">404</span>
        </div>

        <h1 className="text-2xl font-serif font-bold text-white mb-4">
          Page not found
        </h1>

        <p className="text-silver-light mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-navy-500 to-navy-600 px-6 py-3 font-medium text-white shadow-lg transition-all hover:from-navy-400 hover:to-navy-500"
          >
            <Home className="h-5 w-5" />
            Go Home
          </Link>

          <Link
            href="/blog"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-6 py-3 font-medium text-silver hover:text-white hover:bg-white/10 transition-all"
          >
            <Search className="h-5 w-5" />
            Browse Articles
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5">
          <p className="text-sm text-silver-dark">
            Need help? <Link href="/about" className="text-navy-400 hover:text-navy-300">Contact us</Link>
          </p>
        </div>
      </div>
    </main>
  )
}
