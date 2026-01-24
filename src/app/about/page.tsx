import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Brain, Target, Clock, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Coach OS',
  description: 'Learn about Coach OS - AI-powered executive coaching built by founders, for founders. Available 24/7 with framework-based guidance.',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-titanium-950">
      {/* Header */}
      <header className="border-b border-white/5 py-4">
        <div className="container mx-auto max-w-4xl px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-silver-dark hover:text-silver transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Coach OS
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-white/5 py-16">
        <div className="container mx-auto max-w-4xl px-6">
          <h1 className="mb-6 font-serif text-4xl font-bold md:text-5xl">
            About <span className="text-gradient">Coach OS</span>
          </h1>
          <p className="text-xl text-silver-light leading-relaxed">
            Executive coaching used to cost £300-500 per session and require weeks of advance booking.
            We built Coach OS to change that.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="prose prose-invert prose-lg max-w-none space-y-8 text-silver-light">
            <h2 className="text-3xl font-bold text-white">The Problem We Solve</h2>
            <p>
              As founders, we know the isolation of leadership. The decisions that keep you up at night.
              The need to talk through a problem with someone who has no agenda, no judgement,
              and full context of your situation.
            </p>
            <p>
              Traditional executive coaching is powerful - studies show ROI of nearly $8 for every $1 invested.
              But it is expensive (£300-500 per session), hard to schedule (often weeks in advance),
              and unavailable when you need it most (like 11pm when anxiety hits).
            </p>
            <p>
              We built Coach OS because we needed it ourselves.
            </p>

            <h2 className="text-3xl font-bold text-white">What Makes Us Different</h2>
          </div>

          {/* Features Grid */}
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-titanium-900 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-deep-blue-800/50">
                <Brain className="h-6 w-6 text-silver" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">Framework-Based</h3>
              <p className="text-sm text-silver-light">
                Not just conversation. Real coaching frameworks like GROW, SWOT, and OKRs
                provide structure and methodology.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-titanium-900 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-deep-blue-800/50">
                <Target className="h-6 w-6 text-silver" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">Full Context</h3>
              <p className="text-sm text-silver-light">
                Coach OS remembers your business, goals, challenges, and past conversations.
                No re-explaining your situation every time.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-titanium-900 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-deep-blue-800/50">
                <Clock className="h-6 w-6 text-silver" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">Available 24/7</h3>
              <p className="text-sm text-silver-light">
                3am anxiety? Quick check before a call? No scheduling needed.
                Your coach fits your unpredictable schedule.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-titanium-900 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-deep-blue-800/50">
                <Zap className="h-6 w-6 text-silver" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">Automatic Task Capture</h3>
              <p className="text-sm text-silver-light">
                Mention a commitment and it becomes a tracked action item.
                Coach follows up. No more forgotten promises.
              </p>
            </div>
          </div>

          <div className="mt-12 prose prose-invert prose-lg max-w-none space-y-8 text-silver-light">
            <h2 className="text-3xl font-bold text-white">Built for ADHD Entrepreneurs</h2>
            <p>
              ADHD entrepreneurs are 300% more likely to start businesses. But traditional
              productivity systems and coaching approaches were not designed for how our
              brains work.
            </p>
            <p>
              Coach OS was built by a founder with ADHD, for people like us. The voice-first
              interface works when your mind is racing. The automatic task capture solves
              forgetfulness. The framework-based approach provides the external structure
              we cannot create ourselves.
            </p>
            <p>
              <Link href="/adhd" className="text-silver hover:text-white transition-colors">
                Learn more about our ADHD-specific coaching mode →
              </Link>
            </p>

            <h2 className="text-3xl font-bold text-white">The Company</h2>
            <p>
              Coach OS is built by <a href="https://thriveventurelabs.com" target="_blank" rel="noopener noreferrer" className="text-silver hover:text-white transition-colors">Thrive Venture Labs</a>,
              a UK-based venture studio focused on AI-native products that solve real problems.
            </p>
            <p>
              We believe the best tools are built by people who need them. Coach OS exists
              because we could not find what we needed elsewhere.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-16 rounded-2xl border border-white/10 bg-titanium-900 p-8 text-center">
            <h3 className="mb-4 font-serif text-2xl font-bold">Ready to try it?</h3>
            <p className="mb-6 text-silver-light">
              Start for free. No credit card required.
            </p>
            <Link href="/auth/signup" className="btn btn-primary">
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
