import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/admin'
import Link from 'next/link'
import { ArrowLeft, DollarSign, Zap, MessageSquare, Mic, TrendingUp } from 'lucide-react'

export default async function AdminUsagePage() {
  try {
    await requireAdmin()
  } catch {
    redirect('/dashboard')
  }

  // Fetch usage analytics
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/usage?days=30`,
    { cache: 'no-store' }
  )
  const data = await response.json()

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
            <div className="mb-1 text-3xl font-bold">{formatCost(data.totalCost)}</div>
            <div className="text-sm text-silver-light">Total Cost</div>
          </div>

          <div className="card">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Zap className="h-5 w-5 text-blue-500" />
              </div>
              <span className="text-sm text-silver-light">All Types</span>
            </div>
            <div className="mb-1 text-3xl font-bold">{formatNumber(data.totalTokens)}</div>
            <div className="text-sm text-silver-light">Total Tokens</div>
          </div>

          <div className="card">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                <MessageSquare className="h-5 w-5 text-purple-500" />
              </div>
              <span className="text-sm text-silver-light">Chat</span>
            </div>
            <div className="mb-1 text-2xl font-bold">{formatCost(data.chatStats.totalCost)}</div>
            <div className="text-sm text-silver-light">
              {formatNumber(data.chatStats.totalTokens)} tokens
            </div>
          </div>

          <div className="card">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                <Mic className="h-5 w-5 text-orange-500" />
              </div>
              <span className="text-sm text-silver-light">Voice</span>
            </div>
            <div className="mb-1 text-2xl font-bold">{formatCost(data.voiceStats.totalCost)}</div>
            <div className="text-sm text-silver-light">
              {formatNumber(data.voiceStats.totalTokens)} tokens
            </div>
          </div>
        </div>

        {/* Cost Trend */}
        <div className="card mb-8">
          <h2 className="mb-4 text-xl font-semibold">Daily Cost Trend</h2>
          <div className="overflow-x-auto">
            <div className="flex h-48 items-end gap-2">
              {data.byDate.map((day: any, i: number) => {
                const maxCost = Math.max(...data.byDate.map((d: any) => d.cost))
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

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Top Users */}
          <div className="card">
            <h2 className="mb-4 text-xl font-semibold">Usage by User</h2>
            <div className="space-y-3">
              {data.byUser.slice(0, 5).map((user: any, i: number) => (
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
          </div>

          {/* Most Expensive Conversations */}
          <div className="card">
            <h2 className="mb-4 text-xl font-semibold">Most Expensive Conversations</h2>
            <div className="space-y-3">
              {data.recentConversations.slice(0, 5).map((conv: any, i: number) => (
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
          </div>
        </div>
      </div>
    </div>
  )
}
