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
                  AI Executive Coaching
                </span>
              </div>

              {/* Headline */}
              <h1 className="mb-6 font-serif text-5xl font-bold leading-tight md:text-6xl lg:text-7xl drop-shadow-2xl">
                Your Strategic Thinking Partner,
                <br />
                <span className="text-gradient">On Demand</span>
              </h1>

              {/* Subtitle */}
              <p className="mb-8 mx-auto max-w-2xl text-lg text-silver-light md:text-xl leading-relaxed">
                The sounding board you need, whenever you need it. No scheduling, full context,
                real coaching frameworks. Voice or text.
              </p>

              {/* CTA Buttons */}
              <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link href="/auth/signup" className="btn btn-primary shadow-lg shadow-white/10">
                  Start Talking to Your Coach
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

              {/* Features bar */}
              <div className="mx-auto max-w-3xl">
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
                  <div className="group flex items-center gap-2 text-silver-dark transition-colors hover:text-silver">
                    <Brain className="h-4 w-4 opacity-50 group-hover:opacity-100" />
                    <span className="text-sm font-medium">Knows Your Context</span>
                  </div>
                  <div className="h-1 w-1 rounded-full bg-white/10" />
                  <div className="group flex items-center gap-2 text-silver-dark transition-colors hover:text-silver">
                    <Mic className="h-4 w-4 opacity-50 group-hover:opacity-100" />
                    <span className="text-sm font-medium">Voice or Text</span>
                  </div>
                  <div className="h-1 w-1 rounded-full bg-white/10" />
                  <div className="group flex items-center gap-2 text-silver-dark transition-colors hover:text-silver">
                    <Database className="h-4 w-4 opacity-50 group-hover:opacity-100" />
                    <span className="text-sm font-medium">Remembers Everything</span>
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
                Not Just AI Chat. <span className="text-gradient">Real Coaching.</span>
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-silver-light">
                Coach OS combines proven coaching frameworks with AI that knows your business inside and out.
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
                <h3 className="mb-3 text-xl font-semibold">Knows Your Context</h3>
                <p className="text-sm text-silver-light">
                  Your industry, role, company stage, goals, and challenges. No re-explaining every time.
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
                <h3 className="mb-3 text-xl font-semibold">Asks, Doesn't Tell</h3>
                <p className="text-sm text-silver-light">
                  Uses Socratic method to help you think clearly, not just tell you what to do.
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
                  Recalls conversations from weeks ago and tracks your progress automatically.
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
                  Every conversation leads to concrete next steps. Tracks your commitments.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Who It's For */}
        <section className="relative border-t border-white/5 py-24">
          <div className="container mx-auto px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-4 font-serif text-4xl font-bold md:text-5xl">
                Built for <span className="text-gradient">Busy Founders</span>
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-silver-light">
                Whether you need a quick sounding board or deep strategic thinking time
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Use Case 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="card"
              >
                <p className="mb-4 text-lg font-medium text-silver">"Should I take this investor meeting?"</p>
                <p className="text-sm text-silver-light">
                  Quick strategic decisions. Coach knows your fundraising goals and can help you think through the tradeoffs in 2 minutes.
                </p>
              </motion.div>

              {/* Use Case 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="card"
              >
                <p className="mb-4 text-lg font-medium text-silver">"Help me prep for this board meeting"</p>
                <p className="text-sm text-silver-light">
                  Walk through your talking points. Anticipate tough questions. Get your narrative tight before the big moment.
                </p>
              </motion.div>

              {/* Use Case 3 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="card"
              >
                <p className="mb-4 text-lg font-medium text-silver">"I'm struggling with a difficult team decision"</p>
                <p className="text-sm text-silver-light">
                  Think through sensitive situations with someone who has no agenda. Work through the people dynamics.
                </p>
              </motion.div>

              {/* Use Case 4 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="card"
              >
                <p className="mb-4 text-lg font-medium text-silver">"What should I actually focus on this quarter?"</p>
                <p className="text-sm text-silver-light">
                  Cut through the noise. Book a structured session to set priorities that align with your real goals.
                </p>
              </motion.div>

              {/* Use Case 5 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                className="card"
              >
                <p className="mb-4 text-lg font-medium text-silver">"I need to think through this product strategy"</p>
                <p className="text-sm text-silver-light">
                  Brainstorm and pressure-test your ideas. Coach asks the questions that help you see blind spots.
                </p>
              </motion.div>

              {/* Use Case 6 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                viewport={{ once: true }}
                className="card"
              >
                <p className="mb-4 text-lg font-medium text-silver">"I'm overwhelmed and don't know where to start"</p>
                <p className="text-sm text-silver-light">
                  When everything feels urgent, Coach helps you step back, breathe, and find the one thing to focus on.
                </p>
              </motion.div>
            </div>

            {/* ADHD-specific callout */}
            <div className="mt-12 text-center">
              <Link
                href="/adhd"
                className="inline-flex items-center gap-2 text-silver-dark hover:text-silver transition-colors"
              >
                <Brain className="h-4 w-4" />
                <span className="text-sm">Have ADHD? We built a special coaching mode for you →</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Structured Sessions */}
        <section className="relative border-t border-white/5 py-24">
          <div className="container mx-auto px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-4 font-serif text-4xl font-bold md:text-5xl">
                Quick Chats & <span className="text-gradient">Deep Sessions</span>
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-silver-light">
                Two minutes or forty-five. Coach adapts to what you need right now.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Quick Check-ins */}
              <div className="card">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
                  <Zap className="h-5 w-5 text-green-400" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Quick Check-ins</h3>
                <p className="text-sm text-silver-light mb-4">
                  2-10 minute conversations when you need a quick sounding board. No scheduling needed - just open the app and start talking.
                </p>
                <ul className="space-y-2 text-sm text-silver-light">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Decision validation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Meeting prep
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Quick brainstorms
                  </li>
                </ul>
              </div>

              {/* Structured Sessions */}
              <div className="card">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
                  <Target className="h-5 w-5 text-purple-400" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Structured Sessions</h3>
                <p className="text-sm text-silver-light mb-4">
                  30-45 minute guided sessions using proven coaching frameworks like GROW. Book time when you need to go deep.
                </p>
                <ul className="space-y-2 text-sm text-silver-light">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-purple-500" />
                    Strategic planning
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-purple-500" />
                    Problem solving
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-purple-500" />
                    Goal setting & reviews
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Memory Section */}
        <section className="relative border-t border-white/5 py-24">
          <div className="container mx-auto px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-4 font-serif text-4xl font-bold md:text-5xl">
                A Coach That <span className="text-gradient">Actually Remembers</span>
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-silver-light">
                Unlike generic AI, Coach OS builds understanding over time. It knows your history.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* Memory */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="card group hover:border-silver/30 transition-all duration-300"
              >
                <div className="mb-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-deep-blue-800 to-silver-darker">
                    <Brain className="h-6 w-6 text-silver" />
                  </div>
                  <h3 className="text-2xl font-semibold">Long-Term Memory</h3>
                </div>
                <p className="mb-6 text-silver-light">
                  That strategy conversation from 3 weeks ago? Coach remembers. Your goals, your decisions, your progress - all tracked.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                    <p className="text-sm text-silver-light">
                      <span className="font-semibold text-silver">Recalls past discussions</span> - "Remember when we talked about hiring?"
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                    <p className="text-sm text-silver-light">
                      <span className="font-semibold text-silver">Tracks your progress</span> - knows what you've accomplished
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                    <p className="text-sm text-silver-light">
                      <span className="font-semibold text-silver">Follows up on commitments</span> - gentle accountability
                    </p>
                  </li>
                </ul>
              </motion.div>

              {/* Tasks */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="card group hover:border-silver/30 transition-all duration-300"
              >
                <div className="mb-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-deep-blue-800 to-silver-darker">
                    <ListTodo className="h-6 w-6 text-silver" />
                  </div>
                  <h3 className="text-2xl font-semibold">Automatic Action Capture</h3>
                </div>
                <p className="mb-6 text-silver-light">
                  Mention "I need to email the board by Friday" and it becomes a tracked action item. No extra work.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                    <p className="text-sm text-silver-light">
                      <span className="font-semibold text-silver">Works in voice or text</span> - speak naturally
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                    <p className="text-sm text-silver-light">
                      <span className="font-semibold text-silver">Clean, actionable format</span> - not vague notes
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                    <p className="text-sm text-silver-light">
                      <span className="font-semibold text-silver">Coach checks in</span> - "How did that board email go?"
                    </p>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Voice & Text Section */}
        <section className="relative border-t border-white/5 py-24">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-4xl">
              <div className="mb-12 text-center">
                <h2 className="mb-4 font-serif text-4xl font-bold md:text-5xl">
                  Talk or Type - <span className="text-gradient">Your Choice</span>
                </h2>
                <p className="text-lg text-silver-light">
                  Voice when you're driving. Text when you're in a meeting. Coach OS adapts.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="card">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
                    <Mic className="h-5 w-5 text-purple-400" />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold">Voice Conversations</h3>
                  <p className="text-sm text-silver-light">
                    Natural back-and-forth conversations. Human-quality voice. Perfect for driving, walking, or when you think better out loud.
                  </p>
                </div>

                <div className="card">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
                    <MessageSquare className="h-5 w-5 text-blue-400" />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold">Text Chat</h3>
                  <p className="text-sm text-silver-light">
                    Same smart coaching, just typed. Full history searchable. Perfect for quiet thinking or quick notes between meetings.
                  </p>
                </div>

                <div className="card">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
                    <Clock className="h-5 w-5 text-green-400" />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold">Available 24/7</h3>
                  <p className="text-sm text-silver-light">
                    3am anxiety? Coach is there. Quick check before a call? No scheduling. Your coach fits your unpredictable schedule.
                  </p>
                </div>

                <div className="card">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20">
                    <Target className="h-5 w-5 text-amber-400" />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold">Full Context</h3>
                  <p className="text-sm text-silver-light">
                    Your industry, role, goals, challenges - Coach knows it all. No explaining your situation every time.
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
                Ready to Think <span className="text-gradient">More Clearly</span>?
              </h2>
              <p className="mb-8 text-lg text-silver-light">
                Join founders who've found their strategic thinking partner.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link href="/auth/signup" className="btn btn-primary">
                  Start Talking to Your Coach
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <button
                  onClick={() => setShowVoiceDemo(true)}
                  className="btn btn-secondary"
                >
                  <Mic className="h-4 w-4" />
                  Try a Voice Demo
                </button>
              </div>
              <p className="mt-6 text-sm text-gray-500">Free to try. No credit card required.</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-12">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="flex flex-col items-center justify-center gap-6">
              <a
                href="https://thriveventurelabs.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-gray-400 transition-all hover:border-white/20 hover:bg-white/10"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4z" fill="#2dd4bf" fillOpacity="0.2" stroke="#2dd4bf" strokeWidth="1.5"/>
                  <path d="M9 12l2 2 4-4" stroke="#2dd4bf" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="flex flex-col">
                  <span className="text-xs font-medium text-white">Thrive Venture Labs</span>
                  <span className="text-[10px] opacity-60">Part of the portfolio</span>
                </span>
              </a>
              <p className="text-xs text-gray-500">© {new Date().getFullYear()} Coach OS. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}
