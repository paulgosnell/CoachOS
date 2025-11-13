import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, Sparkles } from 'lucide-react'
import { MobileHeader } from '@/components/MobileHeader'
import { getFramework, generatePreparationPrompt } from '@/lib/ai/frameworks'
import { format } from 'date-fns'

export default async function SessionPrepPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get the session
  const { data: session, error } = await supabase
    .from('coaching_sessions')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (error || !session) {
    redirect('/sessions')
  }

  // If session is completed, redirect to summary
  if (session.completed) {
    redirect(`/sessions/${params.id}`)
  }

  const framework = getFramework(session.framework_used)
  const scheduledDate = new Date(session.scheduled_for)
  const preparationText = generatePreparationPrompt(
    session.framework_used,
    session.goal
  )

  return (
    <div className="min-h-screen">
      <MobileHeader title="Session Preparation" />

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

          {/* Session Info */}
          <div className="card mb-6">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-deep-blue-600" />
              <h1 className="text-2xl font-bold">Prepare for Your Session</h1>
            </div>

            <div className="mb-4">
              <h2 className="mb-1 font-semibold">{framework.name}</h2>
              <p className="text-sm text-silver-light">{framework.description}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2 text-sm text-silver-light">
                <Calendar className="h-4 w-4 text-deep-blue-600" />
                <span>{format(scheduledDate, 'MMM d, yyyy \'at\' h:mm a')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-silver-light">
                <Clock className="h-4 w-4 text-deep-blue-600" />
                <span>{session.duration_minutes} minutes</span>
              </div>
            </div>
          </div>

          {/* Preparation Questions */}
          <div className="card mb-6">
            <h2 className="mb-4 text-xl font-bold">Preparation Guide</h2>
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-silver-light">
                {preparationText}
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="card bg-deep-blue-900/20">
            <h3 className="mb-3 font-semibold text-deep-blue-400">
              Tips for a Great Session
            </h3>
            <ul className="space-y-2 text-sm text-silver-light">
              <li className="flex items-start gap-2">
                <span className="text-deep-blue-600">•</span>
                <span>
                  Find a quiet space where you won't be interrupted
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-deep-blue-600">•</span>
                <span>
                  Have a notepad handy to capture insights and action items
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-deep-blue-600">•</span>
                <span>
                  Be open and honest - the more you share, the more valuable the
                  session
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-deep-blue-600">•</span>
                <span>
                  Come ready to explore options, not just confirm your existing
                  thinking
                </span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <Link href="/sessions" className="btn btn-ghost flex-1">
              Back to Sessions
            </Link>
            <Link
              href={`/sessions/${params.id}/active`}
              className="btn btn-primary flex-1"
            >
              Start Session
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
