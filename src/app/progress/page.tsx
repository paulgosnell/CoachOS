import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CoachingGrowthChart } from '@/components/dashboard/CoachingGrowthChart'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Progress | Coach OS',
  description: 'Track your coaching progress and growth',
}

export default async function ProgressPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen p-3 md:p-6">
      <div className="mx-auto max-w-6xl">
        {/* Compact Header with back button */}
        <div className="mb-4 flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-titanium-900/50 transition-colors hover:bg-white/5"
          >
            <ArrowLeft className="h-4 w-4 text-silver-light" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-medium text-silver-light md:text-3xl">
              Your Progress
            </h1>
          </div>
        </div>

        {/* Full Data Viz */}
        <CoachingGrowthChart fullPage />
      </div>
    </div>
  )
}
