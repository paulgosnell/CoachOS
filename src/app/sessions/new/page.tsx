import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { MobileHeader } from '@/components/MobileHeader'
import { SessionBooking } from '@/components/sessions/SessionBooking'

export default async function NewSessionPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen">
      <MobileHeader title="Book Session" />

      <div className="p-4 md:p-6">
        <div className="container mx-auto max-w-3xl">
          {/* Desktop Header */}
          <div className="mb-8 hidden lg:block">
            <Link
              href="/sessions"
              className="mb-4 inline-flex items-center gap-2 text-sm text-silver-light hover:text-silver"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Sessions
            </Link>
          </div>

          <SessionBooking />
        </div>
      </div>
    </div>
  )
}
