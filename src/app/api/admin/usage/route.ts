import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/admin'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    // Require admin access
    await requireAdmin()

    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')

    // Calculate date range
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get overall usage stats
    const { data: overallStats } = await supabase
      .from('token_usage')
      .select('*')
      .gte('created_at', startDate.toISOString())

    if (!overallStats) {
      return NextResponse.json({
        totalCost: 0,
        totalTokens: 0,
        chatStats: {},
        voiceStats: {},
        byDate: [],
        byUser: [],
        recentConversations: [],
      })
    }

    // Calculate overall metrics
    const totalCost = overallStats.reduce((sum, row) => sum + parseFloat(row.total_cost || 0), 0)
    const totalTokens = overallStats.reduce((sum, row) => sum + (row.total_tokens || 0), 0)

    // Split by session type
    const chatUsage = overallStats.filter((r) => r.session_type === 'chat')
    const voiceUsage = overallStats.filter((r) => r.session_type === 'voice')

    const chatStats = {
      totalCost: chatUsage.reduce((sum, row) => sum + parseFloat(row.total_cost || 0), 0),
      totalTokens: chatUsage.reduce((sum, row) => sum + (row.total_tokens || 0), 0),
      count: chatUsage.length,
    }

    const voiceStats = {
      totalCost: voiceUsage.reduce((sum, row) => sum + parseFloat(row.total_cost || 0), 0),
      totalTokens: voiceUsage.reduce((sum, row) => sum + (row.total_tokens || 0), 0),
      totalAudioTokens: voiceUsage.reduce(
        (sum, row) => sum + (row.input_audio_tokens || 0) + (row.output_audio_tokens || 0),
        0
      ),
      count: voiceUsage.length,
    }

    // Group by date
    const byDateMap = new Map<string, { date: string; cost: number; tokens: number }>()
    overallStats.forEach((row) => {
      const date = new Date(row.created_at).toISOString().split('T')[0]
      const existing = byDateMap.get(date) || { date, cost: 0, tokens: 0 }
      existing.cost += parseFloat(row.total_cost || 0)
      existing.tokens += row.total_tokens || 0
      byDateMap.set(date, existing)
    })
    const byDate = Array.from(byDateMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    )

    // Group by user
    const byUserMap = new Map<
      string,
      { userId: string; userName: string; cost: number; tokens: number; conversationSet: Set<string> }
    >()

    // Get user names
    const userIds = [...new Set(overallStats.map((r) => r.user_id))]
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name')
      .in('id', userIds)

    const userNameMap = new Map(profiles?.map((p) => [p.id, p.full_name]) || [])

    overallStats.forEach((row) => {
      const existing = byUserMap.get(row.user_id) || {
        userId: row.user_id,
        userName: userNameMap.get(row.user_id) || 'Unknown',
        cost: 0,
        tokens: 0,
        conversationSet: new Set<string>(),
      }
      existing.cost += parseFloat(row.total_cost || 0)
      existing.tokens += row.total_tokens || 0
      if (row.conversation_id) {
        existing.conversationSet.add(row.conversation_id)
      }
      byUserMap.set(row.user_id, existing)
    })

    const byUser = Array.from(byUserMap.values())
      .map((u) => ({
        userId: u.userId,
        userName: u.userName,
        cost: u.cost,
        tokens: u.tokens,
        conversations: u.conversationSet.size,
      }))
      .sort((a, b) => b.cost - a.cost)

    // Get most expensive recent conversations
    // Try to use RPC function, fall back to manual calculation if it doesn't exist
    let expensiveConversations: any[] = []

    try {
      const { data: rpcData } = await supabase.rpc('get_expensive_conversations', {
        p_days: days,
        p_limit: 10,
      })
      if (rpcData) {
        expensiveConversations = rpcData
      }
    } catch (err) {
      // Function doesn't exist, calculate manually
    }

    if (expensiveConversations.length === 0) {
      const conversationCosts = new Map<string, number>()
      overallStats.forEach((row) => {
        if (row.conversation_id) {
          const existing = conversationCosts.get(row.conversation_id) || 0
          conversationCosts.set(row.conversation_id, existing + parseFloat(row.total_cost || 0))
        }
      })

      const topConversationIds = Array.from(conversationCosts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map((e) => e[0])

      if (topConversationIds.length > 0) {
        const { data: conversations } = await supabase
          .from('conversations')
          .select('id, title, session_type, started_at, user_id')
          .in('id', topConversationIds)

        expensiveConversations = (conversations || []).map((c) => ({
          conversation_id: c.id,
          title: c.title,
          session_type: c.session_type,
          started_at: c.started_at,
          user_name: userNameMap.get(c.user_id) || 'Unknown',
          total_cost: conversationCosts.get(c.id) || 0,
        }))
      }
    }

    return NextResponse.json({
      totalCost,
      totalTokens,
      chatStats,
      voiceStats,
      byDate,
      byUser,
      recentConversations: expensiveConversations,
    })
  } catch (error: any) {
    console.error('Usage analytics error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
