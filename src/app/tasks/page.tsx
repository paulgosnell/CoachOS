import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft, ListTodo } from 'lucide-react'
import { MobileHeader } from '@/components/MobileHeader'
import { TaskList } from '@/components/tasks/TaskList'

export default async function TasksPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch action items for the user
  const { data: tasks, error } = await supabase
    .from('action_items')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching tasks:', error)
  }

  const pendingTasks = tasks?.filter(t => t.status === 'pending') || []
  const completedTasks = tasks?.filter(t => t.status === 'completed') || []

  return (
    <div className="min-h-screen">
      <MobileHeader title="Tasks" />

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
            <h1 className="mb-2 text-3xl font-bold">Tasks</h1>
            <p className="text-silver-light">
              Action items captured from your coaching sessions
            </p>
          </div>

          {tasks && tasks.length > 0 ? (
            <div className="space-y-8">
              {/* Pending Tasks */}
              {pendingTasks.length > 0 && (
                <div>
                  <h2 className="mb-4 text-lg font-semibold text-silver-light">
                    To Do ({pendingTasks.length})
                  </h2>
                  <TaskList tasks={pendingTasks} />
                </div>
              )}

              {/* Completed Tasks */}
              {completedTasks.length > 0 && (
                <div>
                  <h2 className="mb-4 text-lg font-semibold text-silver-light">
                    Completed ({completedTasks.length})
                  </h2>
                  <TaskList tasks={completedTasks} />
                </div>
              )}
            </div>
          ) : (
            /* Empty State */
            <div className="card text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-deep-blue-800 to-silver-darker">
                <ListTodo className="h-10 w-10 text-silver" />
              </div>

              <h2 className="mb-3 text-2xl font-bold">No Tasks Yet</h2>
              <p className="mb-6 text-silver-light">
                Action items from your coaching sessions will appear here.
                Start a conversation and mention tasks you want to track!
              </p>

              <Link href="/voice-coach" className="btn btn-primary">
                Start a Voice Session
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
