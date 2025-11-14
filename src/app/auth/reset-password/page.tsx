'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowRight, Loader2, Mail, CheckCircle2 } from 'lucide-react'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      })

      if (error) throw error

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'An error occurred while sending the reset email')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="mb-8 text-center">
            <h1 className="font-serif text-3xl font-bold">Coach OS</h1>
            <p className="mt-2 text-silver-light">Check your email</p>
          </div>

          {/* Success Message */}
          <div className="card-elevated">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <h2 className="mb-4 text-center font-serif text-2xl font-semibold">
              Password reset email sent
            </h2>

            <p className="mb-6 text-center text-silver-light">
              We've sent a password reset link to{' '}
              <span className="font-semibold text-silver">{email}</span>
            </p>

            <div className="rounded-lg border border-white/10 bg-titanium-900/50 p-4">
              <div className="mb-2 flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-silver-dark" />
                <div className="text-sm text-silver-light">
                  <p className="mb-2 font-semibold">Next steps:</p>
                  <ol className="ml-4 list-decimal space-y-1">
                    <li>Check your email inbox</li>
                    <li>Click the reset link we sent you</li>
                    <li>Create a new password</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-silver-dark">
              Didn't receive the email?{' '}
              <button
                onClick={() => setSuccess(false)}
                className="font-semibold text-silver-light hover:text-white"
              >
                Try again
              </button>
            </div>
          </div>

          {/* Back to login */}
          <div className="mt-6 text-center">
            <Link href="/auth/login" className="text-sm text-silver-dark hover:text-silver-light">
              ← Back to login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl font-bold">Coach OS</h1>
          <p className="mt-2 text-silver-light">Reset your password</p>
        </div>

        {/* Reset Password Form */}
        <div className="card-elevated">
          <h2 className="mb-2 font-serif text-2xl font-semibold">Forgot your password?</h2>
          <p className="mb-6 text-sm text-silver-light">
            No worries! Enter your email address and we'll send you a link to reset your password.
          </p>

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-silver-light">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input"
                placeholder="john@company.com"
                autoComplete="email"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Sending reset link...
                </>
              ) : (
                <>
                  Send reset link
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-silver-light">
            Remember your password?{' '}
            <Link href="/auth/login" className="font-semibold text-white hover:underline">
              Sign in
            </Link>
          </div>
        </div>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-silver-dark hover:text-silver-light">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
