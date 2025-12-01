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

        {/* Dashboard Cards - New Layout */}
        <div className="flex flex-col gap-4">
          {/* Row 1: Progress - Full width with mini data viz */}
          <Link
            href={isPro ? "/progress" : "/subscribe"}
            className="card group relative cursor-pointer transition-all hover:border-silver/30"
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

          {/* Row 2: Chat and Voice - Separate buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/chat/new"
              className="card group cursor-pointer transition-all hover:border-silver/30"
              onClick={() => trackDashboardCardClick('chat')}
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-deep-blue-800/50">
                <MessageSquare className="h-5 w-5 text-silver" />
              </div>
              <h3 className="mb-1 text-base font-semibold text-silver">
                Chat
              </h3>
              <p className="text-sm text-silver-light">
                Text conversation
              </p>
            </Link>

            <Link
              href={isPro ? "/voice-coach" : "/subscribe"}
              className="card group relative cursor-pointer transition-all hover:border-silver/30"
              onClick={() => trackDashboardCardClick('voice')}
            >
              {!isPro && (
                <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-gradient-to-r from-deep-blue-600 to-purple-600 px-2 py-0.5 text-xs font-semibold">
                  <Sparkles className="h-2.5 w-2.5" />
                  PRO
                </div>
              )}
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-deep-blue-800/50">
                {!isPro ? (
                  <Lock className="h-5 w-5 text-silver-light" />
                ) : (
                  <Phone className="h-5 w-5 text-silver" />
                )}
              </div>
              <h3 className="mb-1 text-base font-semibold text-silver">
                Voice
              </h3>
              <p className="text-sm text-silver-light">
                Live conversation
              </p>
            </Link>
          </div>

          {/* Row 3: Coaching Sessions and Goals */}
          <div className="grid grid-cols-2 gap-4">
            <Link
              href={isPro ? "/sessions" : "/subscribe"}
              className="card group relative cursor-pointer transition-all hover:border-silver/30"
              onClick={() => trackDashboardCardClick('sessions')}
            >
              {!isPro && (
                <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-gradient-to-r from-deep-blue-600 to-purple-600 px-2 py-0.5 text-xs font-semibold">
                  <Sparkles className="h-2.5 w-2.5" />
                  PRO
                </div>
              )}
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-deep-blue-800/50">
                {!isPro ? (
                  <Lock className="h-5 w-5 text-silver-light" />
                ) : (
                  <Calendar className="h-5 w-5 text-silver" />
                )}
              </div>
              <h3 className="mb-1 text-base font-semibold text-silver">
                Coaching Sessions
              </h3>
              <p className="text-sm text-silver-light">
                Structured frameworks
              </p>
            </Link>

            <Link
              href={isPro ? "/goals" : "/subscribe"}
              className="card group relative cursor-pointer transition-all hover:border-silver/30"
              onClick={() => trackDashboardCardClick('goals')}
            >
              {!isPro && (
                <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-gradient-to-r from-deep-blue-600 to-purple-600 px-2 py-0.5 text-xs font-semibold">
                  <Sparkles className="h-2.5 w-2.5" />
                  PRO
                </div>
              )}
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-deep-blue-800/50">
                {!isPro ? (
                  <Lock className="h-5 w-5 text-silver-light" />
                ) : (
                  <Target className="h-5 w-5 text-silver" />
                )}
              </div>
              <h3 className="mb-1 text-base font-semibold text-silver">
                Goals
              </h3>
              <p className="text-sm text-silver-light">
                Track objectives
              </p>
            </Link>
          </div>

          {/* Row 4: Tasks and Brain Dump */}
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/tasks"
              className="card group cursor-pointer transition-all hover:border-silver/30"
              onClick={() => trackDashboardCardClick('tasks')}
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-deep-blue-800/50">
                <ListTodo className="h-5 w-5 text-silver" />
              </div>
              <h3 className="mb-1 text-base font-semibold text-silver">
                Tasks
              </h3>
              <p className="text-sm text-silver-light">
                Action items
              </p>
            </Link>

            <div
              className="card group cursor-not-allowed transition-all bg-titanium-900/30 opacity-60"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-deep-blue-800/50">
                <Brain className="h-5 w-5 text-silver" />
              </div>
              <h3 className="mb-1 text-base font-semibold text-silver">
                Brain Dump
              </h3>
              <p className="text-sm text-silver-light">
                Quick capture
              </p>
              <p className="mt-2 text-xs text-gray-500">Coming soon</p>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </div>
  )
}
