'use client'

import { Plus, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Conversation {
  id: string
  title: string
  lastMessage?: string
  updatedAt: Date
}

interface ConversationListProps {
  conversations: Conversation[]
  onNewConversation: () => void
}

export function ConversationList({ conversations, onNewConversation }: ConversationListProps) {
  const pathname = usePathname()

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
          onClick={onNewConversation}
          className="btn btn-primary w-full justify-center text-sm"
        >
          <Plus className="h-4 w-4" />
          New Conversation
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <MessageSquare className="mb-3 h-12 w-12 text-gray-600" />
            <p className="text-sm text-gray-500">No conversations yet</p>
            <p className="mt-1 text-xs text-gray-600">Start a new conversation to get coaching</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {conversations.map((conversation) => {
              const isActive = pathname === `/chat/${conversation.id}`

              return (
                <Link
                  key={conversation.id}
                  href={`/chat/${conversation.id}`}
                  className={`block rounded-lg p-3 transition-colors ${
                    isActive
                      ? 'bg-deep-blue-800/50 border border-white/10'
                      : 'hover:bg-titanium-900/50'
                  }`}
                >
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <h3 className="line-clamp-1 text-sm font-semibold text-silver">
                      {conversation.title}
                    </h3>
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
