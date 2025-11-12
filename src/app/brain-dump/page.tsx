import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Mic, ArrowLeft, Zap, Brain } from 'lucide-react'
import { MobileHeader } from '@/components/MobileHeader'

export default async function BrainDumpPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen">
      <MobileHeader title="Brain Dump" />

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
            <h1 className="mb-2 text-3xl font-bold">Brain Dump</h1>
            <p className="text-silver-light">
              Quick capture for thoughts and ideas
            </p>
          </div>

        {/* Coming Soon Card */}
        <div className="card text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-deep-blue-800 to-silver-darker">
            <Mic className="h-10 w-10 text-silver" />
          </div>

          <h2 className="mb-3 text-2xl font-bold">Coming Soon</h2>
          <p className="mb-6 text-silver-light">
            Your instant capture tool is coming soon. Quickly record thoughts,
            ideas, or concerns without starting a full coaching session.
          </p>

          <div className="mx-auto mb-8 max-w-2xl rounded-2xl border border-white/5 bg-titanium-900/50 p-6 text-left">
            <h3 className="mb-4 font-semibold">What's Coming:</h3>
            <ul className="space-y-3 text-sm text-silver-light">
              <li className="flex items-start gap-3">
                <Zap className="mt-0.5 h-4 w-4 flex-shrink-0 text-deep-blue-600" />
                <span>
                  Instant voice or text capture - no conversation needed
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Brain className="mt-0.5 h-4 w-4 flex-shrink-0 text-deep-blue-600" />
                <span>
                  AI automatically organizes your thoughts into relevant categories
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Zap className="mt-0.5 h-4 w-4 flex-shrink-0 text-deep-blue-600" />
                <span>
                  Surface insights and patterns from your brain dumps over time
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Brain className="mt-0.5 h-4 w-4 flex-shrink-0 text-deep-blue-600" />
                <span>
                  Review and discuss captured thoughts in coaching sessions
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
