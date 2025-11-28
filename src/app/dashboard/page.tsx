import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardClient } from '@/components/dashboard/DashboardClient'

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

  const isPro = profile?.subscription_status === 'pro'

  return (
    <DashboardClient
      profile={{ full_name: profile.full_name }}
      goalsCount={goalsCount}
      conversationsCount={conversationsCount}
      isPro={isPro}
    />
  )
}
