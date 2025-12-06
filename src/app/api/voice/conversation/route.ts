import { createClient } from '@/lib/supabase/server'
import { assembleUserContext } from '@/lib/ai/context'
import { generateSystemPrompt } from '@/lib/ai/prompts'

export async function POST(req: Request) {
  try {
    // Verify authentication
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Check Gemini API key
    const geminiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY
    if (!geminiKey) {
      return new Response(
        JSON.stringify({ error: 'Google AI API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Get voice preferences from profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('coach_preference')
      .eq('id', user.id)
      .single()

    const voicePreference = profile?.coach_preference || {}

    // Assemble full user context (profile, goals, business, RAG memories)
    const context = await assembleUserContext(
      user.id,
      '', // No current message for initial setup
      5 // memoryLimit
    )

    // Generate system prompt
    const systemPrompt = generateSystemPrompt(context)

    const firstName = context.profile.fullName.split(' ')[0]

    // Return the configuration
    return new Response(
      JSON.stringify({
        systemPrompt,
        firstName,
        voiceSettings: {
          geminiVoice: voicePreference.gemini_voice || 'Puck',
          speed: voicePreference.voice_speed || 1.0,
          vadThreshold: voicePreference.vad_threshold || 0.5,
          vadSilenceDuration: voicePreference.vad_silence_duration || 500,
        },
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error: any) {
    console.error('Voice conversation configuration error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
