'use client'

import { useState, useRef } from 'react'
import { useConversation } from '@elevenlabs/react'
import { Mic, Phone, PhoneOff, Loader2, MessageSquare } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface VoiceConversationProps {
  config: {
    signedUrl: string
    agentId: string
    overrides: any
  }
  router: any
}

export function VoiceConversation({ config, router }: VoiceConversationProps) {
  const [error, setError] = useState<string | null>(null)
  const [transcript, setTranscript] = useState<Array<{ role: string; message: string }>>([])
  const conversationIdRef = useRef<string | null>(null)
  const supabase = createClient()

  // Save message to database
  const saveMessage = async (role: string, content: string) => {
    if (!conversationIdRef.current) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      await supabase.from('messages').insert({
        conversation_id: conversationIdRef.current,
        user_id: user.id,
        role: role === 'user' ? 'user' : 'assistant',
        content,
        content_type: 'voice',
      })
    } catch (err) {
      console.error('Failed to save message:', err)
    }
  }

  const conversation = useConversation({
    onConnect: async () => {
      console.log('Connected to ElevenLabs')

      // Create a new conversation in the database
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error: convError } = await supabase
          .from('conversations')
          .insert({
            user_id: user.id,
            session_type: 'voice',
            title: 'Voice Session',
          })
          .select()
          .single()

        if (convError) throw convError
        conversationIdRef.current = data.id
      } catch (err) {
        console.error('Failed to create conversation:', err)
      }
    },
    onDisconnect: async () => {
      console.log('Disconnected from ElevenLabs')

      // Update conversation end time and extract action items
      if (conversationIdRef.current) {
        try {
          await supabase
            .from('conversations')
            .update({ ended_at: new Date().toISOString() })
            .eq('id', conversationIdRef.current)

          // Extract action items from voice conversation
          if (transcript.length > 0) {
            try {
              await fetch('/api/actions/extract', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  conversationId: conversationIdRef.current,
                  messages: transcript.map((t) => ({
                    role: t.role,
                    content: t.message,
                  })),
                }),
              })
            } catch (err) {
              console.error('Failed to extract action items:', err)
            }
          }
        } catch (err) {
          console.error('Failed to update conversation:', err)
        }
      }
    },
    onMessage: (message) => {
      console.log('Message:', message)

      // Save to local state (not displayed, but kept for reference)
      setTranscript((prev) => [...prev, { role: message.source, message: message.message }])

      // Save to database
      saveMessage(message.source, message.message)
    },
    onError: (error) => {
      console.error('Conversation error:', error)
      setError(typeof error === 'string' ? error : 'Connection error occurred')
    },
    // Apply overrides from backend config
    overrides: config.overrides,
  })

  const startConversation = async () => {
    try {
      setError(null)

      // Start the conversation using signed URL from config
      await conversation.startSession({
        signedUrl: config.signedUrl,
      })
    } catch (err: any) {
      console.error('Failed to start conversation:', err)
      setError(err.message || 'Failed to start conversation')
    }
  }

  const endConversation = async () => {
    await conversation.endSession()
    setTranscript([])
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-white/5 bg-titanium-900/80 p-4">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-silver">Voice Coach</h1>
              <p className="text-sm text-silver-light">
                {conversation.status === 'connected'
                  ? 'Connected - speak naturally'
                  : 'Start a conversation with your AI coach'}
              </p>
            </div>
            <button
              onClick={() => router.push('/chat')}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-silver-light transition-colors hover:bg-white/5 hover:text-silver"
            >
              <MessageSquare className="h-4 w-4" />
              Switch to Text Chat
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col items-center justify-center p-8">
        {error && (
          <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-center text-red-400">
            {error}
          </div>
        )}

        {/* Connection Status */}
        <div className="mb-8 text-center">
          {conversation.status === 'connected' ? (
            <div className="space-y-4">
              {/* Animated Speaking Indicator */}
              <div className="mx-auto flex h-32 w-32 items-center justify-center">
                <div
                  className={`h-24 w-24 rounded-full transition-all duration-300 ${
                    conversation.isSpeaking
                      ? 'animate-pulse bg-deep-blue-600 shadow-lg shadow-deep-blue-600/50'
                      : 'bg-deep-blue-800'
                  }`}
                >
                  <div className="flex h-full items-center justify-center">
                    <Mic className="h-12 w-12 text-silver" />
                  </div>
                </div>
              </div>

              <div>
                <p className="text-lg font-medium text-silver">
                  {conversation.isSpeaking ? 'Coach is speaking...' : 'Listening...'}
                </p>
                <p className="text-sm text-silver-light">Speak naturally, I'll respond</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-titanium-800">
                <Phone className="h-12 w-12 text-silver-light" />
              </div>
              <div>
                <p className="text-lg font-medium text-silver">Ready to start?</p>
                <p className="text-sm text-silver-light">
                  Click below to begin your voice coaching session
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-4">
          {conversation.status === 'connected' ? (
            <button
              onClick={endConversation}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition-colors hover:bg-red-700"
            >
              <PhoneOff className="h-5 w-5" />
              End Call
            </button>
          ) : (
            <button
              onClick={startConversation}
              className="flex items-center gap-2 rounded-lg bg-deep-blue-700 px-8 py-4 text-lg font-medium text-silver transition-colors hover:bg-deep-blue-600"
            >
              <Phone className="h-6 w-6" />
              Start Voice Session
            </button>
          )}
        </div>

        {/* Transcript removed - transcripts are saved but not displayed during voice sessions */}
      </div>

      {/* Tips */}
      {conversation.status !== 'connected' && (
        <div className="border-t border-white/5 bg-titanium-900/80 p-6">
          <div className="mx-auto max-w-4xl">
            <h3 className="mb-3 text-sm font-medium text-silver">Tips for best experience:</h3>
            <ul className="space-y-2 text-sm text-silver-light">
              <li>• Speak naturally - this is a real conversation, not commands</li>
              <li>• Use headphones to avoid echo</li>
              <li>• Find a quiet environment</li>
              <li>• The coach has full context on your business and goals</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
