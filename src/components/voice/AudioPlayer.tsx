'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, Loader2 } from 'lucide-react'

interface AudioPlayerProps {
  text: string
  autoPlay?: boolean
}

export function AudioPlayer({ text, autoPlay = false }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (autoPlay) {
      handlePlayPause()
    }

    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  const handlePlayPause = async () => {
    if (isPlaying) {
      // Pause
      audioRef.current?.pause()
      setIsPlaying(false)
    } else {
      // Play
      if (!audioUrl) {
        await generateAudio()
      } else {
        audioRef.current?.play()
        setIsPlaying(true)
      }
    }
  }

  const generateAudio = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/voice/synthesize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate audio')
      }

      const audioBlob = await response.blob()
      const url = URL.createObjectURL(audioBlob)

      setAudioUrl(url)

      // Create and play audio
      const audio = new Audio(url)
      audioRef.current = audio

      audio.onended = () => {
        setIsPlaying(false)
      }

      audio.onerror = () => {
        setError('Failed to play audio')
        setIsPlaying(false)
      }

      await audio.play()
      setIsPlaying(true)
    } catch (err: any) {
      console.error('Audio generation error:', err)
      setError('Failed to generate audio')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="inline-flex items-center gap-2">
      <button
        onClick={handlePlayPause}
        disabled={isLoading}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-deep-blue-800/50 hover:bg-deep-blue-800 transition-colors"
        title={isPlaying ? 'Pause' : 'Play audio'}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-silver" />
        ) : isPlaying ? (
          <Pause className="h-4 w-4 text-silver" />
        ) : (
          <Play className="h-4 w-4 text-silver ml-0.5" />
        )}
      </button>

      {isPlaying && <Volume2 className="h-4 w-4 animate-pulse text-silver-dark" />}

      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  )
}
