'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check, Loader2, Sparkles } from 'lucide-react'

interface SubscribeClientProps {
  subscriptionStatus: string
  expiresAt: string | null
  userName: string
}

export default function SubscribeClient({
  subscriptionStatus,
  expiresAt,
  userName,
}: SubscribeClientProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubscribe = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'pro' }),
      })

      if (!response.ok) {
        throw new Error('Failed to create payment order')
      }

      const { checkoutUrl } = await response.json()

      // Redirect to Revolut checkout
      window.location.href = checkoutUrl
    } catch (err: any) {
      console.error('Subscribe error:', err)
      setError(err.message || 'Failed to start subscription process')
      setIsLoading(false)
    }
  }

  const isPro = subscriptionStatus === 'pro'

  const features = [
    'Unlimited chat conversations',
    'Voice coaching sessions',
    'Priority framework access',
    'Action item tracking',
    'Session history & insights',
    'Custom voice preferences',
    'Priority support',
  ]

  return (
    <div className="min-h-screen bg-titanium-950 p-6">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="mb-4 inline-flex items-center gap-2 text-sm text-silver-light hover:text-silver"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
          <h1 className="mb-2 text-3xl font-bold">
            {isPro ? 'Your Pro Subscription' : 'Upgrade to Pro'}
          </h1>
          <p className="text-silver-light">
            {isPro
              ? 'You have full access to all Coach OS features'
              : 'Unlock the full potential of your AI coach'}
          </p>
        </div>

        {/* Current Status for Pro Users */}
        {isPro && expiresAt && (
          <div className="card mb-8 border-green-500/20 bg-green-500/5">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <Sparkles className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <div className="font-semibold text-green-400">Pro Active</div>
                <div className="text-sm text-silver-light">
                  Renews on {new Date(expiresAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Card */}
        <div className="card relative overflow-hidden border-deep-blue-600/30">
          {/* Pro Badge */}
          <div className="absolute right-4 top-4">
            <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-deep-blue-600 to-purple-600 px-3 py-1 text-xs font-semibold">
              <Sparkles className="h-3 w-3" />
              PRO
            </div>
          </div>

          {/* Pricing */}
          <div className="mb-6">
            <div className="mb-2 text-4xl font-bold">£9.99</div>
            <div className="text-silver-light">per month</div>
          </div>

          {/* Features */}
          <div className="mb-6 space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-green-500/10">
                  <Check className="h-3 w-3 text-green-500" />
                </div>
                <div className="text-sm text-silver-light">{feature}</div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          {!isPro && (
            <button
              onClick={handleSubscribe}
              disabled={isLoading}
              className="btn btn-primary w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Upgrade to Pro
                </>
              )}
            </button>
          )}

          {error && (
            <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {isPro && (
            <div className="rounded-lg bg-titanium-900/50 p-4 text-center">
              <div className="mb-1 font-semibold text-green-400">You're all set!</div>
              <div className="text-sm text-silver-light">
                Enjoy unlimited access to all features
              </div>
            </div>
          )}
        </div>

        {/* Free Features */}
        <div className="card mt-6">
          <h3 className="mb-4 text-lg font-semibold">Free Features</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-silver-light/10">
                <Check className="h-3 w-3 text-silver-light" />
              </div>
              <div className="text-sm text-silver-light">
                Basic chat conversations with AI coach
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-xs text-silver-light">
          Secure payment powered by Revolut. Cancel anytime.
        </div>
      </div>
    </div>
  )
}
