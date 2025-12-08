import { createClient } from '@/lib/supabase/server'
import { generateSystemPrompt } from '@/lib/ai/prompts'
import { generateADHDCoachPrompt } from '@/lib/ai/prompts-adhd'
import type { UserContext } from '@/lib/ai/context'

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
    const coachType = (voicePreference.coach_type as string) || 'standard'

    // Get business profile (may not exist)
    step = 'fetchBusinessProfile'
    const { data: businessProfile } = await supabase
      .from('business_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    // Get active goals (may be empty)
    step = 'fetchGoals'
    const { data: goals } = await supabase
      .from('goals')
      .select('title, description, category, priority, target_date, status')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('priority', { ascending: true })
      .limit(5)

    // Get pending action items (may be empty)
    step = 'fetchActionItems'
    const { data: actionItems } = await supabase
      .from('action_items')
      .select('task, description, priority, due_date, status, created_at')
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(10)

    // Build context directly (simpler, no conversation history needed for voice init)
    step = 'buildContext'
    const context: UserContext = {
      profile: {
        fullName: profile?.full_name || 'User',
        email: profile?.email || '',
      },
      business: {
        industry: businessProfile?.industry || undefined,
        companyStage: businessProfile?.company_stage || undefined,
        role: businessProfile?.role || undefined,
        companyName: businessProfile?.company_name || undefined,
        teamSize: businessProfile?.team_size?.toString() || undefined,
        location: businessProfile?.location || undefined,
        revenueRange: businessProfile?.revenue_range || undefined,
        markets: businessProfile?.markets || undefined,
        keyChallenges: businessProfile?.key_challenges || undefined,
        reportsTo: businessProfile?.reports_to || undefined,
        directReports: businessProfile?.direct_reports || undefined,
      },
      goals: (goals || []).map((g) => ({
        title: g.title,
        description: g.description || undefined,
        category: g.category || undefined,
        priority: g.priority,
        targetDate: g.target_date || undefined,
        status: g.status,
      })),
      actionItems: (actionItems || []).map((a) => ({
        task: a.task,
        description: a.description || undefined,
        priority: (a.priority as 'low' | 'medium' | 'high') || 'medium',
        dueDate: a.due_date || undefined,
        status: a.status,
        createdAt: new Date(a.created_at),
      })),
      recentHistory: [],
    }

    // Generate system prompt based on coach type
    step = 'generatePrompt'
    const systemPrompt = coachType === 'adhd'
      ? generateADHDCoachPrompt(context)
      : generateSystemPrompt(context)

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
