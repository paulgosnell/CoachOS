import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-deep-blue-900/30 via-black to-black" />

        <div className="container relative z-10 mx-auto px-6 py-20">
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-glass-border bg-glass-bg px-4 py-2">
              <Sparkles className="h-4 w-4 text-silver" />
              <span className="text-sm font-semibold uppercase tracking-wider text-silver">
                CEO Coaching In Your Pocket
              </span>
            </div>

            {/* Headline */}
            <h1 className="mb-6 max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
              Your Executive Coach,
              <br />
              <span className="text-gradient">Always Available</span>
            </h1>

            {/* Subtitle */}
            <p className="mb-12 max-w-2xl text-lg text-silver-light md:text-xl">
              On-demand strategic guidance for executives and founders. No scheduling friction.
              Full context of your business. Premium coaching that fits your life.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/auth/signup" className="btn btn-primary">
                Get Started
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/demo" className="btn btn-secondary">
                See How It Works
              </Link>
            </div>

            {/* Early access note */}
            <p className="mt-8 text-sm text-gray-500">
              Limited early access for founding members
            </p>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="relative py-24">
        <div className="container mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="card">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-deep-blue-800 to-deep-blue-600">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="mb-3 text-xl font-semibold">Always Available</h3>
              <p className="text-silver-light">
                Get strategic guidance at the moment you need it. No scheduling required.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-deep-blue-800 to-deep-blue-600">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="mb-3 text-xl font-semibold">Full Context</h3>
              <p className="text-silver-light">
                Never repeat yourself. We remember your business, goals, and every conversation.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-deep-blue-800 to-deep-blue-600">
                <span className="text-2xl">🎤</span>
              </div>
              <h3 className="mb-3 text-xl font-semibold">Voice or Text</h3>
              <p className="text-silver-light">
                Use voice while driving or text when you need to think. Seamlessly switch between modes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
