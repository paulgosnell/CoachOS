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

    // Get profile with coach preference
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, email, coach_preference')
      .eq('id', user.id)
      .single()

    const voicePreference = profile?.coach_preference || {}
    const coachType = voicePreference.coach_type || 'standard'

    // Get business profile
    const { data: businessProfile } = await supabase
      .from('business_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // Get active goals
    const { data: goals } = await supabase
      .from('goals')
      .select('title, description, category, priority, target_date, status')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('priority', { ascending: true })
      .limit(5)

    // Get pending action items
    const { data: actionItems } = await supabase
      .from('action_items')
      .select('task, description, priority, due_date, status, created_at')
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .order('due_date', { ascending: true, nullsFirst: false })
      .order('priority', { ascending: false })
      .limit(10)

    // Build context directly (simpler, no conversation history needed for voice init)
    const context: UserContext = {
      profile: {
        fullName: profile?.full_name || 'User',
        email: profile?.email || '',
      },
      business: {
        industry: businessProfile?.industry,
        companyStage: businessProfile?.company_stage,
        role: businessProfile?.role,
        companyName: businessProfile?.company_name,
        teamSize: businessProfile?.team_size,
        location: businessProfile?.location,
        revenueRange: businessProfile?.revenue_range,
        markets: businessProfile?.markets,
        keyChallenges: businessProfile?.key_challenges,
        reportsTo: businessProfile?.reports_to,
        directReports: businessProfile?.direct_reports,
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
        priority: a.priority as 'low' | 'medium' | 'high',
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

    const firstName = context.profile.fullName.split(' ')[0]

    // Return the configuration
    return new Response(
      JSON.stringify({
        systemPrompt,
        firstName,
        coachType,
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
