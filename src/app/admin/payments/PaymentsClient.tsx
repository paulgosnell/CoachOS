'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Webhook, CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react'

export default function PaymentsClient() {
  const [webhooks, setWebhooks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const fetchWebhooks = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/payments/setup-webhook')
      if (!response.ok) {
        throw new Error('Failed to fetch webhooks')
      }
      const data = await response.json()
      setWebhooks(data.webhooks || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWebhooks()
  }, [])

  const handleRegisterWebhook = async () => {
    try {
      setRegistering(true)
      setError(null)
      setSuccess(null)

      // Get Supabase URL from env and construct edge function URL
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      if (!supabaseUrl) {
        throw new Error('NEXT_PUBLIC_SUPABASE_URL not found')
      }
      const webhookUrl = `${supabaseUrl}/functions/v1/revolut-webhook-handler`

      const response = await fetch('/api/payments/setup-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookUrl }),
      })

      if (!response.ok) {
        throw new Error('Failed to register webhook')
      }

      const data = await response.json()
      setSuccess(`Webhook registered successfully! ID: ${data.webhookId}`)

      // Refresh the list
      await fetchWebhooks()
    } catch (err: any) {
      setError(err.message || 'Failed to register webhook')
    } finally {
      setRegistering(false)
    }
  }

  return (
    <div className="min-h-screen bg-titanium-950 p-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="mb-4 inline-flex items-center gap-2 text-sm text-silver-light hover:text-silver"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Admin
          </Link>
          <h1 className="mb-2 text-3xl font-bold">Payment Configuration</h1>
          <p className="text-silver-light">Manage Revolut webhooks and payment settings</p>
        </div>

        {/* Register Webhook Section */}
        <div className="card mb-6">
          <div className="mb-4 flex items-center gap-2">
            <Webhook className="h-5 w-5 text-deep-blue-500" />
            <h2 className="text-xl font-semibold">Webhook Setup</h2>
          </div>

          <p className="mb-4 text-sm text-silver-light">
            Register a webhook to automatically activate subscriptions when payments are completed.
          </p>

          <div className="mb-4 rounded-lg bg-titanium-900/50 p-3">
            <div className="text-xs text-silver-light">Webhook URL (Supabase Edge Function):</div>
            <div className="font-mono text-sm text-silver">
              {process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/revolut-webhook-handler
            </div>
          </div>

          <button
            onClick={handleRegisterWebhook}
            disabled={registering}
            className="btn-primary"
          >
            {registering ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Registering...
              </>
            ) : (
              <>
                <Webhook className="h-5 w-5" />
                Register Webhook
              </>
            )}
          </button>

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              <XCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-400">
              <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              {success}
            </div>
          )}
        </div>

        {/* Registered Webhooks */}
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Registered Webhooks</h2>
            <button
              onClick={fetchWebhooks}
              disabled={loading}
              className="text-silver-light transition-colors hover:text-silver"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {loading ? (
            <div className="py-8 text-center text-silver-light">
              <Loader2 className="mx-auto h-6 w-6 animate-spin" />
            </div>
          ) : webhooks.length === 0 ? (
            <div className="py-8 text-center text-silver-light">
              No webhooks registered yet
            </div>
          ) : (
            <div className="space-y-3">
              {webhooks.map((webhook: any, index: number) => (
                <div
                  key={webhook.id || index}
                  className="rounded-lg bg-titanium-900/50 p-4"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-mono text-sm text-silver">{webhook.url}</div>
                      {webhook.id && (
                        <div className="mt-1 text-xs text-silver-light">ID: {webhook.id}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-1 text-xs text-green-400">
                      <CheckCircle className="h-3 w-3" />
                      Active
                    </div>
                  </div>
                  {webhook.events && webhook.events.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {webhook.events.map((event: string) => (
                        <span
                          key={event}
                          className="rounded bg-deep-blue-800/50 px-2 py-1 text-xs text-silver-light"
                        >
                          {event}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Configuration Notes */}
        <div className="card mt-6 border-blue-500/20 bg-blue-500/5">
          <h3 className="mb-2 font-semibold text-blue-400">Setup Instructions</h3>
          <ol className="space-y-2 text-sm text-silver-light">
            <li>1. Deploy the edge function with: <code className="rounded bg-titanium-900 px-1 py-0.5 font-mono text-xs">npx supabase functions deploy revolut-webhook-handler --no-verify-jwt</code></li>
            <li>2. Set secrets: <code className="rounded bg-titanium-900 px-1 py-0.5 font-mono text-xs">npx supabase secrets set REVOLUT_API_KEY=your_key</code></li>
            <li>3. Click "Register Webhook" button above</li>
            <li>4. Test payments using Revolut sandbox mode</li>
          </ol>

          <h3 className="mb-2 mt-4 font-semibold text-blue-400">Important Notes</h3>
          <ul className="space-y-2 text-sm text-silver-light">
            <li>• The <code className="rounded bg-titanium-900 px-1 py-0.5 font-mono text-xs">--no-verify-jwt</code> flag is required so Revolut can call the webhook</li>
            <li>• Webhooks are automatically called when orders are completed</li>
            <li>• The webhook handler will create/activate subscriptions</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
