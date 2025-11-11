import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export default async function OnboardingWelcomePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Check if already completed onboarding
  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_completed, full_name')
    .eq('id', user.id)
    .single()

  if (profile?.onboarding_completed) {
    redirect('/dashboard')
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Welcome Section */}
      <div className="text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-glass-border bg-glass-bg px-4 py-2">
          <Sparkles className="h-4 w-4 text-silver" />
          <span className="text-sm font-semibold text-silver">Let's get started</span>
        </div>

        <h1 className="mb-4 text-4xl font-bold md:text-5xl">
          Welcome to Coach OS,
          <br />
          <span className="text-gradient">{profile?.full_name?.split(' ')[0] || 'there'}</span>
        </h1>

        <p className="mb-12 text-lg text-silver-light md:text-xl">
          Before we start coaching, I need to understand your business and goals.
          This takes about 5 minutes.
        </p>
      </div>

      {/* What to Expect */}
      <div className="mb-12 grid gap-6 md:grid-cols-3">
        <div className="card text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-deep-blue-800 to-deep-blue-600">
            <span className="text-2xl">🏢</span>
          </div>
          <h3 className="mb-2 text-lg font-semibold">Your Business</h3>
          <p className="text-sm text-silver-light">
            Tell me about your company, role, and industry
          </p>
        </div>

        <div className="card text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-deep-blue-800 to-deep-blue-600">
            <span className="text-2xl">🎯</span>
          </div>
          <h3 className="mb-2 text-lg font-semibold">Your Goals</h3>
          <p className="text-sm text-silver-light">
            Share your top priorities and what success looks like
          </p>
        </div>

        <div className="card text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-deep-blue-800 to-deep-blue-600">
            <span className="text-2xl">✨</span>
          </div>
          <h3 className="mb-2 text-lg font-semibold">Start Coaching</h3>
          <p className="text-sm text-silver-light">
            Get personalized guidance based on your context
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link href="/onboarding/business" className="btn btn-primary">
          Let's Begin
          <ArrowRight className="h-5 w-5" />
        </Link>

        <p className="mt-6 text-sm text-gray-500">
          Takes about 5 minutes • Your data is private and secure
        </p>
      </div>

      {/* Why We Need This */}
      <div className="mt-16 rounded-2xl border border-white/5 bg-titanium-900/50 p-8">
        <h3 className="mb-4 text-xl font-semibold">Why we ask for this</h3>
        <div className="space-y-3 text-silver-light">
          <p className="flex items-start gap-3">
            <span className="text-green-500">✓</span>
            <span>
              <strong className="text-white">Never repeat yourself:</strong> I'll remember your
              business context in every conversation
            </span>
          </p>
          <p className="flex items-start gap-3">
            <span className="text-green-500">✓</span>
            <span>
              <strong className="text-white">Relevant advice:</strong> Guidance tailored to your
              industry, stage, and goals
            </span>
          </p>
          <p className="flex items-start gap-3">
            <span className="text-green-500">✓</span>
            <span>
              <strong className="text-white">Track progress:</strong> See how you're moving toward
              your objectives
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
