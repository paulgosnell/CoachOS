import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * Generates a daily summary of conversations
 * Synthesizes key themes, decisions, wins, and challenges
 */
export async function generateDailySummary(
  userId: string,
  date: Date
): Promise<{
  summary: string
  keyThemes: string[]
  decisions: string[]
  wins: string[]
  challenges: string[]
} | null> {
  const supabase = await createClient()

  // Get all messages from this day
  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  const { data: messages } = await supabase
    .from('messages')
    .select(
      `
      id,
      content,
      role,
      created_at,
      conversations!inner(user_id)
    `
    )
    .eq('conversations.user_id', userId)
    .gte('created_at', startOfDay.toISOString())
    .lte('created_at', endOfDay.toISOString())
    .order('created_at', { ascending: true })

  if (!messages || messages.length === 0) {
    return null
  }

  // Build conversation transcript
  const transcript = messages
    .map((m) => `${m.role === 'user' ? 'User' : 'Coach'}: ${m.content}`)
    .join('\n\n')

  // Generate summary using GPT
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini', // Use mini for summaries to save cost
    messages: [
      {
        role: 'system',
        content: `You are analyzing a day's worth of executive coaching conversations. Extract key insights, themes, decisions, wins, and challenges.

Your response must be valid JSON with this exact structure:
{
  "summary": "2-3 sentence overview of the day",
  "keyThemes": ["theme1", "theme2", "theme3"],
  "decisions": ["decision1", "decision2"],
  "wins": ["win1", "win2"],
  "challenges": ["challenge1", "challenge2"]
}

Be specific and actionable. Focus on what matters for progress tracking.`,
      },
      {
        role: 'user',
        content: `Analyze this day's coaching conversations:\n\n${transcript}`,
      },
    ],
    temperature: 0.3,
    response_format: { type: 'json_object' },
  })

  const result = JSON.parse(response.choices[0].message.content || '{}')

  // Store in database (matching schema: date, summary, key_topics, sentiment, action_items, conversation_count)
  await supabase.from('daily_summaries').insert({
    user_id: userId,
    date: date.toISOString().split('T')[0],
    summary: result.summary,
    key_topics: result.keyThemes || [],
    sentiment: null, // Can be enhanced later
    action_items: [...(result.decisions || []), ...(result.wins || []), ...(result.challenges || [])].map(item => ({ text: item })),
    conversation_count: messages.length,
  })

  return result
}

/**
 * Generates a weekly summary from daily summaries
 * Provides higher-level insights and progress tracking
 */
export async function generateWeeklySummary(
  userId: string,
  weekStartDate: Date
): Promise<{
  summary: string
  progressOnGoals: string[]
  patterns: string[]
  recommendations: string[]
} | null> {
  const supabase = await createClient()

  // Get week end date
  const weekEndDate = new Date(weekStartDate)
  weekEndDate.setDate(weekEndDate.getDate() + 6)

  // Fetch daily summaries for the week
  const { data: dailySummaries } = await supabase
    .from('daily_summaries')
    .select('*')
    .eq('user_id', userId)
    .gte('summary_date', weekStartDate.toISOString().split('T')[0])
    .lte('summary_date', weekEndDate.toISOString().split('T')[0])
    .order('summary_date', { ascending: true })

  if (!dailySummaries || dailySummaries.length === 0) {
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

  // Build weekly context
  const dailySummariesText = dailySummaries
    .map(
      (d) => `
Day: ${d.date}
Summary: ${d.summary}
Themes: ${d.key_topics?.join(', ') || 'None'}
Action Items: ${Array.isArray(d.action_items) ? d.action_items.map((a: any) => a.text || a).join(', ') : 'None'}
`
    )
    .join('\n---\n')

  const goalsText = goals?.map((g) => `- ${g.title}: ${g.description || ''}`).join('\n') || 'None'

  // Generate weekly summary using GPT
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are synthesizing a week's worth of executive coaching insights. Analyze patterns, progress toward goals, and provide strategic recommendations.

Your response must be valid JSON with this exact structure:
{
  "summary": "3-4 sentence overview of the week",
  "progressOnGoals": ["progress update 1", "progress update 2"],
  "patterns": ["pattern 1", "pattern 2", "pattern 3"],
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"]
}

Be strategic and forward-looking. Focus on actionable insights.`,
      },
      {
        role: 'user',
        content: `Active Goals:\n${goalsText}\n\nDaily Summaries:\n${dailySummariesText}`,
      },
    ],
    temperature: 0.3,
    response_format: { type: 'json_object' },
  })

  const result = JSON.parse(response.choices[0].message.content || '{}')

  // Store in database (matching schema: week_start, week_end, summary, progress_notes, goals_progress, key_decisions, challenges_faced, wins)
  await supabase.from('weekly_summaries').insert({
    user_id: userId,
    week_start: weekStartDate.toISOString().split('T')[0],
    week_end: weekEndDate.toISOString().split('T')[0],
    summary: result.summary,
    progress_notes: result.recommendations?.join('\n') || null,
    goals_progress: (result.progressOnGoals || []).map((p: string) => ({ note: p })),
    key_decisions: [],
    challenges_faced: [],
    wins: [],
  })

  return result
}

/**
 * Retrieves recent summaries for context
 */
export async function getRecentSummaries(userId: string, days: number = 7): Promise<{
  dailySummaries: any[]
  weeklySummaries: any[]
}> {
  const supabase = await createClient()

  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)

  const [dailyResult, weeklyResult] = await Promise.all([
    supabase
      .from('daily_summaries')
      .select('*')
      .eq('user_id', userId)
      .gte('date', cutoffDate.toISOString().split('T')[0])
      .order('date', { ascending: false }),

    supabase
      .from('weekly_summaries')
      .select('*')
      .eq('user_id', userId)
      .gte('week_start', cutoffDate.toISOString().split('T')[0])
      .order('week_start', { ascending: false }),
  ])

  return {
    dailySummaries: dailyResult.data || [],
    weeklySummaries: weeklyResult.data || [],
  }
}
