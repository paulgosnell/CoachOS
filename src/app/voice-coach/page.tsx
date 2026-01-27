'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Mic, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function VoiceCoachPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [hasConversations, setHasConversations] = useState(false)

  useEffect(() => {
    checkForRecentConversation()
  }, [])

  const checkForRecentConversation = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      // Check for most recent voice conversation
      const { data: recentConversation } = await supabase
        .from('conversations')
        .select('id')
        .eq('user_id', user.id)
        .eq('session_type', 'voice')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (recentConversation) {
        // Redirect to most recent conversation
        router.replace(`/voice-coach/${recentConversation.id}`)
      } else {
        // No conversations yet - show start new UI
        setHasConversations(false)
        setLoading(false)
      }
    } catch (error) {
      console.error('Failed to check conversations:', error)
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

  // No conversations - show welcome screen
  return (
    <div className="flex h-full flex-col items-center justify-center p-8">
      <div className="max-w-md text-center">
        <div className="mb-6 flex h-24 w-24 mx-auto items-center justify-center rounded-full bg-gradient-to-br from-amber-600/20 to-amber-800/20 ring-2 ring-amber-500/30">
          <Mic className="h-12 w-12 text-amber-400" />
        </div>

        <h1 className="mb-3 text-2xl font-semibold text-silver">Voice Coach</h1>
        <p className="mb-8 text-silver-light">
          Have a real-time voice conversation with your AI coach.
          Just talk naturally - no typing needed.
        </p>

        <button
          onClick={() => router.push('/voice-coach/new')}
          className="btn btn-primary mx-auto"
        >
          <Plus className="h-4 w-4" />
          Start Your First Session
        </button>

        <div className="mt-8 text-sm text-silver-light">
          <p>Use headphones for best quality</p>
        </div>
      </div>
    </div>
  )
}
