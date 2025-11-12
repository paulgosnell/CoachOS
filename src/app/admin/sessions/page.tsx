'use client'

import { useEffect, useState } from 'react'
import { MessageSquare, ArrowLeft, Clock, TrendingUp, Target, Sparkles } from 'lucide-react'
import Link from 'next/link'

interface Session {
  id: string
  user_id: string
  user_email: string
  user_name: string | null
  title: string | null
  session_type: string
  framework_used: string | null
  started_at: string
  ended_at: string | null
  duration_seconds: number | null
  sentiment: string | null
  success_rating: number | null
  value_score: number | null
  message_count: number
  sentiment_score: number | null
  clarity_score: number | null
  depth_score: number | null
  action_items_count: number | null
  breakthrough_detected: boolean | null
}

export default function AdminSessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = async () => {
    try {
      const response = await fetch('/api/admin/sessions')
      if (!response.ok) throw new Error('Failed to load sessions')

      const data = await response.json()
      setSessions(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'In progress'
    const mins = Math.floor(seconds / 60)
    if (mins < 60) return `${mins}m`
    const hours = Math.floor(mins / 60)
    return `${hours}h ${mins % 60}m`
  }

  const getSentimentBadge = (sentiment: string | null) => {
    if (!sentiment) return null
    const colors = {
      positive: 'bg-green-500/10 text-green-400',
      neutral: 'bg-gray-500/10 text-gray-400',
      negative: 'bg-red-500/10 text-red-400',
      mixed: 'bg-yellow-500/10 text-yellow-400',
    }
    return (
      <span className={`rounded-lg px-2 py-1 text-xs ${colors[sentiment as keyof typeof colors] || colors.neutral}`}>
        {sentiment}
      </span>
    )
  }

  const getFrameworkBadge = (framework: string | null) => {
    if (!framework) return null
    return (
      <span className="rounded-lg bg-blue-500/10 px-2 py-1 text-xs text-blue-400">
        {framework.toUpperCase()}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-titanium-950">
        <div className="text-silver-light">Loading sessions...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-titanium-950">
        <div className="text-center">
          <div className="mb-4 text-red-400">{error}</div>
          <Link href="/admin" className="btn btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-titanium-950 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="mb-4 inline-flex items-center gap-2 text-sm text-silver-light hover:text-silver"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Admin Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold">Coaching Sessions</h1>
              <p className="text-silver-light">{sessions.length} total sessions</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card">
            <div className="text-sm text-silver-light">Avg Duration</div>
            <div className="text-2xl font-bold">
              {formatDuration(
                sessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / sessions.length
              )}
            </div>
          </div>

          <div className="card">
            <div className="text-sm text-silver-light">Avg Messages</div>
            <div className="text-2xl font-bold">
              {Math.round(sessions.reduce((sum, s) => sum + (s.message_count || 0), 0) / sessions.length)}
            </div>
          </div>

          <div className="card">
            <div className="text-sm text-silver-light">Breakthroughs</div>
            <div className="text-2xl font-bold">
              {sessions.filter((s) => s.breakthrough_detected).length}
            </div>
          </div>

          <div className="card">
            <div className="text-sm text-silver-light">Avg Clarity</div>
            <div className="text-2xl font-bold">
              {(
                (sessions.reduce((sum, s) => sum + (s.clarity_score || 0), 0) / sessions.length) *
                100
              ).toFixed(0)}
              %
            </div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="card">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="font-semibold">{session.title || 'Untitled Session'}</div>
                    {session.breakthrough_detected && (
                      <span title="Breakthrough moment!">
                        <Sparkles className="h-4 w-4 text-yellow-400" />
                      </span>
                    )}
                  </div>
                  <div className="mb-3 text-sm text-silver-light">
                    {session.user_name || session.user_email} • {formatDate(session.started_at)}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {getFrameworkBadge(session.framework_used)}
                    {getSentimentBadge(session.sentiment)}
                    {session.session_type && (
                      <span className="rounded-lg bg-purple-500/10 px-2 py-1 text-xs text-purple-400">
                        {session.session_type}
                      </span>
                    )}
                  </div>
                </div>

                <div className="ml-4 text-right">
                  {session.duration_seconds && (
                    <div className="mb-2 flex items-center gap-1 text-sm text-silver-light">
                      <Clock className="h-4 w-4" />
                      {formatDuration(session.duration_seconds)}
                    </div>
                  )}
                  {session.success_rating && (
                    <div className="text-sm text-silver-light">
                      Success: {session.success_rating}/5
                    </div>
                  )}
                </div>
              </div>

              {/* Metrics */}
              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
                <div className="rounded-lg bg-titanium-900/50 p-3">
                  <div className="mb-1 text-xs text-silver-light">Messages</div>
                  <div className="text-lg font-semibold">{session.message_count}</div>
                </div>

                {session.clarity_score !== null && (
                  <div className="rounded-lg bg-titanium-900/50 p-3">
                    <div className="mb-1 text-xs text-silver-light">Clarity</div>
                    <div className="text-lg font-semibold">
                      {(session.clarity_score * 100).toFixed(0)}%
                    </div>
                  </div>
                )}

                {session.depth_score !== null && (
                  <div className="rounded-lg bg-titanium-900/50 p-3">
                    <div className="mb-1 text-xs text-silver-light">Depth</div>
                    <div className="text-lg font-semibold">
                      {(session.depth_score * 100).toFixed(0)}%
                    </div>
                  </div>
                )}

                {session.action_items_count !== null && (
                  <div className="rounded-lg bg-titanium-900/50 p-3">
                    <div className="mb-1 text-xs text-silver-light">Action Items</div>
                    <div className="text-lg font-semibold">{session.action_items_count}</div>
                  </div>
                )}

                {session.value_score !== null && (
                  <div className="rounded-lg bg-titanium-900/50 p-3">
                    <div className="mb-1 text-xs text-silver-light">Value</div>
                    <div className="text-lg font-semibold">
                      {(session.value_score * 100).toFixed(0)}%
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <Link
                  href={`/admin/sessions/${session.id}`}
                  className="text-sm text-deep-blue-600 hover:text-deep-blue-500"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}

          {sessions.length === 0 && (
            <div className="card text-center">
              <div className="py-12">
                <MessageSquare className="mx-auto mb-4 h-12 w-12 text-gray-500" />
                <h3 className="mb-2 text-lg font-semibold">No sessions yet</h3>
                <p className="text-sm text-silver-light">
                  Sessions will appear here once users start chatting
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
