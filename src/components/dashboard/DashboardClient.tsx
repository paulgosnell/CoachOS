'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MessageSquare, Calendar, Target, ArrowRight, MessageCircle, Mic, ListTodo, Phone, Settings, Brain, Sparkles, Lock } from 'lucide-react'
import { FeedbackModal } from '@/components/FeedbackModal'
import { MiniProgressChart } from './MiniProgressChart'
import { trackDashboardCardClick, trackSettingsOpened, trackFeedbackOpened } from '@/lib/analytics'

interface DashboardClientProps {
  profile: {
    full_name: string | null
  }
  goalsCount: number | null
  conversationsCount: number | null
  isPro: boolean
}

export function DashboardClient({ profile, goalsCount, conversationsCount, isPro }: DashboardClientProps) {
  const [feedbackOpen, setFeedbackOpen] = useState(false)

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="mx-auto max-w-6xl">
        {/* Minimal Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-medium text-silver-light">
              {profile.full_name?.split(' ')[0] || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {!isPro && (
              <Link
                href="/subscribe"
                className="flex items-center gap-1 rounded-full bg-gradient-to-r from-deep-blue-600 to-purple-600 px-3 py-1 text-xs font-semibold transition-all hover:from-deep-blue-500 hover:to-purple-500"
              >
                <Sparkles className="h-3 w-3" />
                Upgrade
              </Link>
            )}
            <Link
              href="/settings"
              className="text-silver-light transition-colors hover:text-silver"
              onClick={() => trackSettingsOpened()}
            >
              <Settings className="h-5 w-5" />
            </Link>
            <button
              onClick={() => {
                trackFeedbackOpened('dashboard')
                setFeedbackOpen(true)
              }}
              className="text-silver-light transition-colors hover:text-silver"
            >
              <MessageCircle className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Section Header for Actions */}
        <div className="mb-4">
          <h2 className="font-serif text-2xl font-medium text-silver-light">
            Your Coaching Tools
          </h2>
          <p className="text-sm text-silver-dark">
            Choose how you'd like to engage with your coach today
          </p>
        </div>

        {/* Dashboard Cards - Compact Layout */}
        <div className="flex flex-col gap-3">
          {/* Row 1: Progress - Full width with mini data viz */}
          <Link
            href={isPro ? "/progress" : "/subscribe"}
            className="card group relative cursor-pointer p-4 transition-all hover:border-silver/30"
            onClick={() => trackDashboardCardClick('progress')}
          >
            {!isPro && (
              <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-gradient-to-r from-deep-blue-600 to-purple-600 px-2 py-0.5 text-xs font-semibold">
                <Sparkles className="h-2.5 w-2.5" />
                PRO
              </div>
            )}
            <MiniProgressChart isPro={isPro} />
          </Link>

          {/* Row 2: Chat and Voice */}
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/chat/new"
              className="card group cursor-pointer p-4 transition-all hover:border-silver/30"
              onClick={() => trackDashboardCardClick('chat')}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-deep-blue-800/50">
                  <MessageSquare className="h-4 w-4 text-silver" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-silver">Chat</h3>
                  <p className="text-xs text-silver-light">Text conversation</p>
                </div>
              </div>
            </Link>

            <Link
              href={isPro ? "/voice-coach" : "/subscribe"}
              className="card group relative cursor-pointer p-4 transition-all hover:border-silver/30"
              onClick={() => trackDashboardCardClick('voice')}
            >
              {!isPro && (
                <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-gradient-to-r from-deep-blue-600 to-purple-600 px-1.5 py-0.5 text-[10px] font-semibold">
                  <Sparkles className="h-2 w-2" />
                  PRO
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-deep-blue-800/50">
                  {!isPro ? (
                    <Lock className="h-4 w-4 text-silver-light" />
                  ) : (
                    <Phone className="h-4 w-4 text-silver" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-silver">Voice</h3>
                  <p className="text-xs text-silver-light">Live conversation</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Row 3: Coaching Sessions and Goals */}
          <div className="grid grid-cols-2 gap-3">
            <Link
              href={isPro ? "/sessions" : "/subscribe"}
              className="card group relative cursor-pointer p-4 transition-all hover:border-silver/30"
              onClick={() => trackDashboardCardClick('sessions')}
            >
              {!isPro && (
                <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-gradient-to-r from-deep-blue-600 to-purple-600 px-1.5 py-0.5 text-[10px] font-semibold">
                  <Sparkles className="h-2 w-2" />
                  PRO
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-deep-blue-800/50">
                  {!isPro ? (
                    <Lock className="h-4 w-4 text-silver-light" />
                  ) : (
                    <Calendar className="h-4 w-4 text-silver" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-silver">Sessions</h3>
                  <p className="text-xs text-silver-light">Structured coaching</p>
                </div>
              </div>
            </Link>

            <Link
              href={isPro ? "/goals" : "/subscribe"}
              className="card group relative cursor-pointer p-4 transition-all hover:border-silver/30"
              onClick={() => trackDashboardCardClick('goals')}
            >
              {!isPro && (
                <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-gradient-to-r from-deep-blue-600 to-purple-600 px-1.5 py-0.5 text-[10px] font-semibold">
                  <Sparkles className="h-2 w-2" />
                  PRO
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-deep-blue-800/50">
                  {!isPro ? (
                    <Lock className="h-4 w-4 text-silver-light" />
                  ) : (
                    <Target className="h-4 w-4 text-silver" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-silver">Goals</h3>
                  <p className="text-xs text-silver-light">Track objectives</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Row 4: Tasks and Brain Dump */}
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/tasks"
              className="card group cursor-pointer p-4 transition-all hover:border-silver/30"
              onClick={() => trackDashboardCardClick('tasks')}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-deep-blue-800/50">
                  <ListTodo className="h-4 w-4 text-silver" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-silver">Tasks</h3>
                  <p className="text-xs text-silver-light">Action items</p>
                </div>
              </div>
            </Link>

            <div className="card group cursor-not-allowed p-4 bg-titanium-900/30 opacity-60">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-deep-blue-800/50">
                  <Brain className="h-4 w-4 text-silver" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-silver">Brain Dump</h3>
                  <p className="text-xs text-silver-light">Coming soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </div>
  )
}
