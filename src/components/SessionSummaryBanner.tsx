'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, Lightbulb, Target, TrendingUp, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface SessionSummary {
  id: string
  conversation_id: string
  summary: string
  key_topics: string[]
  decisions_made: string[]
  breakthroughs: string[]
  patterns_noticed: string[]
  user_state: string | null
  generated_at: string
}

interface SessionSummaryBannerProps {
  userId: string
  sessionType: 'voice' | 'chat'
  currentConversationId?: string
}

export function SessionSummaryBanner({
  userId,
  sessionType,
  currentConversationId
}: SessionSummaryBannerProps) {
  const [summary, setSummary] = useState<SessionSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    loadLastSessionSummary()
  }, [userId, sessionType, currentConversationId])

  const loadLastSessionSummary = async () => {
    try {
      const supabase = createClient()

      // Get the most recent conversation of this type (not the current one)
      const dbSessionType = sessionType === 'chat' ? 'quick-checkin' : 'voice'

      let query = supabase
        .from('conversations')
        .select('id')
        .eq('user_id', userId)
        .eq('session_type', dbSessionType)
        .order('updated_at', { ascending: false })
        .limit(2)

      const { data: conversations } = await query

      if (!conversations || conversations.length === 0) {
        setLoading(false)
        return
      }

      // Get the previous conversation (skip current if provided)
      const previousConv = conversations.find(c => c.id !== currentConversationId) || conversations[0]

      if (!previousConv || previousConv.id === currentConversationId) {
        setLoading(false)
        return
      }

      // Get the summary for that conversation
      const { data: summaryData } = await supabase
        .from('conversation_summaries')
        .select('*')
        .eq('conversation_id', previousConv.id)
        .maybeSingle()

      if (summaryData) {
        setSummary(summaryData)
      }

      setLoading(false)
    } catch (error) {
      console.error('Failed to load session summary:', error)
      setLoading(false)
    }
  }

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    return date.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })
  }

  if (loading || !summary) {
    return null
  }

  return (
    <div className="mb-4 rounded-xl border border-white/10 bg-gradient-to-r from-titanium-900/80 to-titanium-800/50 overflow-hidden">
      {/* Collapsed View */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600/20">
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-silver">Last Session</p>
            <p className="text-xs text-silver-light">{formatTimeAgo(summary.generated_at)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-silver-light hidden sm:block">
            {expanded ? 'Hide' : 'Show'} summary
          </span>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-silver-light" />
          ) : (
            <ChevronDown className="h-4 w-4 text-silver-light" />
          )}
        </div>
      </button>

      {/* Expanded View */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-white/5">
          <p className="mt-3 text-sm text-silver-light">{summary.summary}</p>

          {summary.key_topics && summary.key_topics.length > 0 && (
            <div className="mt-3">
              <div className="flex items-center gap-2 text-xs text-silver mb-1">
                <Target className="h-3 w-3" />
                <span className="font-medium">Topics</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {summary.key_topics.slice(0, 5).map((topic, i) => (
                  <span key={i} className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-silver-light">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {summary.breakthroughs && summary.breakthroughs.length > 0 && (
            <div className="mt-3">
              <div className="flex items-center gap-2 text-xs text-amber-400 mb-1">
                <Lightbulb className="h-3 w-3" />
                <span className="font-medium">Breakthroughs</span>
              </div>
              <ul className="text-xs text-silver-light space-y-0.5">
                {summary.breakthroughs.slice(0, 2).map((b, i) => (
                  <li key={i}>• {b}</li>
                ))}
              </ul>
            </div>
          )}

          {summary.decisions_made && summary.decisions_made.length > 0 && (
            <div className="mt-3">
              <div className="flex items-center gap-2 text-xs text-green-400 mb-1">
                <TrendingUp className="h-3 w-3" />
                <span className="font-medium">Decisions</span>
              </div>
              <ul className="text-xs text-silver-light space-y-0.5">
                {summary.decisions_made.slice(0, 2).map((d, i) => (
                  <li key={i}>• {d}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
