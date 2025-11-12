'use client'

import { useState, useRef } from 'react'
import { useConversation } from '@elevenlabs/react'
import { Mic, Phone, PhoneOff, Loader2, ArrowLeft, Play, Square } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Toast } from '@/components/Toast'

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
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
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
              const response = await fetch('/api/actions/extract', {
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

              if (response.ok) {
                const data = await response.json()
                if (data.actionCount > 0) {
                  setToastMessage(`📋 ${data.actionCount} task${data.actionCount > 1 ? 's' : ''} captured`)
                  setShowToast(true)
                }
              }
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
      {/* Minimal Mobile Header */}
      <div className="flex items-center justify-between border-b border-white/5 bg-titanium-900/80 p-4">
        <button
          onClick={() => router.push('/dashboard')}
          className="text-silver-light transition-colors hover:text-silver"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <p className="text-sm font-medium text-silver">
          {conversation.status === 'connected' ? 'Connected' : 'Voice'}
        </p>
        <div className="w-5" />
      </div>

      {/* Main Content - Clean & Centered */}
      <div className="flex flex-1 flex-col items-center justify-center p-6">
        {error && (
          <div className="mb-6 w-full max-w-sm rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Connection Status */}
        {conversation.status === 'connected' ? (
          <div className="flex flex-col items-center space-y-8">
            {/* Animated Speaking Indicator */}
            <div
              className={`flex h-40 w-40 items-center justify-center rounded-full transition-all duration-300 ${
                conversation.isSpeaking
                  ? 'animate-pulse bg-deep-blue-600 shadow-2xl shadow-deep-blue-600/40'
                  : 'bg-deep-blue-800/50'
              }`}
            >
              <Mic className="h-16 w-16 text-silver" />
            </div>

            <div className="text-center">
              <p className="mb-2 text-xl font-medium text-silver">
                {conversation.isSpeaking ? 'Listening...' : 'Your turn'}
              </p>
            </div>

            <button
              onClick={endConversation}
              className="flex h-14 w-14 items-center justify-center rounded-lg bg-red-600 text-white shadow-lg transition-all hover:bg-red-700 active:scale-95"
            >
              <Square className="h-6 w-6" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-12">
            {/* Ready State */}
            <div className="flex h-40 w-40 items-center justify-center rounded-full bg-titanium-800/50">
              <Phone className="h-16 w-16 text-silver-light" />
            </div>

            <button
              onClick={startConversation}
              className="flex h-16 w-16 items-center justify-center rounded-lg bg-deep-blue-700 text-silver shadow-lg transition-all hover:bg-deep-blue-600 active:scale-95"
            >
              <Play className="h-8 w-8" />
            </button>

            {/* Minimal Tips - Only show 2 key ones */}
            <div className="w-full max-w-xs space-y-3 text-center text-sm text-silver-light">
              <p>Use headphones for best quality</p>
              <p>Find a quiet space</p>
            </div>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  )
}
