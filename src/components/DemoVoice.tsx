'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, Loader2, X } from 'lucide-react'

const DEMO_SYSTEM_PROMPT = `You are a friendly Coach OS sales representative helping potential customers learn about the product. You're knowledgeable, enthusiastic, and concise.

## About Coach OS

**What it is:**
Coach OS is an AI-powered executive coaching platform designed for busy founders and CEOs. It provides 24/7 access to professional coaching using proven methodologies, with both voice and text interfaces.

**Core Features:**
1. **Voice & Text Coaching** - Have natural conversations via voice (using GPT-4o Realtime) or text chat
2. **Proven Frameworks** - Uses professional coaching methods including:
   - GROW Model (Goal, Reality, Options, Will)
   - OKRs (Objectives and Key Results)
   - Eisenhower Matrix (prioritization)
   - SWOT Analysis
   - Force Field Analysis
   - Start/Stop/Continue retrospectives

3. **Long-Term Memory** - Coach OS remembers all your conversations, goals, and progress using semantic search and RAG (Retrieval Augmented Generation). It recalls context from weeks or months ago.

4. **Automatic Action Item Extraction** - Every coaching session automatically identifies and captures commitments and tasks (like Granola for meetings)

5. **Progress Tracking** - Visualizes growth in areas like strategic clarity, leadership confidence, and overall development

6. **Daily & Weekly Summaries** - Automatic insights on your progress, patterns, and recommendations

**Technology:**
- GPT-4o and Gemini 2.5 for intelligence
- OpenAI Realtime API for natural voice conversations
- Vector embeddings for long-term memory
- Whisper for transcription

**Ideal For:**
Time-poor founders and CEOs who value coaching but need the flexibility of on-demand access. Anyone who wants professional coaching without scheduling conflicts.

**Pricing:**
[You can mention that visitors should sign up to see pricing options, or that it's designed for professional use]

**Key Differentiators:**
- Not just a chatbot - uses actual coaching methodologies
- Remembers everything across sessions
- Automatically extracts action items
- Available 24/7 via voice or text
- Tracks your growth over time

## Your Communication Style:
- Be warm, professional, and helpful
- Keep responses under 30 seconds
- If they seem interested, encourage them to sign up for a free trial
- Focus on benefits, not just features
- Use "Coach OS" when referring to the product

## First Interaction:
When the session starts, greet them warmly and let them know you can answer questions about Coach OS features, pricing, or how it works.

interface DemoVoiceProps {
    onClose: () => void
}

export function DemoVoice({ onClose }: DemoVoiceProps) {
    const [error, setError] = useState<string | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const [isConnecting, setIsConnecting] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [timeRemaining, setTimeRemaining] = useState(180) // 3 minutes

    const sessionIdRef = useRef<string>(crypto.randomUUID())
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
    const dataChannelRef = useRef<RTCDataChannel | null>(null)
    const audioStreamRef = useRef<MediaStream | null>(null)
    const remoteAudioRef = useRef<HTMLAudioElement>(null)
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)

    // Countdown timer
    useEffect(() => {
        if (isConnected) {
            timerIntervalRef.current = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        endConversation()
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        }

        return () => {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current)
            }
        }
    }, [isConnected])

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

    const handleDataChannelMessage = (event: MessageEvent) => {
        try {
            const msg = JSON.parse(event.data)

            switch (msg.type) {
                case 'session.created':
                    console.log('Demo session created')
                    if (dataChannelRef.current) {
                        dataChannelRef.current.send(JSON.stringify({
                            type: 'session.update',
                            session: {
                                instructions: DEMO_SYSTEM_PROMPT,
                                voice: 'verse',
                                input_audio_transcription: { model: 'whisper-1' },
                                turn_detection: {
                                    type: 'server_vad',
                                    threshold: 0.5,
                                    prefix_padding_ms: 300,
                                    silence_duration_ms: 700
                                }
                            }
                        }))
                    }
                    break

                case 'session.updated':
                    console.log('Demo session updated, ready for user input')
                    setIsConnected(true)
                    setIsConnecting(false)
                    // No automatic greeting - let the user speak first
                    // The system prompt will handle the greeting when they do
                    break

                case 'input_audio_buffer.speech_started':
                    setIsSpeaking(true)
                    break

                case 'input_audio_buffer.speech_stopped':
                    setIsSpeaking(false)
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

            // Get ephemeral token for demo
            const tokenResponse = await fetch('/api/demo-voice-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId: sessionIdRef.current })
            })

            if (!tokenResponse.ok) {
                const errorData = await tokenResponse.json()
                throw new Error(errorData.error || 'Failed to get session token')
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

            dc.onopen = () => console.log('Demo data channel opened')
            dc.onclose = () => console.log('Demo data channel closed')
            dc.onerror = (err) => console.error('Demo data channel error:', err)
            dc.onmessage = handleDataChannelMessage

            // Create and send offer
            const offer = await pc.createOffer()
            await pc.setLocalDescription(offer)

            // Send SDP to OpenAI
            const sdpResponse = await fetch('https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${ client_secret.value }`,
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

            console.log('Demo WebRTC connection established')
        } catch (err: any) {
            console.error('Failed to start demo conversation:', err)
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

    const endConversation = () => {
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
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current)
        }

        setIsConnected(false)
        setIsSpeaking(false)
        onClose()
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${ mins }:${ secs.toString().padStart(2, '0') } `
    }

    // Auto-start on mount
    useEffect(() => {
        startConversation()
    }, [])

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            {/* Hidden audio element for remote audio */}
            <audio ref={remoteAudioRef} autoPlay />

            <div className="relative w-full max-w-md rounded-2xl bg-titanium-900 border border-white/10 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/5 p-4">
                    <div>
                        <h3 className="font-semibold text-silver">Coach OS Demo</h3>
                        {isConnected && (
                            <p className="text-xs text-silver-dark">
                                Time remaining: {formatTime(timeRemaining)}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={endConversation}
                        className="text-silver-dark hover:text-silver transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col items-center space-y-6">
                    {error && (
                        <div className="w-full rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center text-sm text-red-400">
                            {error}
                            <button
                                onClick={() => setError(null)}
                                className="ml-2 underline"
                            >
                                Dismiss
                            </button>
                        </div>
                    )}

                    {isConnecting ? (
                        <>
                            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-titanium-800/50">
                                <Loader2 className="h-12 w-12 animate-spin text-silver-light" />
                            </div>
                            <p className="text-silver-light">Connecting...</p>
                        </>
                    ) : isConnected ? (
                        <>
                            <div
                                className={`flex h - 32 w - 32 items - center justify - center rounded - full transition - all duration - 300 ${
    isSpeaking
        ? 'animate-pulse bg-deep-blue-600 shadow-2xl shadow-deep-blue-600/40 scale-110'
        : 'bg-deep-blue-800/50'
} `}
                            >
                                <Mic className="h-12 w-12 text-silver" />
                            </div>

                            <div className="text-center">
                                <p className="text-lg font-medium text-silver mb-2">
                                    {isSpeaking ? 'Listening...' : 'Ask me anything about Coach OS'}
                                </p>
                                <p className="text-sm text-silver-dark">
                                    Try: "What coaching frameworks do you use?" or "How much does it cost?"
                                </p>
                            </div>

                            <button
                                onClick={endConversation}
                                className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                            >
                                End Demo
                            </button>
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    )
}
