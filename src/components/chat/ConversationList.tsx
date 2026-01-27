'use client'

import { Plus, MessageSquare, Mic } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { trackNewConversation, trackConversationOpened } from '@/lib/analytics'

export type SessionType = 'chat' | 'voice'

interface Conversation {
  id: string
  title: string
  lastMessage?: string
  updatedAt: Date
}

interface ConversationListProps {
  conversations: Conversation[]
  onNewConversation: () => void
  sessionType: SessionType
}

export function ConversationList({
  conversations,
  onNewConversation,
  sessionType
}: ConversationListProps) {
  const pathname = usePathname()

  const isVoice = sessionType === 'voice'
  const basePath = isVoice ? '/voice-coach' : '/chat'
  const Icon = isVoice ? Mic : MessageSquare
  const emptyMessage = isVoice ? 'No voice sessions yet' : 'No conversations yet'
  const emptySubMessage = isVoice
    ? 'Start a voice session to talk with your coach'
    : 'Start a new conversation to get coaching'
  const newButtonText = isVoice ? 'New Voice Session' : 'New Conversation'

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    return date.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="flex h-full flex-col border-r border-white/5 bg-titanium-950">
      {/* Header */}
      <div className="border-b border-white/5 p-4">
        <button
          onClick={() => {
            trackNewConversation()
            onNewConversation()
          }}
          className="btn btn-primary w-full justify-center text-sm"
        >
          <Plus className="h-4 w-4" />
          {newButtonText}
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Icon className="mb-3 h-12 w-12 text-gray-600" />
            <p className="text-sm text-gray-500">{emptyMessage}</p>
            <p className="mt-1 text-xs text-gray-600">{emptySubMessage}</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {conversations.map((conversation) => {
              const conversationPath = isVoice
                ? `/voice-coach/${conversation.id}`
                : `/chat/${conversation.id}`
              const isActive = pathname === conversationPath

              return (
                <Link
                  key={conversation.id}
                  href={conversationPath}
                  onClick={() => trackConversationOpened(conversation.id)}
                  className={`block rounded-lg p-3 transition-colors ${
                    isActive
                      ? 'bg-deep-blue-800/50 border border-white/10'
                      : 'hover:bg-titanium-900/50'
                  }`}
                >
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {isVoice && <Mic className="h-3 w-3 text-amber-400 flex-shrink-0" />}
                      <h3 className="line-clamp-1 text-sm font-semibold text-silver">
                        {conversation.title}
                      </h3>
                    </div>
                    <span className="flex-shrink-0 text-xs text-gray-500">
                      {formatDate(conversation.updatedAt)}
                    </span>
                  </div>
                  {conversation.lastMessage && (
                    <p className="line-clamp-2 text-xs text-gray-500">
                      {conversation.lastMessage}
                    </p>
                  )}
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-white/5 p-4">
        <Link href="/dashboard" className="btn btn-ghost w-full justify-start text-sm">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
