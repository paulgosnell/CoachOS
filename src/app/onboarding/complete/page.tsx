import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

export default async function OnboardingCompletePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get user profile and goals
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const { data: goals, count: goalCount } = await supabase
    .from('goals')
    .select('title', { count: 'exact' })
    .eq('user_id', user.id)
    .eq('status', 'active')

  const { data: businessProfile } = await supabase
    .from('business_profiles')
    .select('industry, company_stage, role')
    .eq('user_id', user.id)
    .single()

  return (
    <div className="mx-auto max-w-3xl">
      {/* Success Animation */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 animate-scale-in">
          <CheckCircle2 className="h-10 w-10 text-white" />
        </div>

        <h1 className="mb-3 text-4xl font-bold md:text-5xl">
          You're all set,{' '}
          <span className="text-gradient">{profile?.full_name?.split(' ')[0] || 'there'}</span>!
        </h1>

        <p className="text-lg text-silver-light md:text-xl">
          Your coach is ready to help you succeed
        </p>
      </div>

      {/* What We Know */}
      <div className="mb-8 rounded-2xl border border-white/5 bg-titanium-900/50 p-8">
        <h2 className="mb-6 text-xl font-semibold">Here's what I know about you</h2>

        <div className="space-y-4">
          {businessProfile && (
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-deep-blue-800">
                <span className="text-xl">🏢</span>
              </div>
              <div className="flex-1">
                <h3 className="mb-1 font-semibold">Your Business</h3>
                <p className="text-sm text-silver-light">
                  {businessProfile.role} in {businessProfile.industry},{' '}
                  {businessProfile.company_stage}
                </p>
              </div>
            </div>
          )}

          {goals && goals.length > 0 && (
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-deep-blue-800">
                <span className="text-xl">🎯</span>
              </div>
              <div className="flex-1">
                <h3 className="mb-1 font-semibold">Your Goals</h3>
                <p className="mb-2 text-sm text-silver-light">
                  {goalCount} {goalCount === 1 ? 'priority' : 'priorities'} to track
                </p>
                <ul className="space-y-1">
                  {goals.slice(0, 3).map((goal, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-silver-light">
                      <span className="text-green-500">✓</span>
                      <span>{goal.title}</span>
                    </li>
                  ))}
                  {goals.length > 3 && (
                    <li className="text-sm text-gray-500">
                      and {goals.length - 3} more...
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* What's Next */}
      <div className="mb-8 rounded-2xl border border-white/5 bg-gradient-to-br from-deep-blue-900/30 to-titanium-900/50 p-8">
        <h2 className="mb-4 text-xl font-semibold">What you can do now</h2>

        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
              1
            </div>
            <div>
              <h3 className="mb-1 font-semibold">Start a conversation</h3>
              <p className="text-sm text-silver-light">
                Have a quick check-in or work through a challenge
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
              2
            </div>
            <div>
              <h3 className="mb-1 font-semibold">Book a deep-dive session</h3>
              <p className="text-sm text-silver-light">
                Schedule 45 minutes for structured coaching
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
              3
            </div>
            <div>
              <h3 className="mb-1 font-semibold">Track your goals</h3>
              <p className="text-sm text-silver-light">
                I'll help you stay accountable to your priorities
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link href="/dashboard" className="btn btn-primary">
          Go to Dashboard
          <ArrowRight className="h-5 w-5" />
        </Link>

        <p className="mt-6 text-sm text-gray-500">
          Your data is secure and private. You can update your profile anytime.
        </p>
      </div>

      {/* Coach Message */}
      <div className="mt-12 rounded-2xl border border-silver/20 bg-titanium-900/80 p-6">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-deep-blue-800 to-silver-darker">
            <span className="text-xl">👋</span>
          </div>
          <div>
            <p className="font-semibold">Your Coach</p>
            <p className="text-xs text-gray-500">Always available</p>
          </div>
        </div>

        <p className="text-silver-light">
          I'm here whenever you need me. Whether it's a quick check-in before a meeting or a
          deep dive into strategy, I've got full context on your business and goals. Let's make
          progress together.
        </p>
      </div>
    </div>
  )
}
