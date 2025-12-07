'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Mic, Phone, Loader2, ArrowLeft, Play, Square } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Toast } from '@/components/Toast'

interface GeminiVoiceConversationProps {
  config: {
    systemPrompt: string
    firstName: string
    voiceSettings: {
      voice: string
      geminiVoice: string
      vadThreshold: number
      vadSilenceDuration: number
    }
  }
  router: any
}

export function GeminiVoiceConversation({ config, router }: GeminiVoiceConversationProps) {
  const [error, setError] = useState<string | null>(null)
  const [transcript, setTranscript] = useState<Array<{ role: string; message: string }>>([])
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false)

  const conversationIdRef = useRef<string | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const processorRef = useRef<ScriptProcessorNode | null>(null)
  const nextPlayTimeRef = useRef(0)
  const transcriptRef = useRef<Array<{ role: string; message: string }>>([])
  const isMountedRef = useRef(true)
  const supabase = createClient()

  // Audio utility functions
  const floatTo16BitPCM = (float32Array: Float32Array): ArrayBuffer => {
    const buffer = new ArrayBuffer(float32Array.length * 2)
    const view = new DataView(buffer)
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]))
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true)
    }
    return buffer
  }

  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }

  const downsampleBuffer = (
    buffer: Float32Array,
    inputSampleRate: number,
    outputSampleRate: number
  ): Float32Array => {
    if (inputSampleRate === outputSampleRate) return buffer
    const ratio = inputSampleRate / outputSampleRate
    const newLength = Math.round(buffer.length / ratio)
    const result = new Float32Array(newLength)
    for (let i = 0; i < newLength; i++) {
      result[i] = buffer[Math.round(i * ratio)]
    }
    return result
  }

  // Play audio with queuing to prevent overlap
  const playAudio = async (base64Audio: string) => {
    if (!isMountedRef.current) return

    try {
      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new AudioContext({ sampleRate: 24000 })
      }

      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume()
      }

      // Decode base64 -> Int16 PCM -> Float32
      const binaryString = atob(base64Audio)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }

      const pcmData = new Int16Array(bytes.buffer)
      const floatData = new Float32Array(pcmData.length)
      for (let i = 0; i < pcmData.length; i++) {
        floatData[i] = pcmData[i] / 32768
      }

      // Create and play audio buffer
      const audioBuffer = audioContextRef.current.createBuffer(1, floatData.length, 24000)
      audioBuffer.getChannelData(0).set(floatData)

      const source = audioContextRef.current.createBufferSource()
      source.buffer = audioBuffer
      source.connect(audioContextRef.current.destination)

      // Queue chunks sequentially
      const now = audioContextRef.current.currentTime
      const startTime = Math.max(now, nextPlayTimeRef.current)
      source.start(startTime)
      nextPlayTimeRef.current = startTime + audioBuffer.duration
    } catch (err) {
      console.error('Audio playback error:', err)
    }
  }

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

  // Start microphone input
  const startMicrophone = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        }
      })
      mediaStreamRef.current = stream

      // Create audio context for processing
      const audioCtx = new AudioContext({ sampleRate: 16000 })
      audioContextRef.current = audioCtx

      const source = audioCtx.createMediaStreamSource(stream)
      const processor = audioCtx.createScriptProcessor(4096, 1, 1)
      processorRef.current = processor

      // Voice activity detection state
      let localIsSpeaking = false
      let silenceCount = 0
      const vadThreshold = config.voiceSettings.vadThreshold || 0.5
      const rmsThreshold = 0.01 + (vadThreshold - 0.5) * 0.02 // Scale threshold

      processor.onaudioprocess = (e) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return

        const inputData = e.inputBuffer.getChannelData(0)

        // Simple VAD based on RMS
        const rms = Math.sqrt(
          inputData.reduce((sum, val) => sum + val * val, 0) / inputData.length
        )

        if (rms > rmsThreshold) {
          localIsSpeaking = true
          silenceCount = 0
          setIsSpeaking(true)
        } else {
          silenceCount++
          // Configurable silence duration (roughly 10 * 4096 samples at 16kHz = ~2.5s with default)
          const silenceThreshold = Math.round((config.voiceSettings.vadSilenceDuration || 500) / 250)
          if (silenceCount > silenceThreshold && localIsSpeaking) {
            localIsSpeaking = false
            setIsSpeaking(false)
          }
        }

        // Send audio to Gemini
        const downsampled = downsampleBuffer(inputData, audioCtx.sampleRate, 16000)
        const pcmData = floatTo16BitPCM(downsampled)
        const base64Audio = arrayBufferToBase64(pcmData)

        wsRef.current.send(JSON.stringify({
          realtimeInput: {
            mediaChunks: [{
              mimeType: 'audio/pcm;rate=16000',
              data: base64Audio
            }]
          }
        }))
      }

      source.connect(processor)
      processor.connect(audioCtx.destination)
    } catch (err) {
      console.error('Microphone error:', err)
      throw err
    }
  }, [config.voiceSettings])

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
          title: 'ADHD Coach Session',
        })
        .select()
        .single()

      if (convError) throw convError
      conversationIdRef.current = data.id

      // Get WebSocket URL from API
      const response = await fetch('/api/gemini-live-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) {
        throw new Error('Failed to get session')
      }

      const { wsUrl, model } = await response.json()

      // Connect to Gemini Live API
      const ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onopen = () => {
        console.log('WebSocket connected, sending setup...')

        // Use the Gemini voice from settings
        const geminiVoice = config.voiceSettings.geminiVoice || 'Puck'
        console.log('Using Gemini voice:', geminiVoice)
        console.log('Model:', model)

        // Send setup message
        const setupMessage = {
          setup: {
            model: `models/${model}`,
            generationConfig: {
              responseModalities: 'audio',
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: geminiVoice
                  }
                }
              },
              // Disable thinking mode to avoid reasoning traces in output
              thinkingConfig: {
                thinkingBudget: 0
              }
            },
            systemInstruction: {
              parts: [{
                text: config.systemPrompt
              }]
            }
          }
        }
        console.log('Sending setup message:', JSON.stringify(setupMessage, null, 2).substring(0, 500))
        ws.send(JSON.stringify(setupMessage))
        console.log('Setup message sent')
      }

      ws.onmessage = async (event) => {
        let data: any

        // Handle Blob messages (browser WebSocket quirk)
        if (event.data instanceof Blob) {
          const text = await event.data.text()
          try {
            data = JSON.parse(text)
          } catch {
            // Binary audio data
            const arrayBuffer = await event.data.arrayBuffer()
            await playAudio(arrayBufferToBase64(arrayBuffer))
            return
          }
        } else {
          try {
            data = JSON.parse(event.data)
          } catch {
            console.error('Failed to parse message:', event.data)
            return
          }
        }

        // Setup complete - start microphone and send welcome
        if (data.setupComplete) {
          console.log('Setup complete')
          setIsConnected(true)
          setIsConnecting(false)

          await startMicrophone()

          // Send initial greeting prompt
          setTimeout(() => {
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
              wsRef.current.send(JSON.stringify({
                clientContent: {
                  turns: [{
                    role: 'user',
                    parts: [{
                      text: `Say a short, energetic greeting to ${config.firstName}. Just say "Hey ${config.firstName}! What's got your attention right now?" - keep it brief and casual.`
                    }]
                  }],
                  turnComplete: true
                }
              }))
            }
          }, 500)
        }

        // Handle server content (audio/text responses)
        if (data.serverContent) {
          if (data.serverContent.modelTurn?.parts) {
            for (const part of data.serverContent.modelTurn.parts) {
              if (part.inlineData) {
                setIsAgentSpeaking(true)
                await playAudio(part.inlineData.data)
              }
              if (part.text) {
                // Filter out thinking/reasoning traces (they start with ** markdown headers)
                const isThinkingContent = part.text.trim().startsWith('**') &&
                  (part.text.includes('Considering') ||
                   part.text.includes('Recognizing') ||
                   part.text.includes('Acknowledging') ||
                   part.text.includes('Thinking') ||
                   part.text.includes('Processing') ||
                   part.text.includes('Analyzing') ||
                   part.text.includes('Evaluating') ||
                   part.text.includes('Reflecting'))

                if (!isThinkingContent) {
                  // Text transcript from the agent
                  console.log('Agent text:', part.text)
                  const assistantEntry = { role: 'assistant', message: part.text }
                  setTranscript(prev => [...prev, assistantEntry])
                  transcriptRef.current = [...transcriptRef.current, assistantEntry]
                  saveMessage('assistant', part.text)
                } else {
                  console.log('Filtered thinking content:', part.text.substring(0, 50))
                }
              }
            }
          }
          if (data.serverContent.turnComplete) {
            setIsAgentSpeaking(false)
          }
        }

        // Handle user transcription if available
        if (data.clientContent?.turns) {
          for (const turn of data.clientContent.turns) {
            if (turn.role === 'user' && turn.parts) {
              for (const part of turn.parts) {
                if (part.text) {
                  const userEntry = { role: 'user', message: part.text }
                  setTranscript(prev => [...prev, userEntry])
                  transcriptRef.current = [...transcriptRef.current, userEntry]
                  saveMessage('user', part.text)
                }
              }
            }
          }
        }
      }

      ws.onerror = (event) => {
        console.error('WebSocket error:', event)
        setError('Connection error')
        setIsConnecting(false)
      }

      ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason)
        if (event.code !== 1000) {
          setError(`Connection closed: ${event.reason || 'Unknown reason'} (code: ${event.code})`)
        }
        setIsConnected(false)
        setIsConnecting(false)
      }

    } catch (err: any) {
      console.error('Failed to start conversation:', err)
      setError(err.message || 'Failed to start conversation')
      setIsConnecting(false)
      cleanup()
    }
  }

  const cleanup = () => {
    processorRef.current?.disconnect()
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close()
    }
    mediaStreamRef.current?.getTracks().forEach(t => t.stop())
    wsRef.current?.close()
  }

  const endConversation = async () => {
    try {
      cleanup()

      setIsConnected(false)
      setIsSpeaking(false)
      setIsAgentSpeaking(false)

      // Update conversation end time and extract action items
      if (conversationIdRef.current) {
        try {
          await supabase
            .from('conversations')
            .update({ ended_at: new Date().toISOString() })
            .eq('id', conversationIdRef.current)

          // Extract action items from voice conversation
          const currentTranscript = transcriptRef.current
          console.log('Extracting action items from transcript:', currentTranscript.length, 'messages')

          if (currentTranscript.length > 0) {
            try {
              const response = await fetch('/api/actions/extract', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  conversationId: conversationIdRef.current,
                  messages: currentTranscript.map((t) => ({
                    role: t.role,
                    content: t.message,
                  })),
                }),
              })

              if (response.ok) {
                const data = await response.json()
                console.log('Action extraction result:', data)
                if (data.actionCount > 0) {
                  setToastMessage(`${data.actionCount} task${data.actionCount > 1 ? 's' : ''} captured`)
                  setShowToast(true)
                }
              } else {
                console.error('Action extraction failed:', response.status, await response.text())
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
      transcriptRef.current = []
    } catch (err) {
      console.error('Failed to end conversation:', err)
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
      cleanup()
    }
  }, [])

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
        <div className="text-center">
          <p className="text-sm font-medium text-silver">
            {isConnected ? 'Connected' : isConnecting ? 'Connecting...' : 'ADHD Coach'}
          </p>
          <p className="text-xs text-amber-400">Powered by Gemini</p>
        </div>
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
                isAgentSpeaking
                  ? 'animate-pulse bg-amber-600 shadow-2xl shadow-amber-600/40'
                  : isSpeaking
                  ? 'animate-pulse bg-deep-blue-600 shadow-2xl shadow-deep-blue-600/40'
                  : 'bg-titanium-800/50'
              }`}
            >
              <Mic className="h-16 w-16 text-silver" />
            </div>

            <div className="text-center">
              <p className="mb-2 text-xl font-medium text-silver">
                {isAgentSpeaking ? 'Coach speaking...' : isSpeaking ? 'Listening...' : 'Your turn'}
              </p>
              <p className="text-sm text-silver-light">
                Just talk naturally - one action at a time
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
              <Loader2 className="h-16 w-16 animate-spin text-amber-400" />
            </div>
            <p className="text-silver-light">Connecting to ADHD Coach...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-12">
            {/* Ready State */}
            <div className="flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-amber-600/20 to-amber-800/20 ring-2 ring-amber-500/30">
              <Phone className="h-16 w-16 text-amber-400" />
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-silver">ADHD Coach</h2>
              <p className="text-sm text-silver-light max-w-xs">
                Quick, focused sessions. One action at a time. No judgment.
              </p>
            </div>

            <button
              onClick={startConversation}
              className="flex h-16 w-16 items-center justify-center rounded-lg bg-amber-600 text-white shadow-lg transition-all hover:bg-amber-500 active:scale-95"
            >
              <Play className="h-8 w-8" />
            </button>

            {/* ADHD-friendly tips */}
            <div className="w-full max-w-xs space-y-2 text-center text-sm text-silver-light">
              <p>Use headphones for best quality</p>
              <p>No prep needed - just start talking</p>
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
