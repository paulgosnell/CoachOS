import { createClient } from '@/lib/supabase/server'
import { generateSystemPrompt } from '@/lib/ai/prompts'
import { generateADHDCoachPrompt } from '@/lib/ai/prompts-adhd'
import { generateLifeCoachPrompt } from '@/lib/ai/prompts-life'
import { generateADHDLifeCoachPrompt } from '@/lib/ai/prompts-adhd-life'
import { normalizeCoachType, CoachType } from '@/lib/ai/coach-types'
import { assembleUserContextWithMemory } from '@/lib/ai/context'
import type { UserContext } from '@/lib/ai/context'

/**
 * Get the appropriate system prompt based on coach type
 */
function getSystemPromptForCoachType(coachType: CoachType, context: UserContext): string {
  switch (coachType) {
    case 'business':
      return generateSystemPrompt(context)
    case 'adhd-business':
      return generateADHDCoachPrompt(context)
    case 'life':
      return generateLifeCoachPrompt(context)
    case 'adhd-life':
      return generateADHDLifeCoachPrompt(context)
    default:
      return generateSystemPrompt(context)
  }
}

export async function POST(req: Request) {
  let step = 'init'
  try {
    // Verify authentication
    step = 'createClient'
    const supabase = await createClient()

    step = 'getUser'
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Check Gemini API key
    step = 'checkApiKey'
    const geminiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY
    if (!geminiKey) {
      return new Response(
        JSON.stringify({ error: 'Google AI API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Get profile with coach preference
    step = 'fetchProfile'
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, email, coach_preference')
      .eq('id', user.id)
      .maybeSingle()

    step = 'parseVoicePreference'
    const voicePreference = (profile?.coach_preference as Record<string, unknown>) || {}
    const coachType = normalizeCoachType(voicePreference.coach_type as string)

    // Build context with full memory - CRITICAL for coaching continuity
    // This includes all previous session summaries, breakthroughs, patterns, and milestones
    // The coach must NEVER forget what was discussed in previous sessions
    step = 'buildContextWithMemory'
    const context = await assembleUserContextWithMemory(user.id)

    // Override profile name if we have it from the direct query (more reliable)
    if (profile?.full_name) {
      context.profile.fullName = profile.full_name
    }
    if (profile?.email) {
      context.profile.email = profile.email
    }

    // Generate system prompt based on coach type
    step = 'generatePrompt'
    const systemPrompt = getSystemPromptForCoachType(coachType, context)

    step = 'extractFirstName'
    const firstName = (context.profile.fullName || 'User').split(' ')[0]

    // Return the configuration
    step = 'returnResponse'
    return new Response(
      JSON.stringify({
        systemPrompt,
        firstName,
        coachType,
        voiceSettings: {
          geminiVoice: (voicePreference.gemini_voice as string) || 'Puck',
          speed: (voicePreference.voice_speed as number) || 1.0,
          vadThreshold: (voicePreference.vad_threshold as number) || 0.5,
          vadSilenceDuration: (voicePreference.vad_silence_duration as number) || 500,
        },
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error: unknown) {
    const err = error as Error
    console.error(`Voice conversation error at step "${step}":`, err)
    return new Response(
      JSON.stringify({
        error: err.message || 'Internal server error',
        step,
        stack: err.stack
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
