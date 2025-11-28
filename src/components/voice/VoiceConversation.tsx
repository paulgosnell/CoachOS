'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, Phone, Loader2, ArrowLeft, Play, Square } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Toast } from '@/components/Toast'

interface VoiceConversationProps {
  config: {
    systemPrompt: string
    firstName: string
    voiceSettings: {
      voice: string
      speed: number
      vadThreshold: number
      vadSilenceDuration: number
    }
  }
  router: any
}

export function VoiceConversation({ config, router }: VoiceConversationProps) {
  const [error, setError] = useState<string | null>(null)
  const [transcript, setTranscript] = useState<Array<{ role: string; message: string }>>([])
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const conversationIdRef = useRef<string | null>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const dataChannelRef = useRef<RTCDataChannel | null>(null)
  const audioStreamRef = useRef<MediaStream | null>(null)
  const remoteAudioRef = useRef<HTMLAudioElement>(null)
  const supabase = createClient()

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close()
      }
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

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

  // Handle data channel messages
  const handleDataChannelMessage = (event: MessageEvent) => {
    try {
      const msg = JSON.parse(event.data)
      console.log('Data channel message:', msg.type)

      switch (msg.type) {
        case 'session.created':
          console.log('Session created, configuring...')
          // Configure session with system prompt and voice settings
          if (dataChannelRef.current) {
            dataChannelRef.current.send(JSON.stringify({
              type: 'session.update',
              session: {
                instructions: config.systemPrompt,
                voice: config.voiceSettings.voice,
                input_audio_transcription: { model: 'whisper-1' },
                turn_detection: {
                  type: 'server_vad',
                  threshold: config.voiceSettings.vadThreshold,
                  prefix_padding_ms: 300,
                  silence_duration_ms: config.voiceSettings.vadSilenceDuration
                }
              }
            }))
          }
          break

        case 'session.updated':
          console.log('Session updated, ready to use')
          setIsConnected(true)
          setIsConnecting(false)

          // Send first message
          if (dataChannelRef.current) {
            dataChannelRef.current.send(JSON.stringify({
              type: 'conversation.item.create',
              item: {
                type: 'message',
                role: 'user',
                content: [{
                  type: 'input_text',
                  text: `Say: "Hey ${config.firstName}! Ready to dive in?"`
                }]
              }
            }))
            dataChannelRef.current.send(JSON.stringify({ type: 'response.create' }))
          }
          break

        case 'input_audio_buffer.speech_started':
          console.log('User started speaking')
          setIsSpeaking(true)
          break

        case 'input_audio_buffer.speech_stopped':
          console.log('User stopped speaking')
          setIsSpeaking(false)
          break

        case 'conversation.item.input_audio_transcription.completed':
          console.log('User transcription:', msg.transcript)
          setTranscript(prev => [...prev, { role: 'user', message: msg.transcript }])
          saveMessage('user', msg.transcript)
          break

        case 'response.audio_transcript.delta':
          // Streaming assistant response
          break

        case 'response.audio_transcript.done':
          console.log('Assistant response:', msg.transcript)
          setTranscript(prev => [...prev, { role: 'assistant', message: msg.transcript }])
          saveMessage('assistant', msg.transcript)
          break

        case 'response.done':
          console.log('Response complete:', msg.response?.usage)

          // Track token usage for voice
          if (msg.response?.usage && conversationIdRef.current) {
            fetch('/api/voice/track-usage', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                conversationId: conversationIdRef.current,
                usage: msg.response.usage,
              }),
            }).catch(err => console.error('Failed to track voice usage:', err))
          }
          break

        case 'error':
          console.error('Realtime API error:', msg.error)
          setError(msg.error.message || 'An error occurred')
          break
      }
    } catch (err) {
      console.error('Failed to parse data channel message:', err)
    }
  }

  const startConversation = async () => {
    try {
      setError(null)
      setIsConnecting(true)

      // Create conversation in database
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('Not authenticated')
      }

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

      // Get ephemeral token
      const tokenResponse = await fetch('/api/openai-realtime-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!tokenResponse.ok) {
        throw new Error('Failed to get session token')
      }

      const { client_secret } = await tokenResponse.json()

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioStreamRef.current = stream

      // Create WebRTC connection
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      })
      peerConnectionRef.current = pc

      // Handle remote audio track
      pc.ontrack = (event) => {
        console.log('Remote audio track received')
        if (remoteAudioRef.current && event.streams[0]) {
          remoteAudioRef.current.srcObject = event.streams[0]
          remoteAudioRef.current.play().catch(err => {
            console.error('Failed to play remote audio:', err)
          })
        }
      }

      // Add local audio track
      const audioTrack = stream.getAudioTracks()[0]
      pc.addTrack(audioTrack, stream)

      // Create data channel for events
      const dc = pc.createDataChannel('oai-events')
      dataChannelRef.current = dc

      dc.onopen = () => console.log('Data channel opened')
      dc.onclose = () => console.log('Data channel closed')
      dc.onerror = (err) => console.error('Data channel error:', err)
      dc.onmessage = handleDataChannelMessage

      // Create and send offer
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)

      // Send SDP to OpenAI
      const sdpResponse = await fetch('https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${client_secret.value}`,
          'Content-Type': 'application/sdp'
        },
        body: offer.sdp
      })

      if (!sdpResponse.ok) {
        throw new Error('Failed to connect to OpenAI Realtime')
      }

      const answerSdp = await sdpResponse.text()
      await pc.setRemoteDescription({
        type: 'answer',
        sdp: answerSdp
      })

      console.log('WebRTC connection established')
    } catch (err: any) {
      console.error('Failed to start conversation:', err)
      setError(err.message || 'Failed to start conversation')
      setIsConnecting(false)

      // Cleanup on error
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => track.stop())
        audioStreamRef.current = null
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close()
        peerConnectionRef.current = null
      }
    }
  }

  const endConversation = async () => {
    try {
      // Close connections
      if (dataChannelRef.current) {
        dataChannelRef.current.close()
        dataChannelRef.current = null
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close()
        peerConnectionRef.current = null
      }
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => track.stop())
        audioStreamRef.current = null
      }

      setIsConnected(false)
      setIsSpeaking(false)

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

      setTranscript([])
    } catch (err) {
      console.error('Failed to end conversation:', err)
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Hidden audio element for remote audio */}
      <audio ref={remoteAudioRef} autoPlay />

      {/* Minimal Mobile Header */}
      <div className="flex items-center justify-between border-b border-white/5 bg-titanium-900/80 p-4">
        <button
          onClick={() => router.push('/dashboard')}
          className="text-silver-light transition-colors hover:text-silver"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <p className="text-sm font-medium text-silver">
          {isConnected ? 'Connected' : isConnecting ? 'Connecting...' : 'Voice'}
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
        {isConnected ? (
          <div className="flex flex-col items-center space-y-8">
            {/* Animated Speaking Indicator */}
            <div
              className={`flex h-40 w-40 items-center justify-center rounded-full transition-all duration-300 ${
                isSpeaking
                  ? 'animate-pulse bg-deep-blue-600 shadow-2xl shadow-deep-blue-600/40'
                  : 'bg-deep-blue-800/50'
              }`}
            >
              <Mic className="h-16 w-16 text-silver" />
            </div>

            <div className="text-center">
              <p className="mb-2 text-xl font-medium text-silver">
                {isSpeaking ? 'Listening...' : 'Your turn'}
              </p>
            </div>

            <button
              onClick={endConversation}
              className="flex h-14 w-14 items-center justify-center rounded-lg bg-red-600 text-white shadow-lg transition-all hover:bg-red-700 active:scale-95"
            >
              <Square className="h-6 w-6" />
            </button>
          </div>
        ) : isConnecting ? (
          <div className="flex flex-col items-center space-y-8">
            <div className="flex h-40 w-40 items-center justify-center rounded-full bg-titanium-800/50">
              <Loader2 className="h-16 w-16 animate-spin text-silver-light" />
            </div>
            <p className="text-silver-light">Connecting...</p>
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
