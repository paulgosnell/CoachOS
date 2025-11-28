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

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Assemble full user context (profile, goals, business, RAG memories)
    const context = await assembleUserContext(
      user.id,
      '', // No current message for initial setup
      5 // memoryLimit
    )

    // Generate the Coach OS system prompt with full context
    const systemPrompt = generateSystemPrompt(context)
    const firstName = context.profile.fullName.split(' ')[0]

    // Get voice preferences from profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('coach_preference')
      .eq('id', user.id)
      .single()

    const voicePreference = profile?.coach_preference || {}

    // Return the configuration for OpenAI Realtime API
    return new Response(
      JSON.stringify({
        systemPrompt,
        firstName,
        voiceSettings: {
          voice: voicePreference.voice || 'verse',
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
