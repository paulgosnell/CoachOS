'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, ArrowLeft, Menu, Play, Mic, Clock, Target, Lightbulb, TrendingUp } from 'lucide-react'
import { GeminiVoiceConversation } from '@/components/voice/GeminiVoiceConversation'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
}

interface ConversationSummary {
  summary: string
  key_topics: string[]
  decisions_made: string[]
  breakthroughs: string[]
  patterns_noticed: string[]
  user_state: string | null
}

export default function VoiceConversationPage() {
  const router = useRouter()
  const params = useParams()
  const conversationId = params.id as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [conversation, setConversation] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [summary, setSummary] = useState<ConversationSummary | null>(null)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [conversations, setConversations] = useState<Array<{ id: string; title: string; updated_at: string }>>([])
  const [isStartingSession, setIsStartingSession] = useState(false)
  const [sessionConfig, setSessionConfig] = useState<any>(null)

  useEffect(() => {
    loadConversation()
    loadConversations()
  }, [conversationId])

  const loadConversation = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      // Load conversation
      const { data: conv, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .eq('user_id', user.id)
        .single()

      if (convError || !conv) {
        setError('Conversation not found')
        setLoading(false)
        return
      }

      setConversation(conv)

      // Load messages
      const { data: msgs } = await supabase
        .from('messages')
        .select('id, role, content, created_at')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      setMessages((msgs || []).map(m => ({
        id: m.id,
        role: m.role as 'user' | 'assistant',
        content: m.content,
        createdAt: new Date(m.created_at)
      })))

      // Load summary if it exists
      const { data: summaryData } = await supabase
        .from('conversation_summaries')
        .select('*')
        .eq('conversation_id', conversationId)
        .maybeSingle()

      if (summaryData) {
        setSummary(summaryData)
      }

      setLoading(false)
    } catch (err: any) {
      console.error('Failed to load conversation:', err)
      setError(err.message || 'Failed to load conversation')
      setLoading(false)
    }
  }

  const loadConversations = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('conversations')
        .select('id, title, updated_at')
        .eq('user_id', user.id)
        .eq('session_type', 'voice')
        .order('updated_at', { ascending: false })
        .limit(20)

      if (data) {
        setConversations(data)
      }
    } catch (err) {
      console.error('Failed to load conversations:', err)
    }
  }

  const handleContinueSession = async () => {
    setIsStartingSession(true)
    try {
      // Fetch conversation configuration with user context
      const response = await fetch('/api/voice/conversation', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to load conversation configuration')
      }

      const data = await response.json()
      setSessionConfig(data)
    } catch (err: any) {
      console.error('Failed to start session:', err)
      setError(err.message)
      setIsStartingSession(false)
    }
  }

  const formatDuration = (startedAt: string, endedAt: string | null) => {
    if (!endedAt) return 'In progress'
    const start = new Date(startedAt)
    const end = new Date(endedAt)
    const mins = Math.round((end.getTime() - start.getTime()) / 60000)
    if (mins < 1) return 'Less than a minute'
    if (mins === 1) return '1 minute'
    return `${mins} minutes`
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // If user clicked "Continue", show the voice conversation component
  if (sessionConfig) {
    return <GeminiVoiceConversation config={sessionConfig} router={router} />
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-silver" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <p className="mb-4 text-red-400">{error}</p>
          <button onClick={() => router.push('/voice-coach')} className="btn btn-primary">
            Back to Voice Coach
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* Mobile Header */}
      <div className="flex items-center justify-between border-b border-white/5 bg-titanium-900/80 p-4 lg:hidden">
        <button
          onClick={() => router.push('/dashboard')}
          className="text-silver-light transition-colors hover:text-silver"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <p className="text-sm font-medium text-silver">Voice Session</p>
        <button
          onClick={() => setShowMobileMenu(true)}
          className="text-silver-light transition-colors hover:text-silver"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowMobileMenu(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 bg-titanium-900 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/5 p-4">
              <h2 className="text-lg font-semibold text-silver">Voice Sessions</h2>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="text-silver-light transition-colors hover:text-silver"
              >
                ✕
              </button>
            </div>
            <div className="overflow-y-auto p-2" style={{ height: 'calc(100% - 64px)' }}>
              <button
                onClick={() => {
                  router.push('/voice-coach/new')
                  setShowMobileMenu(false)
                }}
                className="mb-2 w-full rounded-lg bg-amber-600 p-3 text-center text-sm font-medium text-white"
              >
                + New Voice Session
              </button>
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => {
                    router.push(`/voice-coach/${conv.id}`)
                    setShowMobileMenu(false)
                  }}
                  className={`w-full rounded-lg p-3 text-left transition-colors hover:bg-white/5 ${
                    conv.id === conversationId ? 'bg-white/10' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Mic className="h-3 w-3 text-amber-400" />
                    <p className="truncate text-sm text-silver">{conv.title || 'Voice Session'}</p>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(conv.updated_at).toLocaleDateString()}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mx-auto max-w-3xl">
          {/* Session Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-600/20">
                <Mic className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-silver">
                  {conversation?.title || 'Voice Session'}
                </h1>
                <p className="text-sm text-silver-light">
                  {formatDate(conversation?.started_at || conversation?.created_at)}
                </p>
              </div>
            </div>
            {conversation?.ended_at && (
              <div className="flex items-center gap-2 text-sm text-silver-light mt-2">
                <Clock className="h-4 w-4" />
                <span>Duration: {formatDuration(conversation.started_at, conversation.ended_at)}</span>
              </div>
            )}
          </div>

          {/* Session Summary */}
          {summary && (
            <div className="mb-6 rounded-xl border border-white/10 bg-titanium-900/50 p-5">
              <h2 className="mb-3 text-sm font-semibold text-silver uppercase tracking-wide">Session Summary</h2>
              <p className="text-silver-light mb-4">{summary.summary}</p>

              {summary.key_topics && summary.key_topics.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center gap-2 text-xs text-silver mb-1">
                    <Target className="h-3 w-3" />
                    <span className="font-medium">Topics Discussed</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {summary.key_topics.map((topic, i) => (
                      <span key={i} className="rounded-full bg-white/5 px-3 py-1 text-xs text-silver-light">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {summary.breakthroughs && summary.breakthroughs.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center gap-2 text-xs text-amber-400 mb-1">
                    <Lightbulb className="h-3 w-3" />
                    <span className="font-medium">Breakthroughs</span>
                  </div>
                  <ul className="text-sm text-silver-light space-y-1">
                    {summary.breakthroughs.map((b, i) => (
                      <li key={i}>• {b}</li>
                    ))}
                  </ul>
                </div>
              )}

              {summary.decisions_made && summary.decisions_made.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center gap-2 text-xs text-green-400 mb-1">
                    <TrendingUp className="h-3 w-3" />
                    <span className="font-medium">Decisions Made</span>
                  </div>
                  <ul className="text-sm text-silver-light space-y-1">
                    {summary.decisions_made.map((d, i) => (
                      <li key={i}>• {d}</li>
                    ))}
                  </ul>
                </div>
              )}

              {summary.patterns_noticed && summary.patterns_noticed.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs text-purple-400 mb-1">
                    <span className="font-medium">Patterns Noticed</span>
                  </div>
                  <ul className="text-sm text-silver-light space-y-1">
                    {summary.patterns_noticed.map((p, i) => (
                      <li key={i}>• {p}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Transcript */}
          {messages.length > 0 && (
            <div className="mb-6">
              <h2 className="mb-3 text-sm font-semibold text-silver uppercase tracking-wide">Transcript</h2>
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`rounded-lg p-4 ${
                      msg.role === 'user'
                        ? 'bg-deep-blue-800/30 ml-8'
                        : 'bg-titanium-800/30 mr-8'
                    }`}
                  >
                    <div className="mb-1 text-xs font-medium text-silver-light">
                      {msg.role === 'user' ? 'You' : 'Coach'}
                    </div>
                    <p className="text-sm text-silver">{msg.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No messages yet */}
          {messages.length === 0 && !summary && (
            <div className="text-center py-12">
              <Mic className="h-12 w-12 text-silver-light mx-auto mb-4" />
              <p className="text-silver-light">No transcript available for this session.</p>
            </div>
          )}
        </div>
      </div>

      {/* Continue Session CTA */}
      <div className="border-t border-white/5 bg-titanium-900/80 p-4">
        <div className="mx-auto max-w-3xl flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleContinueSession}
            disabled={isStartingSession}
            className="btn btn-primary flex-1 justify-center"
          >
            {isStartingSession ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Play className="h-4 w-4" />
                Continue This Conversation
              </>
            )}
          </button>
          <button
            onClick={() => router.push('/voice-coach/new')}
            className="btn btn-ghost justify-center"
          >
            Start Fresh
          </button>
        </div>
      </div>
    </div>
  )
}
