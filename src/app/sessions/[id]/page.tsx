import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Target,
  FileText,
  CheckSquare,
} from 'lucide-react'
import { MobileHeader } from '@/components/MobileHeader'
import { getFramework } from '@/lib/ai/frameworks'
import { format } from 'date-fns'

export default async function SessionSummaryPage({
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

  // If session is not completed, redirect to active view
  if (!session.completed) {
    redirect(`/sessions/${params.id}/active`)
  }

  const framework = getFramework(session.framework_used)
  const scheduledDate = new Date(session.scheduled_for)

  return (
    <div className="min-h-screen">
      <MobileHeader title="Session Summary" />

      <div className="p-4 md:p-6">
        <div className="container mx-auto max-w-4xl">
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

          {/* Session Header */}
          <div className="card mb-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h1 className="mb-2 text-2xl font-bold">{framework.name}</h1>
                <p className="text-silver-light">{framework.description}</p>
              </div>
              {session.rating && (
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={
                        i < session.rating! ? 'text-gold' : 'text-silver-darker'
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-2 text-sm text-silver-light">
                <Calendar className="h-4 w-4 text-deep-blue-600" />
                <span>{format(scheduledDate, 'MMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-silver-light">
                <Clock className="h-4 w-4 text-deep-blue-600" />
                <span>{session.duration_minutes} minutes</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckSquare className="h-4 w-4 text-green-500" />
                <span className="text-green-500">Completed</span>
              </div>
            </div>

            {session.goal && (
              <div className="mt-4 rounded-lg border border-white/5 bg-titanium-900/50 p-4">
                <div className="mb-1 flex items-center gap-1.5 text-sm text-silver-lighter">
                  <Target className="h-4 w-4" />
                  Session Focus
                </div>
                <p>{session.goal}</p>
              </div>
            )}
          </div>

          {/* Session Summary */}
          {session.outcome_summary && (
            <div className="card mb-6">
              <div className="mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-deep-blue-600" />
                <h2 className="text-xl font-bold">Session Summary</h2>
              </div>
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-silver-light">
                  {session.outcome_summary}
                </div>
              </div>
            </div>
          )}

          {/* Action Items */}
          {session.action_items &&
            Array.isArray(session.action_items) &&
            session.action_items.length > 0 && (
              <div className="card mb-6">
                <div className="mb-4 flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-deep-blue-600" />
                  <h2 className="text-xl font-bold">Action Items</h2>
                </div>
                <div className="space-y-3">
                  {session.action_items.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="rounded-lg border border-white/5 bg-titanium-900/50 p-4"
                    >
                      <h3 className="mb-1 font-semibold">{item.title}</h3>
                      {item.description && (
                        <p className="mb-2 text-sm text-silver-light">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-silver-lighter">
                        {item.due_date && (
                          <span>
                            Due: {format(new Date(item.due_date), 'MMM d, yyyy')}
                          </span>
                        )}
                        {item.category && (
                          <span className="rounded-full bg-deep-blue-900/30 px-2 py-0.5">
                            {item.category}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link href="/tasks" className="btn btn-secondary">
                    <CheckSquare className="h-4 w-4" />
                    View All Tasks
                  </Link>
                </div>
              </div>
            )}

          {/* Framework Stages Covered */}
          <div className="card">
            <h2 className="mb-4 text-xl font-bold">Framework Stages</h2>
            <div className="space-y-3">
              {framework.stages.map((stage, index) => (
                <div
                  key={stage.id}
                  className="rounded-lg border border-white/5 bg-titanium-900/50 p-4"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-deep-blue-600 text-xs font-bold">
                      {index + 1}
                    </div>
                    <h3 className="font-semibold">{stage.name}</h3>
                  </div>
                  <p className="text-sm text-silver-light">{stage.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
