'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  ArrowRight,
  Sparkles,
  Brain,
  Target,
  TrendingUp,
  MessageSquare,
  Clock,
  Zap,
  BarChart3,
  CheckCircle2,
  ListTodo,
  Mic,
} from 'lucide-react'

function EmailConfirmationHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get('code')
    if (code) {
      const handleConfirmation = async () => {
        const supabase = createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
          router.push('/onboarding')
        } else {
          console.error('Confirmation error:', error)
          router.replace('/')
        }
      }

      handleConfirmation()
    }
  }, [searchParams, router])

  return null
}

export default function HomePage() {
  return (
    <>
      <Suspense fallback={null}>
        <EmailConfirmationHandler />
      </Suspense>
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
                Elite Executive Coaching with AI
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
              Strategic guidance that knows your business, remembers your goals, and helps you
              think clearly. Professional coaching that fits your schedule.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/auth/signup" className="btn btn-primary">
                Get Started
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="#how-it-works" className="btn btn-secondary">
                See How It Works
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-silver" />
                <span>GPT-4o Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-silver" />
                <span>Long-Term Memory</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-silver" />
                <span>Enterprise-Grade Security</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative border-t border-white/5 py-24">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">
              Not Just AI. <span className="text-gradient">Professional Coaching.</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-silver-light">
              Coach OS combines proven coaching frameworks with AI to deliver personalized,
              context-aware guidance
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Step 1 */}
            <div className="card text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-deep-blue-800 to-silver-darker">
                  <Target className="h-8 w-8 text-silver" />
                </div>
              </div>
              <h3 className="mb-3 text-xl font-semibold">Understands You</h3>
              <p className="text-sm text-silver-light">
                Learns your business context, role, goals, and challenges during onboarding
              </p>
            </div>

            {/* Step 2 */}
            <div className="card text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-deep-blue-800 to-silver-darker">
                  <MessageSquare className="h-8 w-8 text-silver" />
                </div>
              </div>
              <h3 className="mb-3 text-xl font-semibold">Asks Questions First</h3>
              <p className="text-sm text-silver-light">
                Uses Socratic method to help you think, not just tell you what to do
              </p>
            </div>

            {/* Step 3 */}
            <div className="card text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-deep-blue-800 to-silver-darker">
                  <Brain className="h-8 w-8 text-silver" />
                </div>
              </div>
              <h3 className="mb-3 text-xl font-semibold">Remembers Everything</h3>
              <p className="text-sm text-silver-light">
                Recalls conversations from weeks ago and tracks your progress automatically
              </p>
            </div>

            {/* Step 4 */}
            <div className="card text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-deep-blue-800 to-silver-darker">
                  <TrendingUp className="h-8 w-8 text-silver" />
                </div>
              </div>
              <h3 className="mb-3 text-xl font-semibold">Drives Action</h3>
              <p className="text-sm text-silver-light">
                Every conversation ends with concrete next steps and accountability
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Coaching Frameworks */}
      <section className="relative border-t border-white/5 py-24">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">
              Powered by <span className="text-gradient">Proven Frameworks</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-silver-light">
              Coach OS doesn't just chat. It applies professional coaching methodologies used by
              elite executive coaches
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* GROW Model */}
            <div className="card">
              <div className="mb-4">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-deep-blue-800/50">
                  <Target className="h-5 w-5 text-silver" />
                </div>
                <h3 className="text-xl font-semibold">GROW Model</h3>
              </div>
              <p className="mb-4 text-sm text-silver-light">
                Goal → Reality → Options → Will. Structured problem-solving for complex decisions.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-silver-dark" />
                  <span>Clarify what you really want to achieve</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-silver-dark" />
                  <span>Assess your current reality objectively</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-silver-dark" />
                  <span>Explore all possible options</span>
                </li>
              </ul>
            </div>

            {/* SWOT Analysis */}
            <div className="card">
              <div className="mb-4">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-deep-blue-800/50">
                  <BarChart3 className="h-5 w-5 text-silver" />
                </div>
                <h3 className="text-xl font-semibold">SWOT Analysis</h3>
              </div>
              <p className="mb-4 text-sm text-silver-light">
                Strengths, Weaknesses, Opportunities, Threats. Strategic context for major
                decisions.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-silver-dark" />
                  <span>Identify competitive advantages</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-silver-dark" />
                  <span>Acknowledge blind spots and risks</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-silver-dark" />
                  <span>Spot market opportunities</span>
                </li>
              </ul>
            </div>

            {/* OKRs */}
            <div className="card">
              <div className="mb-4">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-deep-blue-800/50">
                  <TrendingUp className="h-5 w-5 text-silver" />
                </div>
                <h3 className="text-xl font-semibold">OKRs & Goal Setting</h3>
              </div>
              <p className="mb-4 text-sm text-silver-light">
                Objectives & Key Results. Turn vision into measurable quarterly milestones.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-silver-dark" />
                  <span>Set ambitious but achievable goals</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-silver-dark" />
                  <span>Define measurable key results</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-silver-dark" />
                  <span>Track progress over time</span>
                </li>
              </ul>
            </div>

            {/* Eisenhower Matrix */}
            <div className="card">
              <div className="mb-4">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-deep-blue-800/50">
                  <Zap className="h-5 w-5 text-silver" />
                </div>
                <h3 className="text-xl font-semibold">Eisenhower Matrix</h3>
              </div>
              <p className="mb-4 text-sm text-silver-light">
                Urgent vs Important. Prioritize what actually moves the needle.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-silver-dark" />
                  <span>Separate urgent from important</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-silver-dark" />
                  <span>Delegate and eliminate effectively</span>
                </li>
              </ul>
            </div>

            {/* Force Field Analysis */}
            <div className="card">
              <div className="mb-4">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-deep-blue-800/50">
                  <BarChart3 className="h-5 w-5 text-silver" />
                </div>
                <h3 className="text-xl font-semibold">Force Field Analysis</h3>
              </div>
              <p className="mb-4 text-sm text-silver-light">
                Map driving vs restraining forces. Understand what's helping or blocking change.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-silver-dark" />
                  <span>Identify blockers and accelerators</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-silver-dark" />
                  <span>Build change strategies</span>
                </li>
              </ul>
            </div>

            {/* Start/Stop/Continue */}
            <div className="card">
              <div className="mb-4">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-deep-blue-800/50">
                  <TrendingUp className="h-5 w-5 text-silver" />
                </div>
                <h3 className="text-xl font-semibold">Start/Stop/Continue</h3>
              </div>
              <p className="mb-4 text-sm text-silver-light">
                Simple retrospectives for continuous improvement and behavior change.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-silver-dark" />
                  <span>Identify what to begin doing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-silver-dark" />
                  <span>Stop ineffective behaviors</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Action Items Feature */}
      <section className="relative border-t border-white/5 py-24">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">
              Never Lose Track of <span className="text-gradient">What Matters</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-silver-light">
              Automatically captures action items from every conversation - voice or text
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Auto Action Extraction */}
            <div className="card">
              <div className="mb-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-deep-blue-800 to-silver-darker">
                  <ListTodo className="h-6 w-6 text-silver" />
                </div>
                <h3 className="text-2xl font-semibold">Automatic Action Extraction</h3>
              </div>
              <p className="mb-6 text-silver-light">
                Like having a Granola-style AI assistant in every coaching session. Coach OS automatically identifies and captures your commitments, so nothing falls through the cracks.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-silver" />
                  <div>
                    <p className="font-semibold">Works in text, voice, and voice notes</p>
                    <p className="text-sm text-gray-400">
                      Every conversation mode extracts action items
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-silver" />
                  <div>
                    <p className="font-semibold">Clean, actionable format</p>
                    <p className="text-sm text-gray-400">
                      "Email Sarah by Friday" not "maybe think about emailing"
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-silver" />
                  <div>
                    <p className="font-semibold">Automatic follow-up</p>
                    <p className="text-sm text-gray-400">
                      Coach remembers and checks in on your commitments
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Brain Dump Mode */}
            <div className="card relative overflow-hidden">
              <div className="absolute right-4 top-4 rounded-full bg-deep-blue-800/80 px-3 py-1 text-xs font-semibold text-silver">
                COMING SOON
              </div>
              <div className="mb-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-deep-blue-800 to-silver-darker">
                  <Mic className="h-6 w-6 text-silver" />
                </div>
                <h3 className="text-2xl font-semibold">Brain Dump Mode</h3>
              </div>
              <p className="mb-6 text-silver-light">
                Overwhelmed? Just need to get everything out of your head? One-way voice capture lets you offload thoughts without a conversation.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-silver" />
                  <div>
                    <p className="font-semibold">Quick capture when you're in a rush</p>
                    <p className="text-sm text-gray-400">
                      No back-and-forth, just offload and go
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-silver" />
                  <div>
                    <p className="font-semibold">Coach processes async</p>
                    <p className="text-sm text-gray-400">
                      Formats into action items and surfaces later
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-silver" />
                  <div>
                    <p className="font-semibold">Perfect for morning brain dumps</p>
                    <p className="text-sm text-gray-400">
                      Clear your head before your day starts
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Memory & Intelligence */}
      <section className="relative border-t border-white/5 py-24">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">
              Long-Term Memory <span className="text-gradient">Built In</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-silver-light">
              Never repeat yourself. Coach OS remembers everything and gets smarter over time.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Semantic Memory */}
            <div className="card">
              <div className="mb-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-deep-blue-800 to-silver-darker">
                  <Brain className="h-6 w-6 text-silver" />
                </div>
                <h3 className="text-2xl font-semibold">Semantic Search & RAG</h3>
              </div>
              <p className="mb-6 text-silver-light">
                Coach OS uses vector embeddings and semantic search to recall relevant
                conversations from weeks or months ago.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-silver" />
                  <div>
                    <p className="font-semibold">Searches by meaning, not keywords</p>
                    <p className="text-sm text-gray-400">
                      "delegation" finds "empowering your team" automatically
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-silver" />
                  <div>
                    <p className="font-semibold">References past conversations naturally</p>
                    <p className="text-sm text-gray-400">
                      "Remember when we discussed X 2 weeks ago?"
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-silver" />
                  <div>
                    <p className="font-semibold">Only surfaces relevant context</p>
                    <p className="text-sm text-gray-400">
                      70%+ similarity threshold for quality
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Progress Tracking */}
            <div className="card">
              <div className="mb-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-deep-blue-800 to-silver-darker">
                  <BarChart3 className="h-6 w-6 text-silver" />
                </div>
                <h3 className="text-2xl font-semibold">Automatic Progress Tracking</h3>
              </div>
              <p className="mb-6 text-silver-light">
                Daily and weekly summaries track your wins, challenges, and progress toward goals
                without any manual effort.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-silver" />
                  <div>
                    <p className="font-semibold">Daily synthesis of key themes</p>
                    <p className="text-sm text-gray-400">
                      What you discussed, decided, and accomplished
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-silver" />
                  <div>
                    <p className="font-semibold">Weekly insights and patterns</p>
                    <p className="text-sm text-gray-400">
                      Trends, progress on goals, strategic recommendations
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-silver" />
                  <div>
                    <p className="font-semibold">Accountability without tracking</p>
                    <p className="text-sm text-gray-400">Coach remembers your commitments</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Coaching Philosophy */}
      <section className="relative border-t border-white/5 py-24">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-4xl font-bold md:text-5xl">
                The <span className="text-gradient">Coach OS</span> Approach
              </h2>
              <p className="text-lg text-silver-light">
                Professional coaching built on proven principles
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="card">
                <h3 className="mb-3 text-lg font-semibold">Ask, Don't Tell</h3>
                <p className="text-sm text-silver-light">
                  Uses powerful questions to help you think clearly, not just tell you what to do.
                  You find better answers when you discover them yourself.
                </p>
              </div>

              <div className="card">
                <h3 className="mb-3 text-lg font-semibold">Context is Everything</h3>
                <p className="text-sm text-silver-light">
                  Knows your industry, role, company stage, team size, and challenges. No generic
                  advice - every response is specific to your situation.
                </p>
              </div>

              <div className="card">
                <h3 className="mb-3 text-lg font-semibold">Action-Oriented</h3>
                <p className="text-sm text-silver-light">
                  Every conversation ends with concrete next steps. Coaching isn't therapy - it's
                  about forward momentum and results.
                </p>
              </div>

              <div className="card">
                <h3 className="mb-3 text-lg font-semibold">Accountability Matters</h3>
                <p className="text-sm text-silver-light">
                  Remembers your commitments and follows up. Accountability is kindness - we help
                  you do what you said you'd do.
                </p>
              </div>

              <div className="card">
                <h3 className="mb-3 text-lg font-semibold">Professional, Not Corporate</h3>
                <p className="text-sm text-silver-light">
                  Direct and honest like a trusted advisor. No corporate jargon or consultant-speak
                  - just clear thinking and practical wisdom.
                </p>
              </div>

              <div className="card">
                <h3 className="mb-3 text-lg font-semibold">Systems Over Quick Fixes</h3>
                <p className="text-sm text-silver-light">
                  Focus on sustainable frameworks and habits, not band-aid solutions. Build
                  long-term capabilities, not dependency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative border-t border-white/5 py-24">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-4xl font-bold md:text-5xl">
              Ready to <span className="text-gradient">Think More Clearly</span>?
            </h2>
            <p className="mb-8 text-lg text-silver-light">
              Join executives and founders getting strategic guidance without scheduling friction
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/auth/signup" className="btn btn-primary">
                Get Started
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/auth/login" className="btn btn-secondary">
                Sign In
              </Link>
            </div>
            <p className="mt-6 text-sm text-gray-500">Limited early access for founding members</p>
          </div>
        </div>
      </section>
    </main>
    </>
  )
}
