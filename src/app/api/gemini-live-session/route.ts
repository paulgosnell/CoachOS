import { createClient } from '@/lib/supabase/server'
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

    const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY

    console.log('GOOGLE_AI_API_KEY exists:', !!process.env.GOOGLE_AI_API_KEY)
    console.log('GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY)
    console.log('API Key length:', apiKey?.length)
    console.log('API Key prefix:', apiKey?.substring(0, 10))

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google AI API key not configured' },
        { status: 500 }
      )
    }

    // Gemini 2.5 Flash with native audio support
    const model = 'gemini-2.5-flash-native-audio-preview-09-2025'

    // WebSocket URL for Gemini Live API
    const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${apiKey}`

    console.log('WebSocket URL (without key):', wsUrl.replace(apiKey, '***'))

    return NextResponse.json({ wsUrl, model })
  } catch (error: any) {
    console.error('Gemini Live session error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
