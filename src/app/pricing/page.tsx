import Link from 'next/link'
import { Metadata } from 'next'
import {
  CheckCircle2,
  Sparkles,
  Clock,
  Brain,
  Mic,
  MessageSquare,
  ListTodo,
  ArrowRight,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Pricing | Coach OS',
  description: 'Simple, affordable AI executive coaching. £40/month for unlimited access to voice and text coaching with full memory and task tracking.',
}

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-titanium-950">
      {/* Hero */}
      <section className="relative py-24">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <Sparkles className="h-4 w-4 text-silver" />
              <span className="text-sm font-medium text-silver">Simple Pricing</span>
            </div>
            <h1 className="mb-6 font-serif text-5xl font-bold md:text-6xl">
              One Plan. <span className="text-gradient">Unlimited Access.</span>
            </h1>
            <p className="text-lg text-silver-light">
              No tiers, no complexity. Just everything you need to think more clearly.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Card */}
      <section className="pb-24">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-lg">
            <div className="rounded-2xl border border-deep-blue-600/30 bg-gradient-to-b from-deep-blue-950/50 to-titanium-900/50 p-8">
              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-deep-blue-600 to-purple-600 px-3 py-1 text-xs font-semibold text-white">
                <Sparkles className="h-3 w-3" />
                COACH OS PRO
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">£40</span>
                <span className="text-xl text-silver-light">/month</span>
              </div>

              <p className="mb-8 text-silver-light">
                Everything you need for strategic thinking support, 24/7.
              </p>

              {/* Features */}
              <ul className="mb-8 space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                  <div>
                    <p className="font-medium text-white">Unlimited coaching sessions</p>
                    <p className="text-sm text-silver-light">Voice or text, any time</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                  <div>
                    <p className="font-medium text-white">Full memory & context</p>
                    <p className="text-sm text-silver-light">Coach remembers everything</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                  <div>
                    <p className="font-medium text-white">Automatic task capture</p>
                    <p className="text-sm text-silver-light">Actions extracted from conversations</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                  <div>
                    <p className="font-medium text-white">GROW & coaching frameworks</p>
                    <p className="text-sm text-silver-light">Proven executive methodologies</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                  <div>
                    <p className="font-medium text-white">ADHD-friendly mode</p>
                    <p className="text-sm text-silver-light">Energy-adaptive coaching</p>
                  </div>
                </li>
              </ul>

              {/* CTA */}
              <Link
                href="/auth/signup"
                className="btn btn-primary w-full justify-center shadow-lg shadow-white/10"
              >
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </Link>
              <p className="mt-4 text-center text-sm text-silver-dark">
                Free to try. No credit card required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="border-t border-white/5 py-24">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-serif text-3xl font-bold md:text-4xl">
              100x More <span className="text-gradient">Accessible</span>
            </h2>
            <p className="text-silver-light">
              The same frameworks, fraction of the cost
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            {/* Human Coach */}
            <div className="rounded-xl border border-white/5 bg-titanium-900/50 p-6">
              <p className="mb-4 text-sm font-medium uppercase tracking-wider text-silver-dark">
                Traditional Executive Coaching
              </p>
              <div className="mb-4">
                <span className="text-3xl font-bold text-white">£300-500</span>
                <span className="text-silver-light">/session</span>
              </div>
              <ul className="space-y-2 text-sm text-silver-light">
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-silver-dark" />
                  Book 2-4 weeks in advance
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-silver-dark" />
                  Re-explain context each session
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-silver-dark" />
                  £3,600-6,000/year for monthly
                </li>
              </ul>
            </div>

            {/* Coach OS */}
            <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-6">
              <p className="mb-4 text-sm font-medium uppercase tracking-wider text-green-400">
                Coach OS
              </p>
              <div className="mb-4">
                <span className="text-3xl font-bold text-white">£40</span>
                <span className="text-silver-light">/month</span>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-green-400">
                  <CheckCircle2 className="h-4 w-4" />
                  Available 24/7, no scheduling
                </li>
                <li className="flex items-center gap-2 text-green-400">
                  <CheckCircle2 className="h-4 w-4" />
                  Remembers all context forever
                </li>
                <li className="flex items-center gap-2 text-green-400">
                  <CheckCircle2 className="h-4 w-4" />
                  £480/year - unlimited access
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-t border-white/5 py-24">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-serif text-3xl font-bold md:text-4xl">
              Everything <span className="text-gradient">Included</span>
            </h2>
          </div>

          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-white/5 bg-titanium-900/30 p-6">
              <Mic className="mb-4 h-8 w-8 text-purple-400" />
              <h3 className="mb-2 font-semibold">Voice Conversations</h3>
              <p className="text-sm text-silver-light">
                Natural voice coaching. Perfect for walking, driving, or thinking out loud.
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-titanium-900/30 p-6">
              <MessageSquare className="mb-4 h-8 w-8 text-blue-400" />
              <h3 className="mb-2 font-semibold">Text Chat</h3>
              <p className="text-sm text-silver-light">
                Same coaching, typed. Full history searchable.
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-titanium-900/30 p-6">
              <Brain className="mb-4 h-8 w-8 text-amber-400" />
              <h3 className="mb-2 font-semibold">Long-Term Memory</h3>
              <p className="text-sm text-silver-light">
                Coach remembers past discussions, tracks progress, follows up.
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-titanium-900/30 p-6">
              <ListTodo className="mb-4 h-8 w-8 text-green-400" />
              <h3 className="mb-2 font-semibold">Task Capture</h3>
              <p className="text-sm text-silver-light">
                Mention a commitment, it becomes a tracked action item.
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-titanium-900/30 p-6">
              <Clock className="mb-4 h-8 w-8 text-cyan-400" />
              <h3 className="mb-2 font-semibold">24/7 Availability</h3>
              <p className="text-sm text-silver-light">
                3am anxiety? Quick check before a call? Always there.
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-titanium-900/30 p-6">
              <Sparkles className="mb-4 h-8 w-8 text-pink-400" />
              <h3 className="mb-2 font-semibold">ADHD Mode</h3>
              <p className="text-sm text-silver-light">
                Energy-adaptive coaching that works with your brain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-white/5 py-24">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-serif text-3xl font-bold md:text-4xl">
              Questions?
            </h2>
          </div>

          <div className="mx-auto max-w-2xl space-y-6">
            <div className="rounded-xl border border-white/5 bg-titanium-900/30 p-6">
              <h3 className="mb-2 font-semibold">Is there a free trial?</h3>
              <p className="text-sm text-silver-light">
                Yes. You can try Coach OS for free before subscribing. No credit card required to start.
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-titanium-900/30 p-6">
              <h3 className="mb-2 font-semibold">Can I cancel anytime?</h3>
              <p className="text-sm text-silver-light">
                Absolutely. No contracts, no commitments. Cancel anytime from your settings.
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-titanium-900/30 p-6">
              <h3 className="mb-2 font-semibold">What coaching frameworks do you use?</h3>
              <p className="text-sm text-silver-light">
                GROW, SWOT, and other proven executive coaching methodologies. The same frameworks used by Fortune 500 coaches.
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-titanium-900/30 p-6">
              <h3 className="mb-2 font-semibold">Is my data private?</h3>
              <p className="text-sm text-silver-light">
                Yes. Your conversations and data are private and secure. We never share or sell your information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-white/5 py-24">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-6 font-serif text-3xl font-bold md:text-4xl">
              Ready to Think <span className="text-gradient">More Clearly</span>?
            </h2>
            <p className="mb-8 text-lg text-silver-light">
              £40/month for unlimited access. No scheduling. Full context forever.
            </p>
            <Link
              href="/auth/signup"
              className="btn btn-primary shadow-lg shadow-white/10"
            >
              Start Free Trial
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
