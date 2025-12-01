import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get weekly session data for the last 8 weeks
    const { data: weeklyData, error: weeklyError } = await supabase.rpc(
      'get_weekly_progress',
      { p_user_id: user.id }
    )

    if (weeklyError) {
      console.error('Error fetching weekly progress:', weeklyError)
      // Fallback to direct query if RPC doesn't exist
      return await getProgressDirectQuery(supabase, user.id)
    }

    // Get overall stats
    const { data: stats, error: statsError } = await supabase.rpc(
      'get_progress_stats',
      { p_user_id: user.id }
    )

    if (statsError) {
      console.error('Error fetching progress stats:', statsError)
    }

    return NextResponse.json({
      weeklyData: weeklyData || [],
      stats: stats?.[0] || null,
    })
  } catch (error) {
    console.error('Error in GET /api/progress:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function getProgressDirectQuery(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
) {
  // Get weekly session counts for last 8 weeks
  const eightWeeksAgo = new Date()
  eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56)

  const { data: conversations, error: convError } = await supabase
    .from('conversations')
    .select('id, session_type, created_at')
    .eq('user_id', userId)
    .gte('created_at', eightWeeksAgo.toISOString())
    .order('created_at', { ascending: true })

  if (convError) {
    console.error('Error fetching conversations:', convError)
    return NextResponse.json(
      { error: 'Failed to fetch progress data' },
      { status: 500 }
    )
  }

  // Get message counts per conversation
  const { data: messages, error: msgError } = await supabase
    .from('messages')
    .select('conversation_id, role')
    .eq('user_id', userId)
    .gte('created_at', eightWeeksAgo.toISOString())

  if (msgError) {
    console.error('Error fetching messages:', msgError)
  }

  // Get total stats
  const { count: totalSessions } = await supabase
    .from('conversations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  const { count: totalGoals } = await supabase
    .from('goals')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  const { count: completedGoals } = await supabase
    .from('goals')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'completed')

  const { count: totalActions } = await supabase
    .from('action_items')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  const { count: completedActions } = await supabase
    .from('action_items')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'completed')

  // Aggregate by week
  const weeklyMap = new Map<
    string,
    {
      week: string
      weekStart: string
      sessions: number
      voiceSessions: number
      structuredSessions: number
      checkinSessions: number
      messageCount: number
    }
  >()

  // Initialize last 8 weeks
  for (let i = 7; i >= 0; i--) {
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - i * 7)
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()) // Start of week (Sunday)
    weekStart.setHours(0, 0, 0, 0)
    const weekKey = weekStart.toISOString().split('T')[0]
    weeklyMap.set(weekKey, {
      week: `Week ${8 - i}`,
      weekStart: weekKey,
      sessions: 0,
      voiceSessions: 0,
      structuredSessions: 0,
      checkinSessions: 0,
      messageCount: 0,
    })
  }

  // Count messages per conversation
  const msgCountMap = new Map<string, number>()
  messages?.forEach((msg) => {
    const count = msgCountMap.get(msg.conversation_id) || 0
    msgCountMap.set(msg.conversation_id, count + 1)
  })

  // Populate weekly data
  conversations?.forEach((conv) => {
    const convDate = new Date(conv.created_at)
    const weekStart = new Date(convDate)
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    weekStart.setHours(0, 0, 0, 0)
    const weekKey = weekStart.toISOString().split('T')[0]

    const weekData = weeklyMap.get(weekKey)
    if (weekData) {
      weekData.sessions++
      weekData.messageCount += msgCountMap.get(conv.id) || 0
      if (conv.session_type === 'voice') weekData.voiceSessions++
      else if (conv.session_type === 'structured')
        weekData.structuredSessions++
      else weekData.checkinSessions++
    }
  })

  const weeklyData = Array.from(weeklyMap.values())

  // Calculate engagement and growth scores based on activity
  const enrichedWeeklyData = weeklyData.map((week, index) => {
    // Base scores on activity levels
    const sessionScore = Math.min(week.sessions * 15, 40) // Up to 40 points for sessions
    const messageScore = Math.min(week.messageCount * 2, 30) // Up to 30 points for engagement
    const voiceBonus = week.voiceSessions * 10 // Bonus for voice sessions
    const structuredBonus = week.structuredSessions * 8 // Bonus for structured sessions

    // Calculate cumulative growth (sessions build on each other)
    const cumulativeSessions = weeklyData
      .slice(0, index + 1)
      .reduce((sum, w) => sum + w.sessions, 0)
    const growthBase = Math.min(cumulativeSessions * 5, 50)

    return {
      ...week,
      // Growth: combination of cumulative activity
      growth: Math.min(
        20 + growthBase + (index * 5), // Base growth trajectory
        100
      ),
      // Clarity: based on structured sessions and message depth
      clarity: Math.min(
        15 + sessionScore + structuredBonus + (index * 4),
        100
      ),
      // Confidence: based on overall engagement and voice sessions
      confidence: Math.min(
        25 + messageScore + voiceBonus + (index * 3),
        100
      ),
    }
  })

  return NextResponse.json({
    weeklyData: enrichedWeeklyData,
    stats: {
      totalSessions: totalSessions || 0,
      totalGoals: totalGoals || 0,
      completedGoals: completedGoals || 0,
      totalActions: totalActions || 0,
      completedActions: completedActions || 0,
    },
  })
}
