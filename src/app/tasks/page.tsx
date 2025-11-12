import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ListTodo, ArrowLeft, CheckSquare, Square } from 'lucide-react'
import { MobileHeader } from '@/components/MobileHeader'

export default async function TasksPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen">
      <MobileHeader title="Task Manager" />

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
            <h1 className="mb-2 text-3xl font-bold">Task Manager</h1>
            <p className="text-silver-light">
              Track action items from your coaching sessions
            </p>
          </div>

        {/* Coming Soon Card */}
        <div className="card text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-deep-blue-800 to-silver-darker">
            <ListTodo className="h-10 w-10 text-silver" />
          </div>

          <h2 className="mb-3 text-2xl font-bold">Coming Soon</h2>
          <p className="mb-6 text-silver-light">
            Your intelligent task manager is coming soon. Action items discussed
            in coaching sessions will automatically appear here, ready to track
            and complete.
          </p>

          <div className="mx-auto mb-8 max-w-2xl rounded-2xl border border-white/5 bg-titanium-900/50 p-6 text-left">
            <h3 className="mb-4 font-semibold">What's Coming:</h3>
            <ul className="space-y-3 text-sm text-silver-light">
              <li className="flex items-start gap-3">
                <CheckSquare className="mt-0.5 h-4 w-4 flex-shrink-0 text-deep-blue-600" />
                <span>
                  Automatic capture of action items from voice and chat sessions
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Square className="mt-0.5 h-4 w-4 flex-shrink-0 text-deep-blue-600" />
                <span>
                  Organize tasks by priority, deadline, and category
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckSquare className="mt-0.5 h-4 w-4 flex-shrink-0 text-deep-blue-600" />
                <span>
                  Context-aware reminders based on your conversations
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Square className="mt-0.5 h-4 w-4 flex-shrink-0 text-deep-blue-600" />
                <span>
                  Track completion and review progress over time
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-silver-light">
              In the meantime
            </h3>
            <Link href="/chat/new" className="btn btn-primary">
              Start a Coaching Session
            </Link>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}
