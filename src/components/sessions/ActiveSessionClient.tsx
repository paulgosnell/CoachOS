'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Circle,
  StopCircle,
} from 'lucide-react'
import { MessageBubble } from '@/components/chat/MessageBubble'
import { MessageInput } from '@/components/chat/MessageInput'
import { TypingIndicator } from '@/components/chat/TypingIndicator'
import { getFramework } from '@/lib/ai/frameworks'
import { createClient } from '@/lib/supabase/client'
import { trackSessionStarted, trackSessionCompleted } from '@/lib/analytics'

interface ActiveSessionClientProps {
  sessionId: string
  conversationId: string
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

interface Session {
  id: string
  framework_used: string
  goal: string | null
  duration_minutes: number
}

export function ActiveSessionClient({
  sessionId,
  conversationId,
}: ActiveSessionClientProps) {
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [streaming, setStreaming] = useState(false)
  const [currentStageIndex, setCurrentStageIndex] = useState(0)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [rating, setRating] = useState<number>(0)
  const [completing, setCompleting] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchSession()
    fetchMessages()
    subscribeToMessages()

    // Track session started when component mounts
    if (session) {
      trackSessionStarted(sessionId, session.framework_used)
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const subscribeToMessages = () => {
    const supabase = createClient()

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMessage: Message = {
            id: payload.new.id,
            role: payload.new.role,
            content: payload.new.content,
            created_at: payload.new.created_at,
          }

          setMessages((prev) => {
            // Remove any temporary messages with the same content and role
            const filtered = prev.filter(
              (msg) => !(msg.id.startsWith('temp-') && msg.content === newMessage.content && msg.role === newMessage.role)
            )

            // Add the new real message
            return [...filtered, newMessage]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const fetchSession = async () => {
    const response = await fetch(`/api/sessions/${sessionId}`)
    if (response.ok) {
      const data = await response.json()
      setSession(data.session)
    }
  }

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const supabase = createClient()

      const { data: messagesData, error } = await supabase
        .from('messages')
        .select('id, role, content, created_at')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (error) throw error

      const formattedMessages: Message[] = messagesData.map((msg) => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        created_at: msg.created_at,
      }))

      setMessages(formattedMessages)
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async (content: string) => {
    if (streaming) return

    setStreaming(true)

    // Add user message optimistically
    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, tempUserMessage])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          conversationId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('0:')) {
              const text = line.slice(2).replace(/^"/, '').replace(/"$/, '')
              assistantMessage += text
              setMessages((prev) => {
                const newMessages = [...prev]
                const lastMessage = newMessages[newMessages.length - 1]

                if (lastMessage && lastMessage.role === 'assistant' && lastMessage.id.startsWith('temp-assistant')) {
                  lastMessage.content = assistantMessage
                } else if (newMessages[newMessages.length - 1]?.role !== 'assistant') {
                  newMessages.push({
                    id: `temp-assistant-${Date.now()}`,
                    role: 'assistant',
                    content: assistantMessage,
                    created_at: new Date().toISOString(),
                  })
                }

                return newMessages
              })
            }
          }
        }
      }

      // Real-time subscription will handle adding the real messages
    } catch (error) {
      console.error('Error sending message:', error)
      // Remove temp messages on error
      setMessages((prev) => prev.filter((msg) => !msg.id.startsWith('temp-')))
    } finally {
      setStreaming(false)
    }
  }

  const handleComplete = async () => {
    if (rating === 0) {
      alert('Please rate your session before completing')
      return
    }

    setCompleting(true)
    try {
      const response = await fetch(`/api/sessions/${sessionId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating }),
      })

      if (!response.ok) {
        throw new Error('Failed to complete session')
      }

      // Track session completion
      trackSessionCompleted(sessionId, rating, session?.duration_minutes)

      router.push(`/sessions/${sessionId}`)
    } catch (error) {
      console.error('Error completing session:', error)
      alert('Failed to complete session. Please try again.')
    } finally {
      setCompleting(false)
    }
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-deep-blue-600" />
      </div>
    )
  }

  const framework = getFramework(session.framework_used as any)
  const currentStage =
    framework.stages[Math.min(currentStageIndex, framework.stages.length - 1)]

  return (
    <div className="flex h-full flex-col">
      {/* Minimal Mobile Header */}
      <div className="flex items-center justify-between border-b border-white/5 bg-titanium-900/80 p-4">
        <button
          onClick={() => router.push('/sessions')}
          className="text-silver-light transition-colors hover:text-silver"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1 px-3">
          <p className="truncate text-center text-sm font-medium text-silver">
            {framework.name} Session
          </p>
          {session.goal && (
            <p className="truncate text-center text-xs text-silver-dark">
              {session.goal}
            </p>
          )}
        </div>
        <button
          onClick={() => setShowCompleteModal(true)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-silver-light transition-colors hover:bg-white/5 hover:text-silver"
          title="Complete Session"
        >
          <StopCircle className="h-5 w-5" />
        </button>
      </div>

      {/* Compact Framework Progress */}
      <div className="border-b border-white/5 bg-titanium-900/50 px-4 py-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {framework.stages.map((stage, index) => (
            <div key={stage.id} className="flex flex-shrink-0 items-center gap-2">
              <div className="flex items-center gap-1.5">
                {index < currentStageIndex ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : index === currentStageIndex ? (
                  <div className="h-4 w-4 rounded-full border-2 border-deep-blue-600" />
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-silver-darker/30" />
                )}
                <span
                  className={`whitespace-nowrap text-xs font-medium ${
                    index === currentStageIndex
                      ? 'text-deep-blue-500'
                      : index < currentStageIndex
                        ? 'text-silver-light'
                        : 'text-silver-darker'
                  }`}
                >
                  {stage.name}
                </span>
              </div>
              {index < framework.stages.length - 1 && (
                <div
                  className={`h-px w-4 ${
                    index < currentStageIndex ? 'bg-green-500' : 'bg-silver-darker/30'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-deep-blue-600" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full items-center justify-center py-12 text-center">
              <div className="max-w-lg px-4">
                <p className="mb-1 text-sm font-semibold text-deep-blue-400">
                  {currentStage.name}: {currentStage.description}
                </p>
                <p className="text-sm text-silver-light">
                  Your coach will guide you through this stage
                </p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  timestamp={new Date(message.created_at)}
                />
              ))}
              {streaming && <TypingIndicator />}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Clean Input Area */}
      <div className="border-t border-white/5 bg-titanium-900/80 p-4">
        <MessageInput onSend={handleSend} disabled={streaming} />
      </div>

      {/* Complete Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="card max-w-md">
            <h2 className="mb-4 text-xl font-bold">Complete Session</h2>
            <p className="mb-6 text-silver-light">
              How would you rate this coaching session?
            </p>

            <div className="mb-6 flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-3xl transition-colors ${
                    star <= rating ? 'text-gold' : 'text-silver-darker'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCompleteModal(false)}
                className="btn btn-ghost flex-1"
                disabled={completing}
              >
                Cancel
              </button>
              <button
                onClick={handleComplete}
                className="btn btn-primary flex-1"
                disabled={rating === 0 || completing}
              >
                {completing ? 'Completing...' : 'Complete Session'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
