'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Clock,
  MessageSquare,
  User,
  Sparkles,
  FileText,
  ListChecks,
  Target,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  Brain,
  RefreshCw
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

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
  messages: Message[]
}

interface Summary {
  id: string
  summary: string
  key_topics: string[]
  decisions_made: string[]
  action_items_discussed: string[]
  goals_referenced: string[]
  blockers_identified: string[]
  breakthroughs: string[]
  patterns_noticed: string[]
  user_state: string | null
  coaching_approach_used: string | null
  session_value: string | null
  message_count: number
  generated_at: string
}

export default function AdminSessionDetailPage() {
  const params = useParams()
  const sessionId = params.id as string
  const [session, setSession] = useState<Session | null>(null)
  const [summary, setSummary] = useState<Summary | null>(null)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'summary' | 'transcript'>('summary')

  useEffect(() => {
    if (sessionId) {
      loadSession()
      loadSummary()
    }
  }, [sessionId])

  const loadSession = async () => {
    try {
      const response = await fetch(`/api/admin/sessions/${sessionId}`)
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Session not found')
        }
        throw new Error('Failed to load session')
      }

      const data = await response.json()
      setSession(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadSummary = async () => {
    try {
      const response = await fetch(`/api/admin/sessions/${sessionId}/summary`)
      if (response.ok) {
        const data = await response.json()
        if (data.exists) {
          setSummary(data.summary)
        }
      }
    } catch (err) {
      console.error('Failed to load summary:', err)
    }
  }

  const generateSummary = async () => {
    setSummaryLoading(true)
    try {
      const response = await fetch(`/api/admin/sessions/${sessionId}/summary`, {
        method: 'POST'
      })
      if (response.ok) {
        const data = await response.json()
        setSummary(data)
      }
    } catch (err) {
      console.error('Failed to generate summary:', err)
    } finally {
      setSummaryLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'In progress'
    const mins = Math.floor(seconds / 60)
    if (mins < 60) return `${mins} minutes`
    const hours = Math.floor(mins / 60)
    return `${hours}h ${mins % 60}m`
  }

  const formatMessageTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const getUserStateBadge = (state: string | null) => {
    if (!state) return null
    const colors: Record<string, string> = {
      struggling: 'bg-red-500/10 text-red-400',
      overwhelmed: 'bg-red-500/10 text-red-400',
      stuck: 'bg-orange-500/10 text-orange-400',
      confused: 'bg-yellow-500/10 text-yellow-400',
      reflective: 'bg-blue-500/10 text-blue-400',
      focused: 'bg-green-500/10 text-green-400',
      energized: 'bg-green-500/10 text-green-400',
      motivated: 'bg-emerald-500/10 text-emerald-400',
    }
    return (
      <span className={`rounded-lg px-2 py-1 text-xs capitalize ${colors[state] || 'bg-gray-500/10 text-gray-400'}`}>
        {state}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-titanium-950">
        <div className="text-silver-light">Loading session...</div>
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-titanium-950">
        <div className="text-center">
          <div className="mb-4 text-red-400">{error || 'Session not found'}</div>
          <Link href="/admin/sessions" className="btn btn-primary">
            Back to Sessions
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-titanium-950 p-6">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/sessions"
            className="mb-4 inline-flex items-center gap-2 text-sm text-silver-light hover:text-silver"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sessions
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <h1 className="text-2xl font-bold">{session.title || 'Untitled Session'}</h1>
                {session.breakthrough_detected && (
                  <span className="flex items-center gap-1 rounded-lg bg-yellow-500/10 px-2 py-1 text-xs text-yellow-400">
                    <Sparkles className="h-3 w-3" />
                    Breakthrough
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-silver-light">
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {session.user_name || session.user_email}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatDate(session.started_at)}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  {session.message_count} messages
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'summary'
                ? 'bg-deep-blue-600 text-white'
                : 'bg-titanium-800 text-silver-light hover:bg-titanium-700'
            }`}
          >
            <Brain className="h-4 w-4" />
            Summary
          </button>
          <button
            onClick={() => setActiveTab('transcript')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'transcript'
                ? 'bg-deep-blue-600 text-white'
                : 'bg-titanium-800 text-silver-light hover:bg-titanium-700'
            }`}
          >
            <FileText className="h-4 w-4" />
            Transcript
          </button>
        </div>

        {/* Summary Tab */}
        {activeTab === 'summary' && (
          <div>
            {!summary ? (
              <div className="card text-center">
                <Brain className="mx-auto mb-4 h-12 w-12 text-gray-500" />
                <h3 className="mb-2 text-lg font-semibold">No Summary Yet</h3>
                <p className="mb-4 text-sm text-silver-light">
                  Generate an AI summary to see key topics, decisions, and insights from this conversation
                </p>
                <button
                  onClick={generateSummary}
                  disabled={summaryLoading}
                  className="btn btn-primary inline-flex items-center gap-2"
                >
                  {summaryLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate Summary
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Summary Header */}
                <div className="card">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h2 className="mb-1 text-lg font-semibold">Session Summary</h2>
                      <p className="text-xs text-silver-light">
                        Generated {formatDate(summary.generated_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getUserStateBadge(summary.user_state)}
                      {summary.coaching_approach_used && (
                        <span className="rounded-lg bg-purple-500/10 px-2 py-1 text-xs capitalize text-purple-400">
                          {summary.coaching_approach_used}
                        </span>
                      )}
                      <button
                        onClick={generateSummary}
                        disabled={summaryLoading}
                        className="rounded-lg bg-titanium-800 p-2 text-silver-light hover:bg-titanium-700"
                        title="Regenerate summary"
                      >
                        <RefreshCw className={`h-4 w-4 ${summaryLoading ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <p className="mb-4 text-silver">{summary.summary}</p>

                  {summary.session_value && (
                    <div className="rounded-lg bg-green-500/5 border border-green-500/20 p-3">
                      <div className="mb-1 flex items-center gap-2 text-xs font-medium text-green-400">
                        <TrendingUp className="h-3 w-3" />
                        Value Delivered
                      </div>
                      <p className="text-sm text-silver">{summary.session_value}</p>
                    </div>
                  )}
                </div>

                {/* Key Topics */}
                {summary.key_topics.length > 0 && (
                  <div className="card">
                    <h3 className="mb-3 flex items-center gap-2 font-semibold">
                      <Target className="h-4 w-4 text-blue-400" />
                      Key Topics
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {summary.key_topics.map((topic, i) => (
                        <span key={i} className="rounded-lg bg-blue-500/10 px-3 py-1 text-sm text-blue-300">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Grid of insights */}
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Decisions Made */}
                  {summary.decisions_made.length > 0 && (
                    <div className="card">
                      <h3 className="mb-3 flex items-center gap-2 font-semibold">
                        <ListChecks className="h-4 w-4 text-green-400" />
                        Decisions Made
                      </h3>
                      <ul className="space-y-2">
                        {summary.decisions_made.map((decision, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-silver">
                            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-400" />
                            {decision}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action Items */}
                  {summary.action_items_discussed.length > 0 && (
                    <div className="card">
                      <h3 className="mb-3 flex items-center gap-2 font-semibold">
                        <ListChecks className="h-4 w-4 text-orange-400" />
                        Action Items
                      </h3>
                      <ul className="space-y-2">
                        {summary.action_items_discussed.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-silver">
                            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange-400" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Blockers */}
                  {summary.blockers_identified.length > 0 && (
                    <div className="card">
                      <h3 className="mb-3 flex items-center gap-2 font-semibold">
                        <AlertTriangle className="h-4 w-4 text-red-400" />
                        Blockers Identified
                      </h3>
                      <ul className="space-y-2">
                        {summary.blockers_identified.map((blocker, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-silver">
                            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400" />
                            {blocker}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Breakthroughs */}
                  {summary.breakthroughs.length > 0 && (
                    <div className="card">
                      <h3 className="mb-3 flex items-center gap-2 font-semibold">
                        <Lightbulb className="h-4 w-4 text-yellow-400" />
                        Breakthroughs
                      </h3>
                      <ul className="space-y-2">
                        {summary.breakthroughs.map((breakthrough, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-silver">
                            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-yellow-400" />
                            {breakthrough}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Patterns */}
                  {summary.patterns_noticed.length > 0 && (
                    <div className="card">
                      <h3 className="mb-3 flex items-center gap-2 font-semibold">
                        <TrendingUp className="h-4 w-4 text-purple-400" />
                        Patterns Noticed
                      </h3>
                      <ul className="space-y-2">
                        {summary.patterns_noticed.map((pattern, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-silver">
                            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
                            {pattern}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Goals Referenced */}
                  {summary.goals_referenced.length > 0 && (
                    <div className="card">
                      <h3 className="mb-3 flex items-center gap-2 font-semibold">
                        <Target className="h-4 w-4 text-cyan-400" />
                        Goals Referenced
                      </h3>
                      <ul className="space-y-2">
                        {summary.goals_referenced.map((goal, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-silver">
                            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan-400" />
                            {goal}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Transcript Tab */}
        {activeTab === 'transcript' && (
          <div className="card">
            <h2 className="mb-6 text-lg font-semibold">Conversation</h2>
            <div className="space-y-4">
              {session.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-deep-blue-600 text-white'
                        : 'bg-titanium-800 text-silver'
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                    <div
                      className={`mt-1 text-xs ${
                        message.role === 'user' ? 'text-deep-blue-200' : 'text-silver-light'
                      }`}
                    >
                      {formatMessageTime(message.created_at)}
                    </div>
                  </div>
                </div>
              ))}

              {session.messages.length === 0 && (
                <div className="py-8 text-center text-silver-light">No messages in this session</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
