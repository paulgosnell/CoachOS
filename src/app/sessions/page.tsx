import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { MobileHeader } from '@/components/MobileHeader'
import { SessionsList } from '@/components/sessions/SessionsList'

export default async function SessionsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen">
      <MobileHeader title="Coaching Sessions" />

      <div className="p-4 md:p-6">
        <div className="container mx-auto max-w-7xl">
          {/* Desktop Header */}
          <div className="mb-8 hidden lg:block">
            <Link
              href="/dashboard"
              className="mb-4 inline-flex items-center gap-2 text-sm text-silver-light hover:text-silver"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <h1 className="mb-2 text-3xl font-bold">Coaching Sessions</h1>
            <p className="text-silver-light">
              Schedule and manage your structured coaching sessions
            </p>
          </div>

          <Suspense fallback={<div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-deep-blue-600" /></div>}>
            <SessionsList />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
