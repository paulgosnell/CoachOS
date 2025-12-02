'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, Loader2, X, ChevronDown } from 'lucide-react'

const VOICES = [
    { id: 'verse', name: 'Verse', description: 'Calm & thoughtful' },
    { id: 'alloy', name: 'Alloy', description: 'Warm & balanced' },
    { id: 'echo', name: 'Echo', description: 'Clear & direct' },
    { id: 'shimmer', name: 'Shimmer', description: 'Bright & friendly' },
]

const DEMO_SYSTEM_PROMPT = `You are an executive coach providing a 3-minute demo session. Give the visitor an authentic taste of coaching - be helpful and insightful within this short window.

## Key Constraint: 3 Minutes Total
You only have 3 minutes. Be concise and impactful:
- Keep each response under 20 seconds
- Skip lengthy intros - get to coaching quickly
- Ask ONE focused question at a time
- Aim for 2-3 meaningful exchanges, not a full session

## Your Approach
- Listen and reflect back what you hear
- Ask powerful questions that create insight
- Help them gain one clear takeaway or next step
- Be warm but efficient with time

## Session Flow (3 mins)
1. Brief welcome, ask what's on their mind (30 sec)
2. Listen, ask 1-2 clarifying questions (1 min)
3. Offer a perspective or reframe (1 min)
4. Help identify one small action or insight (30 sec)

## If They're Unsure What to Discuss
Quickly suggest: "What's one decision you're weighing, or a challenge that's been on your mind this week?"

## Communication Style
- Concise and direct, but warm
- No filler or lengthy preambles
- One question per turn
- Speak like a trusted advisor

## First Message
Keep it brief: Welcome them warmly and ask what's on their mind today that you could help them think through.`

interface DemoVoiceProps {
    onClose: () => void
}

export function DemoVoice({ onClose }: DemoVoiceProps) {
    const [error, setError] = useState<string | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const [isConnecting, setIsConnecting] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [isAiSpeaking, setIsAiSpeaking] = useState(false)
    const [timeRemaining, setTimeRemaining] = useState(180) // 3 minutes
    const [selectedVoice, setSelectedVoice] = useState('verse')
    const [showVoiceMenu, setShowVoiceMenu] = useState(false)

    const sessionIdRef = useRef<string>(crypto.randomUUID())
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
    const dataChannelRef = useRef<RTCDataChannel | null>(null)
    const audioStreamRef = useRef<MediaStream | null>(null)
    const remoteAudioRef = useRef<HTMLAudioElement>(null)
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)
    const selectedVoiceRef = useRef(selectedVoice)

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
                    console.log('Demo session created with voice:', selectedVoiceRef.current)
                    if (dataChannelRef.current) {
                        dataChannelRef.current.send(JSON.stringify({
                            type: 'session.update',
                            session: {
                                instructions: DEMO_SYSTEM_PROMPT,
                                voice: selectedVoiceRef.current,
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
                    console.log('Demo session updated, triggering welcome message')
                    setIsConnected(true)
                    setIsConnecting(false)
                    // Trigger AI to speak first with welcome message
                    if (dataChannelRef.current) {
                        dataChannelRef.current.send(JSON.stringify({
                            type: 'response.create',
                            response: {
                                modalities: ['text', 'audio'],
                                instructions: 'Greet the user briefly and warmly, then ask what\'s on their mind today. Keep it under 10 seconds.'
                            }
                        }))
                    }
                    break

                case 'response.audio_transcript.delta':
                case 'response.audio.delta':
                    setIsAiSpeaking(true)
                    break

                case 'response.audio_transcript.done':
                case 'response.done':
                    setIsAiSpeaking(false)
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

    const cleanupConnection = () => {
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
        setIsAiSpeaking(false)
    }

    const endConversation = () => {
        cleanupConnection()
        onClose()
    }

    const switchVoice = (newVoice: string) => {
        setSelectedVoice(newVoice)
        selectedVoiceRef.current = newVoice
        setShowVoiceMenu(false)

        // Restart session with new voice
        cleanupConnection()
        sessionIdRef.current = crypto.randomUUID()
        startConversation()
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
                                className={`flex h-32 w-32 items-center justify-center rounded-full transition-all duration-300 ${
                                    isAiSpeaking
                                        ? 'animate-pulse bg-green-600 shadow-2xl shadow-green-600/40 scale-110'
                                        : isSpeaking
                                            ? 'animate-pulse bg-deep-blue-600 shadow-2xl shadow-deep-blue-600/40 scale-110'
                                            : 'bg-deep-blue-800/50'
                                }`}
                            >
                                <Mic className="h-12 w-12 text-silver" />
                            </div>

                            <div className="text-center">
                                <p className="text-lg font-medium text-silver mb-2">
                                    {isAiSpeaking ? 'Coach is speaking...' : isSpeaking ? 'Listening...' : 'Your coach is ready'}
                                </p>
                                <p className="text-sm text-silver-dark">
                                    Share what's on your mind - a decision, challenge, or goal
                                </p>
                            </div>

                            {/* Voice Selector */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowVoiceMenu(!showVoiceMenu)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-titanium-800 border border-white/10 text-sm text-silver-light hover:bg-titanium-700 transition-colors"
                                >
                                    Voice: {VOICES.find(v => v.id === selectedVoice)?.name}
                                    <ChevronDown className="h-4 w-4" />
                                </button>
                                {showVoiceMenu && (
                                    <div className="absolute bottom-full left-0 mb-2 w-48 rounded-lg bg-titanium-800 border border-white/10 shadow-xl overflow-hidden">
                                        {VOICES.map(voice => (
                                            <button
                                                key={voice.id}
                                                onClick={() => switchVoice(voice.id)}
                                                className={`w-full px-4 py-2 text-left text-sm hover:bg-titanium-700 transition-colors ${
                                                    selectedVoice === voice.id ? 'bg-titanium-700 text-silver' : 'text-silver-light'
                                                }`}
                                            >
                                                <span className="font-medium">{voice.name}</span>
                                                <span className="text-silver-dark ml-2">{voice.description}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
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
