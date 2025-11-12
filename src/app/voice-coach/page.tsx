'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { VoiceConversation } from '@/components/voice/VoiceConversation'

export default function VoiceCoachPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sessionConfig, setSessionConfig] = useState<any>(null)

  useEffect(() => {
    checkAuthAndFetchConfig()
  }, [])

  const checkAuthAndFetchConfig = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      // Fetch conversation configuration with user context
      const response = await fetch('/api/voice/conversation', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to load conversation configuration')
      }

      const data = await response.json()
      setSessionConfig(data)
      setLoading(false)
    } catch (err: any) {
      console.error('Failed to initialize:', err)
      setError(err.message || 'Failed to initialize voice coach')
      setLoading(false)
    }
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

  if (!sessionConfig) {
    return null
  }

  return <VoiceConversation config={sessionConfig} router={router} />
}
