import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { MessageSquare, Calendar, Target, ArrowRight } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile?.onboarding_completed) {
    redirect('/onboarding')
  }

  // Get active goals count
  const { count: goalsCount } = await supabase
    .from('goals')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'active')

  // Get recent conversations count
  const { count: conversationsCount } = await supabase
    .from('conversations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto">
        <h1 className="mb-4 text-3xl font-bold">Dashboard</h1>
        <p className="text-silver-light">
          Welcome back, {profile.full_name || 'there'}
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/chat/new"
            className="card group cursor-pointer transition-all hover:border-silver/30 hover:shadow-lg"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-deep-blue-800 to-silver-darker">
              <MessageSquare className="h-6 w-6 text-silver" />
            </div>
            <h3 className="mb-2 flex items-center justify-between text-lg font-semibold">
              Quick Check-in
              <ArrowRight className="h-5 w-5 opacity-0 transition-opacity group-hover:opacity-100" />
            </h3>
            <p className="text-sm text-silver-light">
              Start a conversation with your coach
            </p>
            {conversationsCount !== null && conversationsCount > 0 && (
              <p className="mt-3 text-xs text-gray-500">
                {conversationsCount} conversation{conversationsCount !== 1 ? 's' : ''} total
              </p>
            )}
          </Link>

          <Link
            href="/sessions"
            className="card group cursor-pointer transition-all hover:border-silver/30 hover:shadow-lg"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-deep-blue-800 to-silver-darker">
              <Calendar className="h-6 w-6 text-silver" />
            </div>
            <h3 className="mb-2 flex items-center justify-between text-lg font-semibold">
              Book Session
              <ArrowRight className="h-5 w-5 opacity-0 transition-opacity group-hover:opacity-100" />
            </h3>
            <p className="text-sm text-silver-light">
              Schedule a structured coaching session
            </p>
            <p className="mt-3 text-xs text-gray-500">Coming soon</p>
          </Link>

          <Link
            href="/goals"
            className="card group cursor-pointer transition-all hover:border-silver/30 hover:shadow-lg"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-deep-blue-800 to-silver-darker">
              <Target className="h-6 w-6 text-silver" />
            </div>
            <h3 className="mb-2 flex items-center justify-between text-lg font-semibold">
              Your Goals
              <ArrowRight className="h-5 w-5 opacity-0 transition-opacity group-hover:opacity-100" />
            </h3>
            <p className="text-sm text-silver-light">
              Track your progress and commitments
            </p>
            {goalsCount !== null && (
              <p className="mt-3 text-xs text-gray-500">
                {goalsCount} active goal{goalsCount !== 1 ? 's' : ''}
              </p>
            )}
          </Link>
        </div>
      </div>
    </div>
  )
}
