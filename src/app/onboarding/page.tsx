import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function OnboardingPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-2xl text-center">
        <h1 className="mb-4 text-4xl font-bold">Welcome to Coach OS</h1>
        <p className="mb-8 text-xl text-silver-light">
          Let's get to know your business
        </p>

        <div className="card-elevated">
          <p className="text-silver-light">
            Onboarding flow coming soon...
          </p>
          <p className="mt-4 text-sm text-gray-500">
            Phase 1 foundation is complete. Next: Build the onboarding interview.
          </p>
        </div>
      </div>
    </div>
  )
}
