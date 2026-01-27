'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ConversationList } from '@/components/chat/ConversationList'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { createClient } from '@/lib/supabase/client'

interface Conversation {
  id: string
  title: string
  lastMessage?: string
  updatedAt: Date
}

export default function VoiceCoachLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    try {
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      // Fetch voice conversations only
      const { data: conversationsData, error } = await supabase
        .from('conversations')
        .select(`
          id,
          title,
          updated_at,
          messages (
            content,
            created_at
          )
        `)
        .eq('user_id', user.id)
        .eq('session_type', 'voice')
        .order('updated_at', { ascending: false })

      if (error) throw error

      const formattedConversations: Conversation[] = (conversationsData || []).map((conv: any) => ({
        id: conv.id,
        title: conv.title || 'Voice Session',
        lastMessage: conv.messages?.[0]?.content,
        updatedAt: new Date(conv.updated_at),
      }))

      setConversations(formattedConversations)
    } catch (error) {
      console.error('Failed to load voice conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNewConversation = () => {
    // Navigate to new voice session page
    router.push('/voice-coach/new')
  }

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-titanium-950">
        {/* Sidebar - Hidden on mobile, shown on desktop */}
        <aside className="hidden w-80 flex-col lg:flex">
          <ConversationList
            conversations={conversations}
            onNewConversation={handleNewConversation}
            sessionType="voice"
          />
        </aside>

        {/* Main Voice Area */}
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </ErrorBoundary>
  )
}
