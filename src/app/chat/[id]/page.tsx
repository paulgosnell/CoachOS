'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { MessageBubble } from '@/components/chat/MessageBubble'
import { MessageInput } from '@/components/chat/MessageInput'
import { TypingIndicator } from '@/components/chat/TypingIndicator'
import { VoiceRecorder } from '@/components/voice/VoiceRecorder'
import { AudioPlayer } from '@/components/voice/AudioPlayer'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Mic, Keyboard, ArrowLeft, Phone, Menu } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
}

export default function ChatPage() {
  const router = useRouter()
  const params = useParams()
  const conversationId = params.id as string

  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingMessage, setStreamingMessage] = useState('')
  const [voiceMode, setVoiceMode] = useState(false)
  const [greeting, setGreeting] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadMessages()
    subscribeToMessages()
    loadGreeting()
  }, [conversationId])

  const loadGreeting = async () => {
    try {
      const response = await fetch('/api/chat/greeting', {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        setGreeting(data.greeting)
      }
    } catch (err) {
      console.error('Failed to load greeting:', err)
      // Fallback greeting
      setGreeting("Hey! What would you like to work on today?")
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingMessage])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadMessages = async () => {
    try {
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      // Verify conversation belongs to user
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .select('id')
        .eq('id', conversationId)
        .eq('user_id', user.id)
        .single()

      if (convError || !conversation) {
        setError('Conversation not found')
        setLoading(false)
        return
      }

      // Load messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('id, role, content, created_at')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (messagesError) throw messagesError

      const formattedMessages: Message[] = messagesData.map((msg) => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        createdAt: new Date(msg.created_at),
      }))

      setMessages(formattedMessages)
      setLoading(false)
    } catch (err: any) {
      console.error('Failed to load messages:', err)
      setError(err.message || 'Failed to load messages')
      setLoading(false)
    }
  }

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
            createdAt: new Date(payload.new.created_at),
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

  const handleSendMessage = async (content: string) => {
    try {
      // Add user message to UI immediately (optimistic update)
      const optimisticUserMessage: Message = {
        id: `temp-${Date.now()}`, // Temporary ID
        role: 'user',
        content,
        createdAt: new Date(),
      }
      setMessages((prev) => [...prev, optimisticUserMessage])

      setIsStreaming(true)
      setStreamingMessage('')

      // Call AI API with streaming
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId,
          message: content,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response from coach')
      }

      // Handle streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) throw new Error('No response body')

      let fullMessage = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('0:')) {
            // Extract the text from the streaming format
            const text = line.slice(2).replace(/^"/, '').replace(/"$/, '')
            fullMessage += text
            setStreamingMessage(fullMessage)
          }
        }
      }

      setIsStreaming(false)
      setStreamingMessage('')

      // Don't manually remove temp message - the subscription will replace it
      // when the real message arrives from the database
    } catch (err: any) {
      console.error('Failed to send message:', err)
      setIsStreaming(false)
      setStreamingMessage('')
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((msg) => !msg.id.startsWith('temp-')))
      throw err
    }
  }

  const handleVoiceTranscription = async (text: string) => {
    // When voice is transcribed, send it as a message
    await handleSendMessage(text)
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
          <button onClick={() => router.push('/chat')} className="btn btn-primary">
            Back to Chat
          </button>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="flex h-full flex-col">
        {/* Minimal Mobile Header */}
        <div className="flex items-center justify-between border-b border-white/5 bg-titanium-900/80 p-4 lg:hidden">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-silver-light transition-colors hover:text-silver"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <p className="text-sm font-medium text-silver">Chat</p>
          <div className="w-5" />
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center py-12 text-center">
              <div className="max-w-lg px-4">
                <p className="text-silver-light">
                  {greeting || "Loading..."}
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
                  timestamp={message.createdAt}
                  showAudio={voiceMode && message.role === 'assistant'}
                />
              ))}

              {/* Show streaming message */}
              {streamingMessage && (
                <MessageBubble
                  key="streaming"
                  role="assistant"
                  content={streamingMessage}
                  timestamp={new Date()}
                  showAudio={false}
                />
              )}

              {/* Show typing indicator when waiting for first chunk */}
              {isStreaming && !streamingMessage && <TypingIndicator />}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Clean Input Area */}
      <div className="border-t border-white/5 bg-titanium-900/80 p-4">
        {voiceMode ? (
          <div className="flex flex-col items-center gap-4">
            <VoiceRecorder
              onTranscription={handleVoiceTranscription}
              disabled={isStreaming}
            />
            <button
              onClick={() => setVoiceMode(false)}
              className="text-xs text-silver-light transition-colors hover:text-silver"
            >
              Switch to text
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <MessageInput onSend={handleSendMessage} disabled={isStreaming} />
            <button
              onClick={() => setVoiceMode(true)}
              className="flex items-center justify-center gap-2 text-xs text-silver-light transition-colors hover:text-silver"
            >
              <Mic className="h-3 w-3" />
              Send voice note instead
            </button>
          </div>
        )}
      </div>
    </div>
    </ErrorBoundary>
  )
}
