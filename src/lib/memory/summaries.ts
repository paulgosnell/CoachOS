import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface WeeklySummary {
  id: string
  user_id: string
  week_start: string
  week_end: string
  summary: string
  progress_notes: string | null
  goals_progress: any[]
  key_decisions: string[]
  challenges_faced: string[]
  wins: string[]
  created_at: string
}

export interface MonthlySummary {
  id: string
  user_id: string
  month_start: string
  month_end: string
  summary: string
  goals_progress: any[]
  milestones_achieved: string[]
  recurring_themes: string[]
  behavioral_patterns: string[]
  growth_areas: string[]
  sessions_count: number
  breakthroughs_count: number
  decisions_count: number
  focus_areas_next_month: string[]
  coach_observations: string | null
  generated_at: string
}

/**
 * Generates a weekly summary from conversation summaries
 * Synthesizes insights across all sessions in the week
 */
export async function generateWeeklySummary(
  userId: string,
  weekStartDate: Date
): Promise<WeeklySummary | null> {
  const supabase = await createClient()

  // Get week end date
  const weekEndDate = new Date(weekStartDate)
  weekEndDate.setDate(weekEndDate.getDate() + 6)

  // Fetch conversation summaries for the week
  const { data: conversationSummaries } = await supabase
    .from('conversation_summaries')
    .select('*')
    .eq('user_id', userId)
    .gte('generated_at', weekStartDate.toISOString())
    .lte('generated_at', weekEndDate.toISOString())
    .order('generated_at', { ascending: true })

  if (!conversationSummaries || conversationSummaries.length === 0) {
    return null
  }

  // Fetch user goals for context
  const { data: goals } = await supabase
    .from('goals')
    .select('title, description, category, priority')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('priority', { ascending: true })
    .limit(5)

  // Build context from conversation summaries
  const sessionsText = conversationSummaries
    .map((s, i) => `
Session ${i + 1}:
Summary: ${s.summary}
Topics: ${s.key_topics?.join(', ') || 'None'}
Decisions: ${s.decisions_made?.join(', ') || 'None'}
Breakthroughs: ${s.breakthroughs?.join(', ') || 'None'}
Blockers: ${s.blockers_identified?.join(', ') || 'None'}
User State: ${s.user_state || 'Unknown'}
`)
    .join('\n---\n')

  const goalsText = goals?.map((g) => `- ${g.title}: ${g.description || ''}`).join('\n') || 'None'

  // Collect all decisions and breakthroughs
  const allDecisions = conversationSummaries.flatMap(s => s.decisions_made || [])
  const allBreakthroughs = conversationSummaries.flatMap(s => s.breakthroughs || [])
  const allBlockers = conversationSummaries.flatMap(s => s.blockers_identified || [])

  // Generate weekly summary using GPT
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are synthesizing a week's worth of executive coaching sessions. Analyze patterns, progress toward goals, and provide strategic recommendations.

Your response must be valid JSON with this exact structure:
{
  "summary": "3-4 sentence overview of the week - what was accomplished, key themes, overall trajectory",
  "progressOnGoals": ["specific progress update 1", "specific progress update 2"],
  "patterns": ["pattern observed 1", "pattern observed 2"],
  "wins": ["win 1", "win 2"],
  "challenges": ["challenge 1", "challenge 2"],
  "recommendations": ["recommendation 1", "recommendation 2"]
}

Be strategic and forward-looking. Focus on actionable insights.`,
      },
      {
        role: 'user',
        content: `Active Goals:\n${goalsText}\n\nThis Week's Coaching Sessions (${conversationSummaries.length} sessions):\n${sessionsText}`,
      },
    ],
    temperature: 0.3,
    response_format: { type: 'json_object' },
  })

  const result = JSON.parse(response.choices[0].message.content || '{}')

  // Store in database
  const { data: summary, error } = await supabase
    .from('weekly_summaries')
    .upsert({
      user_id: userId,
      week_start: weekStartDate.toISOString().split('T')[0],
      week_end: weekEndDate.toISOString().split('T')[0],
      summary: result.summary || 'No summary generated',
      progress_notes: result.recommendations?.join('\n') || null,
      goals_progress: (result.progressOnGoals || []).map((p: string) => ({ note: p })),
      key_decisions: allDecisions,
      challenges_faced: result.challenges || allBlockers,
      wins: result.wins || allBreakthroughs,
    }, {
      onConflict: 'user_id,week_start'
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to store weekly summary:', error)
    return null
  }

  return summary
}

/**
 * Generates a monthly summary from weekly summaries
 * Provides high-level patterns and progress tracking
 */
export async function generateMonthlySummary(
  userId: string,
  monthStartDate: Date
): Promise<MonthlySummary | null> {
  const supabase = await createClient()

  // Get month end date
  const monthEndDate = new Date(monthStartDate)
  monthEndDate.setMonth(monthEndDate.getMonth() + 1)
  monthEndDate.setDate(0) // Last day of the month

  // Fetch weekly summaries for the month
  const { data: weeklySummaries } = await supabase
    .from('weekly_summaries')
    .select('*')
    .eq('user_id', userId)
    .gte('week_start', monthStartDate.toISOString().split('T')[0])
    .lte('week_start', monthEndDate.toISOString().split('T')[0])
    .order('week_start', { ascending: true })

  // Also fetch conversation summaries for stats
  const { data: conversationSummaries } = await supabase
    .from('conversation_summaries')
    .select('breakthroughs, decisions_made')
    .eq('user_id', userId)
    .gte('generated_at', monthStartDate.toISOString())
    .lte('generated_at', monthEndDate.toISOString())

  if (!weeklySummaries || weeklySummaries.length === 0) {
    return null
  }

  // Fetch user goals for context
  const { data: goals } = await supabase
    .from('goals')
    .select('title, description, status')
    .eq('user_id', userId)
    .order('priority', { ascending: true })
    .limit(10)

  // Calculate stats
  const sessionsCount = conversationSummaries?.length || 0
  const breakthroughsCount = conversationSummaries?.reduce(
    (acc, s) => acc + (s.breakthroughs?.length || 0), 0
  ) || 0
  const decisionsCount = conversationSummaries?.reduce(
    (acc, s) => acc + (s.decisions_made?.length || 0), 0
  ) || 0

  // Build context from weekly summaries
  const weeksText = weeklySummaries
    .map((w, i) => `
Week ${i + 1} (${w.week_start} to ${w.week_end}):
Summary: ${w.summary}
Wins: ${w.wins?.join(', ') || 'None'}
Challenges: ${w.challenges_faced?.join(', ') || 'None'}
Key Decisions: ${w.key_decisions?.join(', ') || 'None'}
Progress: ${w.goals_progress?.map((g: any) => g.note).join(', ') || 'None'}
`)
    .join('\n---\n')

  const goalsText = goals?.map((g) => `- ${g.title} (${g.status}): ${g.description || ''}`).join('\n') || 'None'

  // Generate monthly summary using GPT
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are creating a monthly coaching summary for an executive. Synthesize the month's progress, identify long-term patterns, and provide strategic guidance for the coming month.

Your response must be valid JSON with this exact structure:
{
  "summary": "4-5 sentence executive summary of the month - key accomplishments, overall trajectory, state of mind",
  "goalsProgress": ["specific progress on goal 1", "specific progress on goal 2"],
  "milestonesAchieved": ["milestone 1", "milestone 2"],
  "recurringThemes": ["theme that appeared multiple times"],
  "behavioralPatterns": ["pattern in how they work/think", "another pattern"],
  "growthAreas": ["area where growth was observed"],
  "focusAreasNextMonth": ["what to focus on next month", "another focus area"],
  "coachObservations": "1-2 sentences of high-level coaching observations - things the user might not see about themselves"
}

Be insightful and strategic. Focus on patterns that span weeks, not individual incidents.`,
      },
      {
        role: 'user',
        content: `Goals:\n${goalsText}\n\nMonth Stats: ${sessionsCount} sessions, ${breakthroughsCount} breakthroughs, ${decisionsCount} decisions made\n\nWeekly Summaries:\n${weeksText}`,
      },
    ],
    temperature: 0.3,
    response_format: { type: 'json_object' },
  })

  const result = JSON.parse(response.choices[0].message.content || '{}')

  // Store in database
  const { data: summary, error } = await supabase
    .from('monthly_summaries')
    .upsert({
      user_id: userId,
      month_start: monthStartDate.toISOString().split('T')[0],
      month_end: monthEndDate.toISOString().split('T')[0],
      summary: result.summary || 'No summary generated',
      goals_progress: (result.goalsProgress || []).map((p: string) => ({ note: p })),
      milestones_achieved: result.milestonesAchieved || [],
      recurring_themes: result.recurringThemes || [],
      behavioral_patterns: result.behavioralPatterns || [],
      growth_areas: result.growthAreas || [],
      sessions_count: sessionsCount,
      breakthroughs_count: breakthroughsCount,
      decisions_count: decisionsCount,
      focus_areas_next_month: result.focusAreasNextMonth || [],
      coach_observations: result.coachObservations || null,
      generated_at: new Date().toISOString(),
      model_used: 'gpt-4o-mini',
    }, {
      onConflict: 'user_id,month_start'
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to store monthly summary:', error)
    return null
  }

  return summary
}

/**
 * Retrieves recent summaries for context
 */
export async function getRecentSummaries(userId: string, weeks: number = 4): Promise<{
  weeklySummaries: WeeklySummary[]
  monthlySummaries: MonthlySummary[]
}> {
  const supabase = await createClient()

  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - (weeks * 7))

  const [weeklyResult, monthlyResult] = await Promise.all([
    supabase
      .from('weekly_summaries')
      .select('*')
      .eq('user_id', userId)
      .gte('week_start', cutoffDate.toISOString().split('T')[0])
      .order('week_start', { ascending: false }),

    supabase
      .from('monthly_summaries')
      .select('*')
      .eq('user_id', userId)
      .order('month_start', { ascending: false })
      .limit(3), // Last 3 months
  ])

  return {
    weeklySummaries: weeklyResult.data || [],
    monthlySummaries: monthlyResult.data || [],
  }
}

/**
 * Gets the most recent monthly summary for a user
 */
export async function getLatestMonthlySummary(userId: string): Promise<MonthlySummary | null> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('monthly_summaries')
    .select('*')
    .eq('user_id', userId)
    .order('month_start', { ascending: false })
    .limit(1)
    .single()

  return data
}
