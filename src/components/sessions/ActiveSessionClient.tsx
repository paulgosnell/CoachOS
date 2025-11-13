'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Send,
  Loader2,
  CheckCircle2,
  Circle,
  StopCircle,
} from 'lucide-react'
import { MessageBubble } from '@/components/chat/MessageBubble'
import { TypingIndicator } from '@/components/chat/TypingIndicator'
import { getFramework } from '@/lib/ai/frameworks'

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
  const [input, setInput] = useState('')
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
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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
      const response = await fetch(`/api/chat?conversation_id=${conversationId}`)
      const data = await response.json()
      setMessages(data.messages || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async () => {
    if (!input.trim() || streaming) return

    const userMessage = input.trim()
    setInput('')
    setStreaming(true)

    // Add user message optimistically
    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: userMessage,
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
          message: userMessage,
          conversation_id: conversationId,
          session_type: 'structured',
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
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') {
                break
              }

              try {
                const parsed = JSON.parse(data)
                if (parsed.content) {
                  assistantMessage += parsed.content
                  setMessages((prev) => {
                    const newMessages = [...prev]
                    const lastMessage = newMessages[newMessages.length - 1]

                    if (lastMessage && lastMessage.role === 'assistant') {
                      lastMessage.content = assistantMessage
                    } else {
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
              } catch (e) {
                // Ignore parse errors
              }
            }
          }
        }
      }

      // Refresh messages to get real IDs
      await fetchMessages()
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setStreaming(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
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
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="border-b border-white/10 bg-titanium-800/50 px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/sessions')}
              className="text-silver-light hover:text-silver"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold">{framework.name} Session</h1>
              {session.goal && (
                <p className="text-sm text-silver-light">{session.goal}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => setShowCompleteModal(true)}
            className="btn btn-secondary btn-sm"
          >
            <StopCircle className="h-4 w-4" />
            Complete Session
          </button>
        </div>
      </div>

      {/* Framework Progress */}
      <div className="border-b border-white/10 bg-titanium-900/30 px-4 py-3">
        <div className="container mx-auto">
          <div className="flex items-center justify-between gap-2 overflow-x-auto">
            {framework.stages.map((stage, index) => (
              <div
                key={stage.id}
                className={`flex items-center gap-2 ${
                  index < framework.stages.length - 1 ? 'flex-1' : ''
                }`}
              >
                <div className="flex flex-shrink-0 items-center gap-2">
                  {index < currentStageIndex ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : index === currentStageIndex ? (
                    <Circle className="h-5 w-5 text-deep-blue-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-silver-darker" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      index === currentStageIndex
                        ? 'text-deep-blue-500'
                        : index < currentStageIndex
                          ? 'text-silver-light'
                          : 'text-silver-lighter'
                    }`}
                  >
                    {stage.name}
                  </span>
                </div>
                {index < framework.stages.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 ${
                      index < currentStageIndex
                        ? 'bg-green-500'
                        : 'bg-silver-darker'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="container mx-auto max-w-4xl space-y-4">
          {/* Current Stage Info */}
          <div className="card bg-deep-blue-900/20">
            <h3 className="mb-2 font-semibold text-deep-blue-400">
              {currentStage.name}: {currentStage.description}
            </h3>
            <p className="text-sm text-silver-light">
              Your coach will guide you through this stage
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-deep-blue-600" />
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

      {/* Input */}
      <div className="border-t border-white/10 bg-titanium-800/50 p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your response..."
              rows={1}
              className="input flex-1 resize-none"
              disabled={streaming}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || streaming}
              className="btn btn-primary"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
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
