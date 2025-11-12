'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MessageSquare, Calendar, Target, ArrowRight, MessageCircle, Mic, ListTodo } from 'lucide-react'
import { FeedbackModal } from '@/components/FeedbackModal'

interface DashboardClientProps {
  profile: {
    full_name: string | null
  }
  goalsCount: number | null
  conversationsCount: number | null
}

export function DashboardClient({ profile, goalsCount, conversationsCount }: DashboardClientProps) {
  const [feedbackOpen, setFeedbackOpen] = useState(false)

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto">
        {/* Header with Feedback Button */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">Dashboard</h1>
            <p className="text-silver-light">
              Welcome back, {profile.full_name || 'there'}
            </p>
          </div>

          <button
            onClick={() => setFeedbackOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-titanium-900 px-4 py-2 text-sm font-medium text-silver-light transition-colors hover:border-white/20 hover:bg-titanium-800 hover:text-silver"
          >
            <MessageCircle className="h-4 w-4" />
            Send Feedback
          </button>
        </div>

        {/* Dashboard Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/chat/new"
            className="card group cursor-pointer transition-all hover:border-silver/30 hover:shadow-lg"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-deep-blue-800 to-silver-darker">
              <MessageSquare className="h-6 w-6 text-silver" />
            </div>
            <h3 className="mb-2 flex items-center justify-between text-lg font-semibold">
              Quick Check-in
              <ArrowRight className="h-5 w-5 opacity-0 transition-opacity group-hover:opacity-100" />
            </h3>
            <p className="text-sm text-silver-light">
              Start a conversation with your coach
            </p>
            {conversationsCount !== null && conversationsCount > 0 && (
              <p className="mt-3 text-xs text-gray-500">
                {conversationsCount} conversation{conversationsCount !== 1 ? 's' : ''} total
              </p>
            )}
          </Link>

          <Link
            href="/tasks"
            className="card group cursor-pointer transition-all hover:border-silver/30 hover:shadow-lg"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-deep-blue-800 to-silver-darker">
              <ListTodo className="h-6 w-6 text-silver" />
            </div>
            <h3 className="mb-2 flex items-center justify-between text-lg font-semibold">
              Task Manager
              <ArrowRight className="h-5 w-5 opacity-0 transition-opacity group-hover:opacity-100" />
            </h3>
            <p className="text-sm text-silver-light">
              Manage action items from your coaching sessions
            </p>
            <p className="mt-3 text-xs text-gray-500">Coming soon</p>
          </Link>

          <Link
            href="/brain-dump"
            className="card group cursor-pointer transition-all hover:border-silver/30 hover:shadow-lg"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-deep-blue-800 to-silver-darker">
              <Mic className="h-6 w-6 text-silver" />
            </div>
            <h3 className="mb-2 flex items-center justify-between text-lg font-semibold">
              Brain Dump
              <ArrowRight className="h-5 w-5 opacity-0 transition-opacity group-hover:opacity-100" />
            </h3>
            <p className="text-sm text-silver-light">
              Quick capture your thoughts and to-dos
            </p>
            <p className="mt-3 text-xs text-gray-500">Coming soon</p>
          </Link>

          <Link
            href="/sessions"
            className="card group cursor-pointer transition-all hover:border-silver/30 hover:shadow-lg"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-deep-blue-800 to-silver-darker">
              <Calendar className="h-6 w-6 text-silver" />
            </div>
            <h3 className="mb-2 flex items-center justify-between text-lg font-semibold">
              Book Session
              <ArrowRight className="h-5 w-5 opacity-0 transition-opacity group-hover:opacity-100" />
            </h3>
            <p className="text-sm text-silver-light">
              Schedule a structured coaching session
            </p>
            <p className="mt-3 text-xs text-gray-500">Coming soon</p>
          </Link>

          <Link
            href="/goals"
            className="card group cursor-pointer transition-all hover:border-silver/30 hover:shadow-lg"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-deep-blue-800 to-silver-darker">
              <Target className="h-6 w-6 text-silver" />
            </div>
            <h3 className="mb-2 flex items-center justify-between text-lg font-semibold">
              Your Goals
              <ArrowRight className="h-5 w-5 opacity-0 transition-opacity group-hover:opacity-100" />
            </h3>
            <p className="text-sm text-silver-light">
              Track your progress and commitments
            </p>
            {goalsCount !== null && (
              <p className="mt-3 text-xs text-gray-500">
                {goalsCount} active goal{goalsCount !== 1 ? 's' : ''}
              </p>
            )}
          </Link>
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </div>
  )
}
