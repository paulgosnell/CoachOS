import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

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

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto">
        <h1 className="mb-4 text-3xl font-bold">Dashboard</h1>
        <p className="text-silver-light">
          Welcome back, {profile.full_name || 'there'}
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="card">
            <h3 className="mb-2 text-lg font-semibold">Quick Check-in</h3>
            <p className="text-sm text-silver-light">
              Start a conversation with your coach
            </p>
          </div>

          <div className="card">
            <h3 className="mb-2 text-lg font-semibold">Book Session</h3>
            <p className="text-sm text-silver-light">
              Schedule a structured coaching session
            </p>
          </div>

          <div className="card">
            <h3 className="mb-2 text-lg font-semibold">Your Goals</h3>
            <p className="text-sm text-silver-light">
              Track your progress and commitments
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
