'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, Square, Loader2 } from 'lucide-react'

interface VoiceRecorderProps {
  onTranscription: (text: string) => void
  disabled?: boolean
}

export function VoiceRecorder({ onTranscription, disabled = false }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop()
      }
    }
  }, [isRecording])

  const startRecording = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
        stream.getTracks().forEach((track) => track.stop())

        console.log('Audio blob size:', audioBlob.size, 'bytes')

        // Check if audio was actually recorded
        if (audioBlob.size === 0) {
          setError('No audio recorded. Please try again.')
          return
        }

        // Transcribe audio
        await transcribeAudio(audioBlob)
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (err: any) {
      console.error('Failed to start recording:', err)
      setError('Failed to access microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      setIsProcessing(true)

      // Convert blob to file
      const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' })

      // Send to transcription API
      const formData = new FormData()
      formData.append('audio', audioFile)

      const response = await fetch('/api/voice/transcribe', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Transcription failed')
      }

      const { text } = await response.json()

      if (text) {
        onTranscription(text)
      }
    } catch (err: any) {
      console.error('Failed to transcribe:', err)
      setError('Failed to transcribe audio. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Recording Button */}
      <div className="flex items-center gap-4">
        {!isRecording && !isProcessing && (
          <button
            onClick={startRecording}
            disabled={disabled}
            className="btn btn-primary h-16 w-16 rounded-full p-0"
            title="Start voice recording"
          >
            <Mic className="h-6 w-6" />
          </button>
        )}

        {isRecording && (
          <button
            onClick={stopRecording}
            className="btn h-16 w-16 rounded-full bg-red-500 p-0 hover:bg-red-600"
            title="Stop recording"
          >
            <Square className="h-6 w-6" />
          </button>
        )}

        {isProcessing && (
          <div className="flex h-16 w-16 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-silver" />
          </div>
        )}
      </div>

      {/* Recording Status */}
      {isRecording && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 animate-pulse rounded-full bg-red-500" />
            <span className="text-sm font-medium text-silver">Recording</span>
          </div>
          <span className="text-sm text-gray-400">{formatTime(recordingTime)}</span>
        </div>
      )}

      {isProcessing && (
        <p className="text-sm text-silver-light">Transcribing your message...</p>
      )}

      {!isRecording && !isProcessing && (
        <p className="text-xs text-gray-500">Tap to start voice message</p>
      )}
    </div>
  )
}
