import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SubscribeClient from './SubscribeClient'

export default async function SubscribePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile with subscription status
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status, subscription_expires_at, full_name')
    .eq('id', user.id)
    .single()

  return (
    <SubscribeClient
      subscriptionStatus={profile?.subscription_status || 'free'}
      expiresAt={profile?.subscription_expires_at}
      userName={profile?.full_name || 'there'}
    />
  )
}
