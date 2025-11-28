import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MobileHeader } from '@/components/MobileHeader'
import { SettingsClient } from '@/components/settings/SettingsClient'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function SettingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, coach_preference')
    .eq('id', user.id)
    .single()

  // Get business profile
  const { data: businessProfile } = await supabase
    .from('business_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return (
    <div className="min-h-screen">
      <MobileHeader title="Settings" />

      <div className="p-4 md:p-6">
        <div className="container mx-auto max-w-4xl">
          {/* Desktop Header */}
          <div className="mb-8 hidden lg:block">
            <Link
              href="/dashboard"
              className="mb-4 inline-flex items-center gap-2 text-sm text-silver-light hover:text-silver"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <h1 className="mb-2 text-3xl font-bold">Settings</h1>
            <p className="text-silver-light">
              Manage your profile and preferences
            </p>
          </div>

          <SettingsClient
            profile={profile || { full_name: '', email: user.email || '' }}
            businessProfile={businessProfile}
          />
        </div>
      </div>
    </div>
  )
}
