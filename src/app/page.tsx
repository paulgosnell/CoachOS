'use client'

import { Suspense, useEffect, useState } from 'react'
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
  Database,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { CoachingGrowthChart } from '@/components/dashboard/CoachingGrowthChart'
import { DemoVoice } from '@/components/DemoVoice'

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
  const [showVoiceDemo, setShowVoiceDemo] = useState(false)

  return (
    <>
      <Suspense fallback={null}>
        <EmailConfirmationHandler />
      </Suspense>

      {/* Voice Demo Modal */}
      {showVoiceDemo && (
        <DemoVoice onClose={() => setShowVoiceDemo(false)} />
      )}

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
          {/* Aurora Background */}
          <div className="absolute inset-0 bg-titanium-950">
            <div
              className="absolute -inset-[50%] animate-aurora opacity-30 blur-[100px]"
              style={{
                backgroundImage: 'conic-gradient(from 0deg at 50% 50%, #0C2340 0deg, transparent 60deg, #1E3A5F 120deg, transparent 180deg, #0C2340 240deg, transparent 300deg, #1E3A5F 360deg)',
                backgroundSize: '100% 100%'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-titanium-950/80 to-titanium-950" />
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-20">
            {/* Text Content - Centered */}
            <div className="mb-12 mx-auto max-w-4xl text-center">
              {/* Badge */}
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-4 py-2 backdrop-blur-md transition-all hover:bg-white/10 hover:scale-105">
                <Sparkles className="h-4 w-4 text-silver" />
                <span className="text-sm font-semibold uppercase tracking-wider text-silver">
                  Elite Executive Coaching with AI
                </span>
              </div>

              {/* Headline */}
              <h1 className="mb-6 font-serif text-5xl font-bold leading-tight md:text-6xl lg:text-7xl drop-shadow-2xl">
                Your Executive Coach,
                <br />
                <span className="text-gradient">Always Available</span>
              </h1>

              {/* Subtitle */}
              <p className="mb-8 mx-auto max-w-2xl text-lg text-silver-light md:text-xl leading-relaxed">
                Strategic guidance that knows your business, remembers your goals, and helps you
                think clearly. Professional coaching that fits your schedule.
              </p>

              {/* CTA Buttons */}
              <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link href="/auth/signup" className="btn btn-primary shadow-lg shadow-white/10">
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <button
                  onClick={() => setShowVoiceDemo(true)}
                  className="btn btn-secondary backdrop-blur-sm group relative overflow-hidden"
                >
                  <span className="absolute inset-0 rounded-lg bg-white/5 animate-pulse" />
                  <Mic className="h-4 w-4 text-silver-dark group-hover:text-silver transition-colors relative z-10" />
                  <span className="relative z-10">Hear Coach OS</span>
                </button>
              </div>

              {/* Tech Stack - Refined */}
              <div className="mx-auto max-w-3xl">
                <p className="mb-6 text-center text-xs font-semibold uppercase tracking-wider text-silver-dark/60">
                  Enterprise-Grade Intelligence
                </p>
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
                  <div className="group flex items-center gap-2 text-silver-dark transition-colors hover:text-silver">
                    <Brain className="h-4 w-4 opacity-50 group-hover:opacity-100" />
                    <span className="text-sm font-medium">GPT-4o & Gemini 2.5</span>
                  </div>
                  <div className="h-1 w-1 rounded-full bg-white/10" />
                  <div className="group flex items-center gap-2 text-silver-dark transition-colors hover:text-silver">
                    <Mic className="h-4 w-4 opacity-50 group-hover:opacity-100" />
                    <span className="text-sm font-medium">Human-Level Voice</span>
                  </div>
                  <div className="h-1 w-1 rounded-full bg-white/10" />
                  <div className="group flex items-center gap-2 text-silver-dark transition-colors hover:text-silver">
                    <Database className="h-4 w-4 opacity-50 group-hover:opacity-100" />
                    <span className="text-sm font-medium">Long-Term Memory</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard + Mobile Mockup */}
            <div className="relative mt-16">
              {/* Desktop Dashboard Browser Mockup - Background */}
              <div className="relative rounded-2xl border border-white/10 bg-titanium-900/50 p-3 backdrop-blur-sm shadow-2xl">
                {/* Browser Chrome */}
                <div className="mb-3 flex items-center gap-2 border-b border-white/5 pb-3">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-500/80" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                    <div className="h-3 w-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="ml-4 flex-1 rounded-md bg-titanium-800/50 px-3 py-1.5 text-xs text-silver-dark">
                    ceocoachos.com/dashboard
                  </div>
                </div>

                {/* Dashboard Content with slight blur for depth */}
                <div className="relative overflow-hidden rounded-xl opacity-90">
                  <div className="scale-95 transform">
                    <CoachingGrowthChart demoMode={true} />
                  </div>
                  {/* Subtle overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-titanium-950/40 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Mobile Phone Mockup - Overlaid on Right Side */}
              <div className="absolute -bottom-8 -right-4 md:right-8 lg:right-16 z-20 hidden sm:block transition-transform duration-700 hover:scale-105 hover:-translate-y-4">
                <div className="relative">
                  {/* Phone Frame */}
                  <div className="relative h-[500px] w-[250px] rounded-[2.5rem] border-[12px] border-titanium-900 bg-black shadow-2xl">
                    {/* Screen Content */}
                    <div className="flex h-full flex-col rounded-[1.8rem] bg-titanium-950 p-5">
                      {/* Header */}
                      <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3">
                        <div className="h-4 w-4" />
                        <p className="text-xs font-medium text-silver">Voice</p>
                        <div className="h-4 w-4" />
                      </div>

                      {/* Voice Interface - Centered */}
                      <div className="flex flex-1 flex-col items-center justify-center">
                        {/* Mic Icon */}
                        <div className="relative mb-6">
                          {/* Main Circle */}
                          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-titanium-800 shadow-2xl transition-all duration-500">
                            <Mic className="h-12 w-12 text-silver" />
                          </div>
                        </div>

                        {/* Status Text */}
                        <p className="mb-6 text-lg font-medium text-silver">
                          Tap to Speak
                        </p>

                        {/* Play Button Placeholder */}
                        <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-titanium-800 opacity-50 cursor-not-allowed shadow-lg">
                          <div className="h-4 w-4 rounded-sm bg-white" />
                        </button>
                      </div>

                      {/* Bottom Tip */}
                      <div className="text-center">
                        <p className="text-xs text-silver-light">
                          Talk naturally - I have full context
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Glow Effect Behind Phone */}
                  <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-deep-blue-600/10 blur-3xl" />
                </div>
              </div>

              {/* Depth shadow under dashboard */}
              <div className="absolute -inset-x-4 -bottom-4 h-32 bg-gradient-to-t from-black via-transparent to-transparent blur-2xl" />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="relative border-t border-white/5 py-24">
          <div className="container mx-auto px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-4 font-serif text-4xl font-bold md:text-5xl">
                Not Just AI. <span className="text-gradient">Professional Coaching.</span>
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-silver-light">
                Coach OS combines proven coaching frameworks with AI to deliver personalized,
                context-aware guidance
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {/* Step 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="card text-center group hover:-translate-y-2 transition-all duration-300"
              >
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-deep-blue-800 to-silver-darker group-hover:scale-110 transition-transform duration-300">
                    <Target className="h-8 w-8 text-silver" />
                  </div>
                </div>
                <h3 className="mb-3 text-xl font-semibold">Understands You</h3>
                <p className="text-sm text-silver-light">
                  Learns your business context, role, goals, and challenges during onboarding
                </p>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="card text-center group hover:-translate-y-2 transition-all duration-300"
              >
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-deep-blue-800 to-silver-darker group-hover:scale-110 transition-transform duration-300">
                    <MessageSquare className="h-8 w-8 text-silver" />
                  </div>
                </div>
                <h3 className="mb-3 text-xl font-semibold">Asks Questions First</h3>
                <p className="text-sm text-silver-light">
                  Uses Socratic method to help you think, not just tell you what to do
                </p>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="card text-center group hover:-translate-y-2 transition-all duration-300"
              >
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-deep-blue-800 to-silver-darker group-hover:scale-110 transition-transform duration-300">
                    <Brain className="h-8 w-8 text-silver" />
                  </div>
                </div>
                <h3 className="mb-3 text-xl font-semibold">Remembers Everything</h3>
                <p className="text-sm text-silver-light">
                  Recalls conversations from weeks ago and tracks your progress automatically
                </p>
              </motion.div>

              {/* Step 4 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="card text-center group hover:-translate-y-2 transition-all duration-300"
              >
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-deep-blue-800 to-silver-darker group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-8 w-8 text-silver" />
                  </div>
                </div>
                <h3 className="mb-3 text-xl font-semibold">Drives Action</h3>
                <p className="text-sm text-silver-light">
                  Every conversation ends with concrete next steps and accountability
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Coaching Frameworks */}
        <section className="relative border-t border-white/5 py-24">
          <div className="container mx-auto px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-4 font-serif text-4xl font-bold md:text-5xl">
                Powered by <span className="text-gradient">Proven Frameworks</span>
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-silver-light">
                Coach OS doesn't just chat. It applies professional coaching methodologies used by
                elite executive coaches
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3 md:gap-6">
              {/* GROW Model - Wide Card */}
              <div className="card md:col-span-2 relative overflow-hidden group hover:bg-titanium-800/80 transition-all duration-500">
                <div className="absolute -right-8 -top-8 opacity-[0.03] transition-opacity group-hover:opacity-[0.08]">
                  <Target className="h-64 w-64" />
                </div>
                <div className="relative z-10 h-full flex flex-col">
                  <div className="mb-6 flex items-start justify-between">
                    <div>
                      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-deep-blue-500/20 text-deep-blue-300">
                        <Target className="h-5 w-5" />
                      </div>
                      <h3 className="text-2xl font-semibold text-white">GROW Model</h3>
                    </div>
                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-silver-dark">
                      Problem Solving
                    </span>
                  </div>
                  <p className="mb-6 text-silver-light text-lg max-w-lg">
                    Goal → Reality → Options → Will. The gold standard for structured problem-solving and decision making.
                  </p>
                  <div className="mt-auto grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {['Goal', 'Reality', 'Options', 'Will'].map((step, i) => (
                      <div key={step} className="relative overflow-hidden rounded-lg bg-black/20 p-3 text-center">
                        <div className="mb-1 text-xs font-bold text-deep-blue-400">0{i + 1}</div>
                        <div className="text-sm font-medium text-silver">{step}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SWOT Analysis */}
              <div className="card relative overflow-hidden group hover:bg-titanium-800/80 transition-all duration-500">
                <div className="absolute -right-4 -bottom-4 opacity-[0.03] transition-opacity group-hover:opacity-[0.08]">
                  <BarChart3 className="h-40 w-40" />
                </div>
                <div className="relative z-10">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20 text-purple-300">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-white">SWOT Analysis</h3>
                  <p className="mb-4 text-sm text-silver-light">
                    Strategic context for major decisions. Identify your competitive advantages and blind spots.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded bg-white/5 p-2 text-center text-xs text-silver-dark">Strengths</div>
                    <div className="rounded bg-white/5 p-2 text-center text-xs text-silver-dark">Weaknesses</div>
                    <div className="rounded bg-white/5 p-2 text-center text-xs text-silver-dark">Opportunities</div>
                    <div className="rounded bg-white/5 p-2 text-center text-xs text-silver-dark">Threats</div>
                  </div>
                </div>
              </div>

              {/* OKRs - Tall Card */}
              <div className="card md:row-span-2 relative overflow-hidden group hover:bg-titanium-800/80 transition-all duration-500">
                <div className="absolute -right-12 top-1/2 -translate-y-1/2 opacity-[0.03] transition-opacity group-hover:opacity-[0.08]">
                  <TrendingUp className="h-64 w-64" />
                </div>
                <div className="relative z-10 h-full flex flex-col">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20 text-green-300">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-white">OKRs & Goals</h3>
                  <p className="mb-6 text-sm text-silver-light">
                    Turn vision into measurable quarterly milestones.
                  </p>

                  <div className="mt-auto space-y-3">
                    <div className="rounded-xl bg-black/20 p-4">
                      <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="text-silver-dark">Objective</span>
                        <span className="text-green-400">On Track</span>
                      </div>
                      <p className="text-sm font-medium text-silver">Launch MVP</p>
                      <div className="mt-3 h-1.5 w-full rounded-full bg-white/10">
                        <div className="h-full w-[75%] rounded-full bg-green-500" />
                      </div>
                    </div>
                    <div className="rounded-xl bg-black/20 p-4">
                      <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="text-silver-dark">Key Result</span>
                        <span className="text-yellow-400">At Risk</span>
                      </div>
                      <p className="text-sm font-medium text-silver">100 Beta Users</p>
                      <div className="mt-3 h-1.5 w-full rounded-full bg-white/10">
                        <div className="h-full w-[45%] rounded-full bg-yellow-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Eisenhower Matrix - Wide */}
              <div className="card md:col-span-2 relative overflow-hidden group hover:bg-titanium-800/80 transition-all duration-500">
                <div className="absolute -right-8 -bottom-8 opacity-[0.03] transition-opacity group-hover:opacity-[0.08]">
                  <Zap className="h-56 w-56" />
                </div>
                <div className="relative z-10 grid gap-6 sm:grid-cols-2">
                  <div>
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/20 text-yellow-300">
                      <Zap className="h-5 w-5" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-white">Eisenhower Matrix</h3>
                    <p className="text-sm text-silver-light">
                      Urgent vs Important. Stop putting out fires and start doing deep work.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="flex flex-col justify-center rounded-lg bg-green-500/10 p-3 border border-green-500/20">
                      <span className="font-bold text-green-400">Do First</span>
                      <span className="text-silver-dark/70">Urgent & Important</span>
                    </div>
                    <div className="flex flex-col justify-center rounded-lg bg-blue-500/10 p-3 border border-blue-500/20">
                      <span className="font-bold text-blue-400">Schedule</span>
                      <span className="text-silver-dark/70">Not Urgent / Important</span>
                    </div>
                    <div className="flex flex-col justify-center rounded-lg bg-yellow-500/10 p-3 border border-yellow-500/20">
                      <span className="font-bold text-yellow-400">Delegate</span>
                      <span className="text-silver-dark/70">Urgent / Not Important</span>
                    </div>
                    <div className="flex flex-col justify-center rounded-lg bg-red-500/10 p-3 border border-red-500/20">
                      <span className="font-bold text-red-400">Delete</span>
                      <span className="text-silver-dark/70">Neither</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Force Field & Start/Stop - Split */}
              <div className="card md:col-span-2 grid gap-6 md:grid-cols-2 relative overflow-hidden group hover:bg-titanium-800/80 transition-all duration-500">
                {/* Force Field */}
                <div className="flex items-start gap-4">
                  <div className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-red-500/20 text-red-300">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Force Field Analysis</h3>
                    <p className="text-sm text-silver-light">
                      Map driving vs restraining forces. Understand what's helping or blocking change.
                    </p>
                  </div>
                </div>

                {/* Start/Stop */}
                <div className="flex items-start gap-4 border-t border-white/5 pt-6 md:border-l md:border-t-0 md:pl-6 md:pt-0">
                  <div className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-300">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Start / Stop / Continue</h3>
                    <p className="text-sm text-silver-light">
                      Simple retrospectives for continuous improvement and behavior change.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Action Items Feature */}
        <section className="relative border-t border-white/5 py-24">
          <div className="container mx-auto px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-4 font-serif text-4xl font-bold md:text-5xl">
                Never Lose Track of <span className="text-gradient">What Matters</span>
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-silver-light">
                Automatically captures action items from every conversation - voice or text
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* Auto Action Extraction */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="card group hover:border-silver/30 transition-all duration-300"
              >
                <div className="mb-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-deep-blue-800 to-silver-darker group-hover:scale-110 transition-transform duration-300">
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
              </motion.div>

              {/* Brain Dump Mode */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="card relative overflow-hidden group hover:border-silver/30 transition-all duration-300"
              >
                <div className="absolute right-4 top-4 rounded-full bg-deep-blue-800/80 px-3 py-1 text-xs font-semibold text-silver">
                  COMING SOON
                </div>
                <div className="mb-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-deep-blue-800 to-silver-darker group-hover:scale-110 transition-transform duration-300">
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
              </motion.div>
            </div>
          </div>
        </section>

        {/* Memory & Intelligence */}
        <section className="relative border-t border-white/5 py-24">
          <div className="container mx-auto px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-4 font-serif text-4xl font-bold md:text-5xl">
                Long-Term Memory <span className="text-gradient">Built In</span>
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-silver-light">
                Never repeat yourself. Coach OS remembers everything and gets smarter over time.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* Semantic Memory */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="card group hover:border-silver/30 transition-all duration-300"
              >
                <div className="mb-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-deep-blue-800 to-silver-darker group-hover:scale-110 transition-transform duration-300">
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
              </motion.div>

              {/* Progress Tracking */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="card group hover:border-silver/30 transition-all duration-300"
              >
                <div className="mb-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-deep-blue-800 to-silver-darker group-hover:scale-110 transition-transform duration-300">
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
              </motion.div>
            </div>
          </div>
        </section>

        {/* Coaching Philosophy */}
        <section className="relative border-t border-white/5 py-24">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-4xl">
              <div className="mb-12 text-center">
                <h2 className="mb-4 font-serif text-4xl font-bold md:text-5xl">
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
              <h2 className="mb-6 font-serif text-4xl font-bold md:text-5xl">
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
