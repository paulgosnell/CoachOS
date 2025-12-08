'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, MessageSquare, User, Sparkles, Target } from 'lucide-react'

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

export default function AdminSessionDetailPage() {
  const params = useParams()
  const sessionId = params.id as string
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (sessionId) {
      loadSession()
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

        {/* Metrics */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="card">
            <div className="mb-1 text-xs text-silver-light">Duration</div>
            <div className="text-lg font-semibold">{formatDuration(session.duration_seconds)}</div>
          </div>

          <div className="card">
            <div className="mb-1 text-xs text-silver-light">Session Type</div>
            <div className="text-lg font-semibold capitalize">{session.session_type || 'Chat'}</div>
          </div>

          {session.sentiment && (
            <div className="card">
              <div className="mb-1 text-xs text-silver-light">Sentiment</div>
              <div className="text-lg font-semibold capitalize">{session.sentiment}</div>
            </div>
          )}

          {session.clarity_score !== null && (
            <div className="card">
              <div className="mb-1 text-xs text-silver-light">Clarity</div>
              <div className="text-lg font-semibold">{(session.clarity_score * 100).toFixed(0)}%</div>
            </div>
          )}

          {session.action_items_count !== null && (
            <div className="card">
              <div className="mb-1 text-xs text-silver-light">Action Items</div>
              <div className="text-lg font-semibold">{session.action_items_count}</div>
            </div>
          )}
        </div>

        {/* Messages */}
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
      </div>
    </div>
  )
}
