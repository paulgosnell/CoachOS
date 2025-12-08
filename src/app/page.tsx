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
  Battery,
  Focus,
  Heart,
  Flame,
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
                <Brain className="h-4 w-4 text-silver" />
                <span className="text-sm font-semibold uppercase tracking-wider text-silver">
                  Built for ADHD Founders
                </span>
              </div>

              {/* Headline */}
              <h1 className="mb-6 font-serif text-5xl font-bold leading-tight md:text-6xl lg:text-7xl drop-shadow-2xl">
                When Your Brain Has
                <br />
                <span className="text-gradient">47 Tabs Open</span>
              </h1>

              {/* Subtitle */}
              <p className="mb-8 mx-auto max-w-2xl text-lg text-silver-light md:text-xl leading-relaxed">
                Coach OS helps you focus on the one that matters. An AI coach that works
                <em> with</em> your brain, not against it. No judgment, just forward momentum.
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

              {/* Social Proof */}
              <div className="mx-auto max-w-3xl">
                <p className="mb-6 text-center text-sm text-silver-dark/80">
                  Built by a founder with ADHD, for founders with ADHD
                </p>
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
                  <div className="group flex items-center gap-2 text-silver-dark transition-colors hover:text-silver">
                    <Brain className="h-4 w-4 opacity-50 group-hover:opacity-100" />
                    <span className="text-sm font-medium">Reads Your Energy</span>
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

        {/* ADHD-Specific Coaching Section */}
        <section id="how-it-works" className="relative border-t border-white/5 py-24">
          <div className="container mx-auto px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-4 font-serif text-4xl font-bold md:text-5xl">
                A Coach That <span className="text-gradient">Reads Your Energy</span>
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-silver-light">
                ADHD means your energy and focus fluctuate. Coach OS detects where you're at and adapts instantly.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Support Mode */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="card group hover:-translate-y-2 transition-all duration-300 border-l-4 border-l-blue-500"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20">
                    <Heart className="h-5 w-5 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold">Support Mode</h3>
                </div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-blue-400">When you're struggling</p>
                <p className="text-sm text-silver-light">
                  "I'm overwhelmed" or "can't focus today" triggers warm, grounding support.
                  We lower the bar together and find one tiny win.
                </p>
              </motion.div>

              {/* Momentum Mode */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="card group hover:-translate-y-2 transition-all duration-300 border-l-4 border-l-green-500"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
                    <Zap className="h-5 w-5 text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold">Momentum Mode</h3>
                </div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-green-400">When you're in flow</p>
                <p className="text-sm text-silver-light">
                  Already working on something? Coach matches your energy - quick, direct, no big-picture questions to slow you down.
                </p>
              </motion.div>

              {/* Strategic Mode */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="card group hover:-translate-y-2 transition-all duration-300 border-l-4 border-l-purple-500"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20">
                    <Target className="h-5 w-5 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold">Strategic Mode</h3>
                </div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-purple-400">When you're flying high</p>
                <p className="text-sm text-silver-light">
                  "Had a great day!" means it's time to zoom out. Let's think bigger - priorities, patterns, what moves the needle most.
                </p>
              </motion.div>

              {/* Pattern Mode */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="card group hover:-translate-y-2 transition-all duration-300 border-l-4 border-l-amber-500"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20">
                    <Brain className="h-5 w-5 text-amber-400" />
                  </div>
                  <h3 className="text-lg font-semibold">Pattern Mode</h3>
                </div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-amber-400">When you're reflecting</p>
                <p className="text-sm text-silver-light">
                  "Why do I always..." triggers curious exploration. We understand your ADHD patterns together without judgment.
                </p>
              </motion.div>
            </div>

            {/* Key Principles */}
            <div className="mt-16 grid gap-4 md:grid-cols-3">
              <div className="rounded-xl bg-titanium-900/30 p-6 text-center">
                <p className="mb-2 text-2xl font-bold text-silver">One Thing</p>
                <p className="text-sm text-silver-light">Never lists. One question, one focus, one step at a time.</p>
              </div>
              <div className="rounded-xl bg-titanium-900/30 p-6 text-center">
                <p className="mb-2 text-2xl font-bold text-silver">No Shame</p>
                <p className="text-sm text-silver-light">Only forward. We ask "what got in the way?" not "why didn't you?"</p>
              </div>
              <div className="rounded-xl bg-titanium-900/30 p-6 text-center">
                <p className="mb-2 text-2xl font-bold text-silver">Your Memory</p>
                <p className="text-sm text-silver-light">We remember everything so you don't have to. Your external brain.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pain Points Section - Speaking to ADHD struggles */}
        <section className="relative border-t border-white/5 py-24">
          <div className="container mx-auto px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-4 font-serif text-4xl font-bold md:text-5xl">
                Sound <span className="text-gradient">Familiar?</span>
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-silver-light">
                These aren't character flaws. They're how ADHD brains work. Coach OS is built to help.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Pain Point 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="card"
              >
                <p className="mb-4 text-lg font-medium text-silver">"I know what I should be doing, but I just... can't start."</p>
                <p className="text-sm text-silver-light">
                  <span className="text-green-400">Coach helps:</span> We find the tiniest first step that feels doable right now. Not the "right" thing - the thing you can actually do.
                </p>
              </motion.div>

              {/* Pain Point 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="card"
              >
                <p className="mb-4 text-lg font-medium text-silver">"I have so much to do that I end up doing nothing."</p>
                <p className="text-sm text-silver-light">
                  <span className="text-green-400">Coach helps:</span> We pick ONE thing together. The coach knows your goals and helps you focus on what actually matters.
                </p>
              </motion.div>

              {/* Pain Point 3 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="card"
              >
                <p className="mb-4 text-lg font-medium text-silver">"I keep forgetting what I committed to."</p>
                <p className="text-sm text-silver-light">
                  <span className="text-green-400">Coach helps:</span> We remember so you don't have to. Your goals, your tasks, your patterns - all tracked automatically.
                </p>
              </motion.div>

              {/* Pain Point 4 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="card"
              >
                <p className="mb-4 text-lg font-medium text-silver">"Some days I'm on fire. Other days I can barely function."</p>
                <p className="text-sm text-silver-light">
                  <span className="text-green-400">Coach helps:</span> We adapt to where you are. High energy? Let's think big. Low energy? Let's just get one tiny win.
                </p>
              </motion.div>

              {/* Pain Point 5 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                className="card"
              >
                <p className="mb-4 text-lg font-medium text-silver">"I feel like I'm always busy but never making real progress."</p>
                <p className="text-sm text-silver-light">
                  <span className="text-green-400">Coach helps:</span> We connect daily tasks to your bigger goals. Are you doing what matters, or just what's urgent?
                </p>
              </motion.div>

              {/* Pain Point 6 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                viewport={{ once: true }}
                className="card"
              >
                <p className="mb-4 text-lg font-medium text-silver">"I don't have anyone to talk strategy with."</p>
                <p className="text-sm text-silver-light">
                  <span className="text-green-400">Coach helps:</span> Available 24/7 to think through decisions, brainstorm, or just process what's on your mind.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Structured Sessions */}
        <section className="relative border-t border-white/5 py-24">
          <div className="container mx-auto px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-4 font-serif text-4xl font-bold md:text-5xl">
                Deep Work When You Need It
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-silver-light">
                Beyond quick chats, book structured sessions that use proven coaching frameworks
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* GROW */}
              <div className="card group hover:border-deep-blue-500/50 transition-all">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-deep-blue-500/20">
                  <Target className="h-5 w-5 text-deep-blue-400" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">GROW Sessions</h3>
                <p className="text-sm text-silver-light mb-4">
                  Goal → Reality → Options → Will. The gold standard for working through challenges and making decisions.
                </p>
                <p className="text-xs text-silver-dark">30-45 minute guided sessions</p>
              </div>

              {/* Priority */}
              <div className="card group hover:border-purple-500/50 transition-all">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
                  <Zap className="h-5 w-5 text-purple-400" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Priority Sessions</h3>
                <p className="text-sm text-silver-light mb-4">
                  Cut through the noise. What's actually important? What can wait? What can you drop entirely?
                </p>
                <p className="text-xs text-silver-dark">Eisenhower matrix + your context</p>
              </div>

              {/* Retrospective */}
              <div className="card group hover:border-green-500/50 transition-all">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Retrospectives</h3>
                <p className="text-sm text-silver-light mb-4">
                  What worked? What didn't? What will you do differently? Learn from your patterns.
                </p>
                <p className="text-xs text-silver-dark">Weekly or monthly reviews</p>
              </div>
            </div>
          </div>
        </section>

        {/* Your External Brain Section */}
        <section className="relative border-t border-white/5 py-24">
          <div className="container mx-auto px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-4 font-serif text-4xl font-bold md:text-5xl">
                Your <span className="text-gradient">External Brain</span>
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-silver-light">
                ADHD means working memory struggles. Coach OS remembers everything so you don't have to.
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
                  <h3 className="text-2xl font-semibold">Remembers Every Conversation</h3>
                </div>
                <p className="mb-6 text-silver-light">
                  That idea you mentioned 3 weeks ago? Coach remembers. The goal you set last month? Still tracking it. The pattern in your behavior? Already noticed.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                    <p className="text-sm text-silver-light">
                      <span className="font-semibold text-silver">Recalls past discussions naturally</span> - "Remember when we talked about hiring last month?"
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                    <p className="text-sm text-silver-light">
                      <span className="font-semibold text-silver">Spots your patterns</span> - "I've noticed you tend to avoid X when Y happens"
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                    <p className="text-sm text-silver-light">
                      <span className="font-semibold text-silver">Tracks your commitments</span> - follows up on what you said you'd do
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
                  <h3 className="text-2xl font-semibold">Captures Action Items Automatically</h3>
                </div>
                <p className="mb-6 text-silver-light">
                  Say "I need to email Sarah by Friday" in conversation - it becomes a tracked task. No extra work, no forgetting.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                    <p className="text-sm text-silver-light">
                      <span className="font-semibold text-silver">Works in voice or text</span> - speak naturally, tasks get captured
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                    <p className="text-sm text-silver-light">
                      <span className="font-semibold text-silver">Clean, actionable format</span> - "Email Sarah by Friday" not "maybe think about it"
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                    <p className="text-sm text-silver-light">
                      <span className="font-semibold text-silver">Gentle accountability</span> - coach checks in on your tasks without nagging
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
                  Sometimes you want to think out loud. Sometimes you want to type. Coach OS works both ways.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="card">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
                    <Mic className="h-5 w-5 text-purple-400" />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold">Voice Conversations</h3>
                  <p className="text-sm text-silver-light">
                    Natural back-and-forth conversations. Perfect for when you're driving, walking, or just think better out loud. Human-quality voice that doesn't sound robotic.
                  </p>
                </div>

                <div className="card">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
                    <MessageSquare className="h-5 w-5 text-blue-400" />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold">Text Chat</h3>
                  <p className="text-sm text-silver-light">
                    When you need to think quietly or you're in a meeting. Same smart coaching, just typed. Full conversation history, searchable anytime.
                  </p>
                </div>

                <div className="card">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
                    <Clock className="h-5 w-5 text-green-400" />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold">Available 24/7</h3>
                  <p className="text-sm text-silver-light">
                    3am anxiety about tomorrow's presentation? Coach is there. Quick check-in between meetings? No scheduling needed. Your coach fits your schedule.
                  </p>
                </div>

                <div className="card">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20">
                    <Target className="h-5 w-5 text-amber-400" />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold">Knows Your Context</h3>
                  <p className="text-sm text-silver-light">
                    Your industry, your role, your goals, your challenges - Coach knows it all. No explaining your situation every time. Jump straight into what matters.
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
                Ready to Work <span className="text-gradient">With Your Brain</span>?
              </h2>
              <p className="mb-4 text-lg text-silver-light">
                Stop fighting your ADHD. Start working with it.
              </p>
              <p className="mb-8 text-silver-dark">
                Built by a founder with ADHD who got tired of tools that didn't get it.
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
      </main>
    </>
  )
}
