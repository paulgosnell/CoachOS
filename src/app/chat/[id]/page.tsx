'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { MessageBubble } from '@/components/chat/MessageBubble'
import { MessageInput } from '@/components/chat/MessageInput'
import { TypingIndicator } from '@/components/chat/TypingIndicator'
import { VoiceRecorder } from '@/components/voice/VoiceRecorder'
import { AudioPlayer } from '@/components/voice/AudioPlayer'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Mic, Keyboard } from 'lucide-react'

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
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadMessages()
    subscribeToMessages()
  }, [conversationId])

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
          setMessages((prev) => [...prev, newMessage])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const handleSendMessage = async (content: string) => {
    try {
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

      // Reload messages to get the saved version from database
      await loadMessages()
    } catch (err: any) {
      console.error('Failed to send message:', err)
      setIsStreaming(false)
      setStreamingMessage('')
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
    <div className="flex h-full flex-col">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center py-12 text-center">
              <div>
                <p className="mb-2 text-silver-light">
                  👋 Hey there! What would you like to work on today?
                </p>
                <p className="text-sm text-gray-500">
                  I have full context on your business and goals
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

      {/* Input Mode Toggle & Input */}
      <div className="border-t border-white/5 bg-titanium-900/80">
        {/* Mode Toggle */}
        <div className="flex justify-center border-b border-white/5 py-2">
          <div className="inline-flex rounded-lg bg-titanium-950 p-1">
            <button
              onClick={() => setVoiceMode(false)}
              className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm transition-colors ${
                !voiceMode
                  ? 'bg-deep-blue-800 text-silver'
                  : 'text-gray-400 hover:text-silver'
              }`}
            >
              <Keyboard className="h-4 w-4" />
              Text
            </button>
            <button
              onClick={() => setVoiceMode(true)}
              className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm transition-colors ${
                voiceMode
                  ? 'bg-deep-blue-800 text-silver'
                  : 'text-gray-400 hover:text-silver'
              }`}
            >
              <Mic className="h-4 w-4" />
              Voice
            </button>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4">
          {voiceMode ? (
            <VoiceRecorder
              onTranscription={handleVoiceTranscription}
              disabled={isStreaming}
            />
          ) : (
            <MessageInput onSend={handleSendMessage} disabled={isStreaming} />
          )}
        </div>
      </div>
    </div>
  )
}
