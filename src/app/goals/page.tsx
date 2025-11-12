import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Target, Calendar, ArrowLeft, CheckCircle2, Circle } from 'lucide-react'
import { MobileHeader } from '@/components/MobileHeader'

export default async function GoalsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get user's goals
  const { data: goals } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', user.id)
    .order('priority', { ascending: true })
    .order('created_at', { ascending: false })

  const activeGoals = goals?.filter((g) => g.status === 'active') || []
  const completedGoals = goals?.filter((g) => g.status === 'completed') || []

  return (
    <div className="min-h-screen">
      <MobileHeader title="Your Goals" />

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
            <h1 className="mb-2 text-3xl font-bold">Your Goals</h1>
            <p className="text-silver-light">
              Track your progress and commitments
            </p>
          </div>

        {/* Active Goals */}
        <div className="mb-8">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <Circle className="h-5 w-5 text-deep-blue-600" />
            Active Goals ({activeGoals.length})
          </h2>

          {activeGoals.length === 0 ? (
            <div className="card text-center">
              <Target className="mx-auto mb-3 h-12 w-12 text-gray-500" />
              <p className="mb-2 text-silver-light">No active goals yet</p>
              <p className="text-sm text-gray-500">
                Set goals during your coaching conversations or in onboarding
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeGoals.map((goal) => (
                <div key={goal.id} className="card">
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="text-lg font-semibold">{goal.title}</h3>
                    {goal.priority && (
                      <span className="rounded-full bg-deep-blue-800/50 px-3 py-1 text-xs font-medium">
                        Priority {goal.priority}
                      </span>
                    )}
                  </div>

                  {goal.description && (
                    <p className="mb-3 text-sm text-silver-light">
                      {goal.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {goal.category && (
                      <span className="rounded-lg bg-titanium-900/50 px-2 py-1 text-xs text-gray-400">
                        {goal.category}
                      </span>
                    )}
                    {goal.target_date && (
                      <span className="flex items-center gap-1 rounded-lg bg-titanium-900/50 px-2 py-1 text-xs text-gray-400">
                        <Calendar className="h-3 w-3" />
                        {new Date(goal.target_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Goals */}
        {completedGoals.length > 0 && (
          <div>
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Completed Goals ({completedGoals.length})
            </h2>

            <div className="space-y-4">
              {completedGoals.map((goal) => (
                <div key={goal.id} className="card opacity-60">
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="text-lg font-semibold line-through">
                      {goal.title}
                    </h3>
                    {goal.completed_at && (
                      <span className="text-xs text-gray-500">
                        Completed{' '}
                        {new Date(goal.completed_at).toLocaleDateString(
                          'en-US',
                          { month: 'short', day: 'numeric', year: 'numeric' }
                        )}
                      </span>
                    )}
                  </div>

                  {goal.description && (
                    <p className="text-sm text-silver-light">
                      {goal.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {goals?.length === 0 && (
          <div className="card text-center">
            <Target className="mx-auto mb-4 h-16 w-16 text-gray-500" />
            <h3 className="mb-2 text-xl font-semibold">No goals yet</h3>
            <p className="mb-6 text-silver-light">
              Goals will appear here once you set them during onboarding or
              coaching sessions
            </p>
            <Link href="/chat/new" className="btn btn-primary">
              Start a Coaching Session
            </Link>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
