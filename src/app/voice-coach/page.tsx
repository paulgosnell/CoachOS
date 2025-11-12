'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useConversation } from '@elevenlabs/react'
import { Mic, MicOff, Phone, PhoneOff, Loader2, MessageSquare } from 'lucide-react'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { createClient } from '@/lib/supabase/client'

export default function VoiceCoachPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [signedUrl, setSignedUrl] = useState<string | null>(null)
  const [transcript, setTranscript] = useState<Array<{ role: string; message: string }>>([])

  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to ElevenLabs')
    },
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs')
    },
    onMessage: (message) => {
      console.log('Message:', message)
      setTranscript((prev) => [...prev, { role: message.source, message: message.message }])
    },
    onError: (error) => {
      console.error('Conversation error:', error)
      setError(typeof error === 'string' ? error : 'Connection error occurred')
    },
  })

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
    }
  }

  const startConversation = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get signed URL from our API
      const response = await fetch('/api/voice/conversation', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to start conversation')
      }

      const data = await response.json()
      setSignedUrl(data.signedUrl)

      // Start the conversation using ElevenLabs SDK
      await conversation.startSession({
        signedUrl: data.signedUrl,
      })

      setLoading(false)
    } catch (err: any) {
      console.error('Failed to start conversation:', err)
      setError(err.message || 'Failed to start conversation')
      setLoading(false)
    }
  }

  const endConversation = async () => {
    await conversation.endSession()
    setSignedUrl(null)
    setTranscript([])
  }

  const toggleMute = () => {
    // ElevenLabs SDK handles muting internally
    console.log('Mute toggled')
  }

  return (
    <ErrorBoundary>
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
              <>
                <button
                  onClick={endConversation}
                  className="flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition-colors hover:bg-red-700"
                >
                  <PhoneOff className="h-5 w-5" />
                  End Call
                </button>
              </>
            ) : (
              <button
                onClick={startConversation}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-deep-blue-700 px-8 py-4 text-lg font-medium text-silver transition-colors hover:bg-deep-blue-600 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Phone className="h-6 w-6" />
                    Start Voice Session
                  </>
                )}
              </button>
            )}
          </div>

          {/* Transcript (optional - shows conversation history) */}
          {transcript.length > 0 && (
            <div className="mt-8 w-full max-w-2xl">
              <h3 className="mb-4 text-sm font-medium text-silver-light">Conversation</h3>
              <div className="space-y-2 rounded-lg border border-white/5 bg-titanium-900/50 p-4 text-sm">
                {transcript.map((item, index) => (
                  <div
                    key={index}
                    className={`${
                      item.role === 'user' ? 'text-silver' : 'text-deep-blue-300'
                    }`}
                  >
                    <span className="font-medium">
                      {item.role === 'user' ? 'You' : 'Coach'}:
                    </span>{' '}
                    {item.message}
                  </div>
                ))}
              </div>
            </div>
          )}
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
    </ErrorBoundary>
  )
}
