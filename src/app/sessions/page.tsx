import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Calendar, ArrowLeft, Clock, Target } from 'lucide-react'

export default async function SessionsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
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

        {/* Coming Soon Card */}
        <div className="card text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-deep-blue-800 to-silver-darker">
            <Calendar className="h-10 w-10 text-silver" />
          </div>

          <h2 className="mb-3 text-2xl font-bold">Coming Soon</h2>
          <p className="mb-6 text-silver-light">
            Structured coaching sessions with frameworks like GROW, CLEAR, and
            OSKAR are coming soon. You'll be able to schedule 45-minute deep-dive
            sessions focused on specific goals.
          </p>

          <div className="mx-auto mb-8 max-w-2xl rounded-2xl border border-white/5 bg-titanium-900/50 p-6 text-left">
            <h3 className="mb-4 font-semibold">What's Coming:</h3>
            <ul className="space-y-3 text-sm text-silver-light">
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-deep-blue-600" />
                <span>
                  Schedule recurring or one-time sessions at your convenience
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Target className="mt-0.5 h-4 w-4 flex-shrink-0 text-deep-blue-600" />
                <span>
                  Use proven coaching frameworks (GROW, CLEAR, OSKAR) for
                  structured progress
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-4 w-4 flex-shrink-0 text-deep-blue-600" />
                <span>
                  Get reminders and preparation prompts before each session
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Target className="mt-0.5 h-4 w-4 flex-shrink-0 text-deep-blue-600" />
                <span>
                  Review session summaries and track long-term progress
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-silver-light">
              In the meantime
            </h3>
            <Link href="/chat/new" className="btn btn-primary">
              Start a Quick Check-in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
