import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/admin'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft, DollarSign, Zap, MessageSquare, Mic } from 'lucide-react'

export default async function AdminUsagePage() {
  try {
    await requireAdmin()
  } catch {
    redirect('/dashboard')
  }

  const supabase = await createClient()
  const days = 30

  // Calculate date range
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  // Get overall usage stats
  const { data: overallStats } = await supabase
    .from('token_usage')
    .select('*')
    .gte('created_at', startDate.toISOString())

  // Calculate metrics
  const totalCost = overallStats?.reduce((sum, row) => sum + parseFloat(row.total_cost || 0), 0) || 0
  const totalTokens = overallStats?.reduce((sum, row) => sum + (row.total_tokens || 0), 0) || 0

  const chatUsage = overallStats?.filter((r) => r.session_type === 'chat') || []
  const voiceUsage = overallStats?.filter((r) => r.session_type === 'voice') || []

  const chatStats = {
    totalCost: chatUsage.reduce((sum, row) => sum + parseFloat(row.total_cost || 0), 0),
    totalTokens: chatUsage.reduce((sum, row) => sum + (row.total_tokens || 0), 0),
    count: chatUsage.length,
  }

  const voiceStats = {
    totalCost: voiceUsage.reduce((sum, row) => sum + parseFloat(row.total_cost || 0), 0),
    totalTokens: voiceUsage.reduce((sum, row) => sum + (row.total_tokens || 0), 0),
    count: voiceUsage.length,
  }

  // Group by date
  const byDateMap = new Map<string, { date: string; cost: number; tokens: number }>()
  overallStats?.forEach((row) => {
    const date = new Date(row.created_at).toISOString().split('T')[0]
    const existing = byDateMap.get(date) || { date, cost: 0, tokens: 0 }
    existing.cost += parseFloat(row.total_cost || 0)
    existing.tokens += row.total_tokens || 0
    byDateMap.set(date, existing)
  })
  const byDate = Array.from(byDateMap.values()).sort((a, b) => a.date.localeCompare(b.date))

  // Group by user
  const userIds = [...new Set(overallStats?.map((r) => r.user_id) || [])]
  const { data: profiles } = await supabase.from('profiles').select('id, full_name').in('id', userIds)
  const userNameMap = new Map(profiles?.map((p) => [p.id, p.full_name]) || [])

  const byUserMap = new Map<string, { userId: string; userName: string; cost: number; tokens: number; conversationSet: Set<string> }>()
  overallStats?.forEach((row) => {
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

  // Get most expensive conversations
  const conversationCosts = new Map<string, number>()
  overallStats?.forEach((row) => {
    if (row.conversation_id) {
      const existing = conversationCosts.get(row.conversation_id) || 0
      conversationCosts.set(row.conversation_id, existing + parseFloat(row.total_cost || 0))
    }
  })

  const topConversationIds = Array.from(conversationCosts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map((e) => e[0])

  let expensiveConversations: any[] = []
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
    })).sort((a, b) => b.total_cost - a.total_cost)
  }

  const formatCost = (cost: number) => `$${cost.toFixed(4)}`
  const formatNumber = (num: number) => num.toLocaleString()
  const formatDate = (date: string) => new Date(date).toLocaleDateString()

  return (
    <div className="min-h-screen bg-titanium-950 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="mb-4 inline-flex items-center gap-2 text-sm text-silver-light hover:text-silver"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Admin
          </Link>
          <h1 className="mb-2 text-3xl font-bold">Usage & Costs</h1>
          <p className="text-silver-light">Monitor OpenAI API usage and costs (Last 30 days)</p>
        </div>

        {/* Top Stats */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <div className="card">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
              <span className="text-sm text-silver-light">30 Days</span>
            </div>
            <div className="mb-1 text-3xl font-bold">{formatCost(totalCost)}</div>
            <div className="text-sm text-silver-light">Total Cost</div>
          </div>

          <div className="card">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Zap className="h-5 w-5 text-blue-500" />
              </div>
              <span className="text-sm text-silver-light">All Types</span>
            </div>
            <div className="mb-1 text-3xl font-bold">{formatNumber(totalTokens)}</div>
            <div className="text-sm text-silver-light">Total Tokens</div>
          </div>

          <div className="card">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                <MessageSquare className="h-5 w-5 text-purple-500" />
              </div>
              <span className="text-sm text-silver-light">Chat</span>
            </div>
            <div className="mb-1 text-2xl font-bold">{formatCost(chatStats.totalCost)}</div>
            <div className="text-sm text-silver-light">
              {formatNumber(chatStats.totalTokens)} tokens
            </div>
          </div>

          <div className="card">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                <Mic className="h-5 w-5 text-orange-500" />
              </div>
              <span className="text-sm text-silver-light">Voice</span>
            </div>
            <div className="mb-1 text-2xl font-bold">{formatCost(voiceStats.totalCost)}</div>
            <div className="text-sm text-silver-light">
              {formatNumber(voiceStats.totalTokens)} tokens
            </div>
          </div>
        </div>

        {/* Cost Trend */}
        {byDate.length > 0 && (
          <div className="card mb-8">
            <h2 className="mb-4 text-xl font-semibold">Daily Cost Trend</h2>
            <div className="overflow-x-auto">
              <div className="flex h-48 items-end gap-2">
                {byDate.map((day, i) => {
                  const maxCost = Math.max(...byDate.map((d) => d.cost))
                  const height = maxCost > 0 ? (day.cost / maxCost) * 100 : 0

                  return (
                    <div key={i} className="group relative flex flex-1 flex-col items-center">
                      <div
                        className="w-full rounded-t bg-gradient-to-t from-blue-600 to-blue-400 transition-all hover:from-blue-500 hover:to-blue-300"
                        style={{ height: `${height}%` }}
                      />
                      <div className="mt-2 text-xs text-silver-light">
                        {new Date(day.date).getDate()}
                      </div>
                      <div className="absolute -top-12 hidden rounded bg-titanium-800 px-2 py-1 text-xs shadow-lg group-hover:block">
                        <div className="font-semibold">{formatDate(day.date)}</div>
                        <div className="text-silver-light">{formatCost(day.cost)}</div>
                        <div className="text-silver-light">{formatNumber(day.tokens)} tokens</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Top Users */}
          <div className="card">
            <h2 className="mb-4 text-xl font-semibold">Usage by User</h2>
            {byUser.length > 0 ? (
              <div className="space-y-3">
                {byUser.slice(0, 5).map((user, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-titanium-900/50 p-3">
                    <div>
                      <div className="font-medium">{user.userName}</div>
                      <div className="text-sm text-silver-light">
                        {user.conversations} conversations • {formatNumber(user.tokens)} tokens
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-400">{formatCost(user.cost)}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-silver-light">No usage data yet</p>
            )}
          </div>

          {/* Most Expensive Conversations */}
          <div className="card">
            <h2 className="mb-4 text-xl font-semibold">Most Expensive Conversations</h2>
            {expensiveConversations.length > 0 ? (
              <div className="space-y-3">
                {expensiveConversations.slice(0, 5).map((conv, i) => (
                  <div key={i} className="rounded-lg bg-titanium-900/50 p-3">
                    <div className="mb-1 flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium">{conv.title || 'Untitled'}</div>
                        <div className="text-sm text-silver-light">
                          {conv.user_name} • {conv.session_type}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-orange-400">{formatCost(conv.total_cost)}</div>
                      </div>
                    </div>
                    <div className="text-xs text-silver-light">{formatDate(conv.started_at)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-silver-light">No conversations yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
