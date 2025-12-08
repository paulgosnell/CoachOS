import { createClient } from '@/lib/supabase/server'
import { generateSystemPrompt } from '@/lib/ai/prompts'
import { generateADHDCoachPrompt } from '@/lib/ai/prompts-adhd'
import type { UserContext } from '@/lib/ai/context'

export async function POST(req: Request) {
  try {
    // Verify authentication
    const supabase = await createClient()
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
    const geminiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY
    if (!geminiKey) {
      return new Response(
        JSON.stringify({ error: 'Google AI API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Get profile with coach preference
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('full_name, email, coach_preference')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
    }

    const voicePreference = (profile?.coach_preference as Record<string, unknown>) || {}
    const coachType = (voicePreference.coach_type as string) || 'standard'

    // Get business profile (may not exist)
    const { data: businessProfile } = await supabase
      .from('business_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    // Get active goals (may be empty)
    const { data: goals } = await supabase
      .from('goals')
      .select('title, description, category, priority, target_date, status')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('priority', { ascending: true })
      .limit(5)

    // Get pending action items (may be empty)
    const { data: actionItems } = await supabase
      .from('action_items')
      .select('task, description, priority, due_date, status, created_at')
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(10)

    // Build context directly (simpler, no conversation history needed for voice init)
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
    const systemPrompt = coachType === 'adhd'
      ? generateADHDCoachPrompt(context)
      : generateSystemPrompt(context)

    const firstName = (context.profile.fullName || 'User').split(' ')[0]

    // Return the configuration
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
  } catch (error: any) {
    console.error('Voice conversation configuration error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error', stack: error.stack }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
