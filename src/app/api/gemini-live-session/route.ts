import { createClient } from '@/lib/supabase/server'
import { mintGeminiLiveWsUrl } from '@/lib/ai/gemini-live-token'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Gemini 2.5 Flash with native audio support
    const model = 'gemini-2.5-flash-native-audio-preview-09-2025'

    // Single-use ephemeral token; the API key never reaches the browser.
    const wsUrl = await mintGeminiLiveWsUrl()

    return NextResponse.json({ wsUrl, model })
  } catch (error) {
    console.error('Gemini Live session error:', error)
    return NextResponse.json({ error: 'Failed to start voice session' }, { status: 500 })
  }
}
