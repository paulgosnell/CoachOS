'use client'

import { useEffect, useState } from 'react'
import { MessageSquare, ArrowLeft, Clock, TrendingUp, Target, Sparkles, Brain, ChevronDown, ChevronUp, Lightbulb, ListChecks } from 'lucide-react'
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
  has_summary: boolean
  summary_preview: string | null
  summary_topics: string[]
  summary_user_state: string | null
  summary_breakthroughs: string[]
  summary_decisions: string[]
}

export default function AdminSessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedSummaries, setExpandedSummaries] = useState<Set<string>>(new Set())

  const toggleSummary = (sessionId: string) => {
    setExpandedSummaries(prev => {
      const next = new Set(prev)
      if (next.has(sessionId)) {
        next.delete(sessionId)
      } else {
        next.add(sessionId)
      }
      return next
    })
  }

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

          <div className="card">
            <div className="text-sm text-silver-light">Summarized</div>
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-400" />
              <span className="text-2xl font-bold">
                {sessions.filter((s) => s.has_summary).length}
              </span>
              <span className="text-sm text-silver-light">/ {sessions.length}</span>
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
                    {session.has_summary && (
                      <span title="Has AI summary">
                        <Brain className="h-4 w-4 text-purple-400" />
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

              {/* Summary Preview */}
              {session.has_summary && (
                <div className="mt-4 border-t border-titanium-800 pt-4">
                  <button
                    onClick={() => toggleSummary(session.id)}
                    className="flex w-full items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-2 text-sm font-medium text-purple-400">
                      <Brain className="h-4 w-4" />
                      AI Summary
                      {session.summary_user_state && (
                        <span className="rounded bg-titanium-800 px-2 py-0.5 text-xs capitalize text-silver-light">
                          {session.summary_user_state}
                        </span>
                      )}
                    </div>
                    {expandedSummaries.has(session.id) ? (
                      <ChevronUp className="h-4 w-4 text-silver-light" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-silver-light" />
                    )}
                  </button>

                  {expandedSummaries.has(session.id) && (
                    <div className="mt-3 space-y-3">
                      {/* Summary text */}
                      <p className="text-sm text-silver">{session.summary_preview}</p>

                      {/* Topics */}
                      {session.summary_topics.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {session.summary_topics.map((topic, i) => (
                            <span key={i} className="rounded bg-blue-500/10 px-2 py-0.5 text-xs text-blue-300">
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Breakthroughs & Decisions */}
                      <div className="grid gap-3 sm:grid-cols-2">
                        {session.summary_breakthroughs.length > 0 && (
                          <div className="rounded-lg bg-yellow-500/5 p-3">
                            <div className="mb-2 flex items-center gap-1 text-xs font-medium text-yellow-400">
                              <Lightbulb className="h-3 w-3" />
                              Breakthroughs
                            </div>
                            <ul className="space-y-1">
                              {session.summary_breakthroughs.slice(0, 3).map((b, i) => (
                                <li key={i} className="text-xs text-silver">{b}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {session.summary_decisions.length > 0 && (
                          <div className="rounded-lg bg-green-500/5 p-3">
                            <div className="mb-2 flex items-center gap-1 text-xs font-medium text-green-400">
                              <ListChecks className="h-3 w-3" />
                              Decisions
                            </div>
                            <ul className="space-y-1">
                              {session.summary_decisions.slice(0, 3).map((d, i) => (
                                <li key={i} className="text-xs text-silver">{d}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-4 flex items-center justify-between">
                <Link
                  href={`/admin/sessions/${session.id}`}
                  className="text-sm text-deep-blue-600 hover:text-deep-blue-500"
                >
                  View Details →
                </Link>
                {!session.has_summary && (
                  <span className="text-xs text-silver-light">No summary yet</span>
                )}
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
