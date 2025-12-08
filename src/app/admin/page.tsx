import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/admin'
import Link from 'next/link'
import { Users, MessageSquare, MessageCircle, TrendingUp, Activity, DollarSign, CreditCard } from 'lucide-react'

export default async function AdminDashboard() {
  try {
    await requireAdmin()
  } catch {
    redirect('/dashboard')
  }

  const supabase = await createClient()

  // Get basic stats
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('is_admin', false)

  const { count: totalConversations } = await supabase
    .from('conversations')
    .select('*', { count: 'exact', head: true })

  const { count: totalMessages } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })

  const { count: totalFeedback } = await supabase
    .from('feedback')
    .select('*', { count: 'exact', head: true })

  const { count: newFeedback } = await supabase
    .from('feedback')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'new')

  // Get recent activity (last 7 days)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  // Get distinct active users in last 7 days
  const { data: recentConversations } = await supabase
    .from('conversations')
    .select('user_id')
    .gte('started_at', sevenDaysAgo.toISOString())

  const activeUsersWeek = new Set(recentConversations?.map(c => c.user_id) || []).size

  const { count: conversationsWeek } = await supabase
    .from('conversations')
    .select('*', { count: 'exact', head: true })
    .gte('started_at', sevenDaysAgo.toISOString())

  return (
    <div className="min-h-screen bg-titanium-950 p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-silver-light">Monitor Coach OS performance and user activity</p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="card">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <span className="text-sm text-silver-light">Total</span>
            </div>
            <div className="mb-1 text-3xl font-bold">{totalUsers || 0}</div>
            <div className="text-sm text-silver-light">Users</div>
          </div>

          <div className="card">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <MessageSquare className="h-5 w-5 text-green-500" />
              </div>
              <span className="text-sm text-silver-light">All Time</span>
            </div>
            <div className="mb-1 text-3xl font-bold">{totalConversations || 0}</div>
            <div className="text-sm text-silver-light">Conversations</div>
          </div>

          <div className="card">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                <MessageCircle className="h-5 w-5 text-purple-500" />
              </div>
              <span className="text-sm text-silver-light">All Time</span>
            </div>
            <div className="mb-1 text-3xl font-bold">{totalMessages || 0}</div>
            <div className="text-sm text-silver-light">Messages</div>
          </div>

          <div className="card">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                <Activity className="h-5 w-5 text-orange-500" />
              </div>
              <span className="text-sm text-silver-light">Pending</span>
            </div>
            <div className="mb-1 text-3xl font-bold">
              {newFeedback || 0}/{totalFeedback || 0}
            </div>
            <div className="text-sm text-silver-light">Feedback</div>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="card mb-8">
          <h2 className="mb-4 text-xl font-semibold">Last 7 Days</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-4 rounded-lg bg-titanium-900/50 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{activeUsersWeek || 0}</div>
                <div className="text-sm text-silver-light">Active Users</div>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-lg bg-titanium-900/50 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                <MessageSquare className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{conversationsWeek || 0}</div>
                <div className="text-sm text-silver-light">New Conversations</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/admin/users"
            className="card group cursor-pointer transition-all hover:border-silver/30 hover:shadow-lg"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-800">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Manage Users</h3>
            <p className="text-sm text-silver-light">
              View all users, their activity, and engagement metrics
            </p>
          </Link>

          <Link
            href="/admin/sessions"
            className="card group cursor-pointer transition-all hover:border-silver/30 hover:shadow-lg"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-600 to-green-800">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">View Sessions</h3>
            <p className="text-sm text-silver-light">
              Analyze coaching sessions, frameworks used, and success metrics
            </p>
          </Link>

          <Link
            href="/admin/usage"
            className="card group cursor-pointer transition-all hover:border-silver/30 hover:shadow-lg"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Usage & Costs</h3>
            <p className="text-sm text-silver-light">
              Monitor API usage, token consumption, and operational costs
            </p>
          </Link>

          <Link
            href="/admin/payments"
            className="card group cursor-pointer transition-all hover:border-silver/30 hover:shadow-lg"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-purple-800">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Payments</h3>
            <p className="text-sm text-silver-light">
              Configure Revolut webhooks and manage payment settings
            </p>
          </Link>

          <Link
            href="/admin/feedback"
            className="card group cursor-pointer transition-all hover:border-silver/30 hover:shadow-lg"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-600 to-orange-800">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Review Feedback</h3>
            <p className="text-sm text-silver-light">
              View and respond to user feedback, bugs, and feature requests
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}
