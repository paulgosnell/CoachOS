'use client'

import { useState } from 'react'
import { X, Send, Loader2, CheckCircle2 } from 'lucide-react'

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
}

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [type, setType] = useState<string>('general')
  const [category, setCategory] = useState<string>('general')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, category, subject, message }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit feedback')
      }

      setSuccess(true)
      setTimeout(() => {
        onClose()
        // Reset form
        setType('general')
        setCategory('general')
        setSubject('')
        setMessage('')
        setSuccess(false)
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to submit feedback')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="relative w-full max-w-md rounded-2xl bg-titanium-900 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="mb-2 text-xl font-semibold">Thank You!</h3>
          <p className="text-silver-light">
            Your feedback has been submitted successfully. We'll review it and get back to you if needed.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl rounded-2xl bg-titanium-900 p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Send Feedback</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-silver-light transition-colors hover:bg-titanium-800 hover:text-silver"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type Selection */}
          <div>
            <label className="mb-2 block text-sm font-medium">Type</label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { value: 'bug', label: '🐛 Bug' },
                { value: 'feature', label: '✨ Feature' },
                { value: 'improvement', label: '🚀 Improvement' },
                { value: 'general', label: '💬 General' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setType(option.value)}
                  className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors ${
                    type === option.value
                      ? 'border-deep-blue-600 bg-deep-blue-600/20 text-silver'
                      : 'border-white/10 bg-titanium-950 text-silver-light hover:border-white/20'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="mb-2 block text-sm font-medium">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-titanium-950 px-4 py-3 text-silver focus:border-deep-blue-600 focus:outline-none focus:ring-2 focus:ring-deep-blue-600/50"
            >
              <option value="general">General</option>
              <option value="ai_quality">AI Coach Quality</option>
              <option value="ui_ux">UI/UX</option>
              <option value="performance">Performance</option>
              <option value="voice">Voice Features</option>
              <option value="onboarding">Onboarding</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="mb-2 block text-sm font-medium">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief description of your feedback"
              required
              className="w-full rounded-lg border border-white/10 bg-titanium-950 px-4 py-3 text-silver placeholder-silver-light/50 focus:border-deep-blue-600 focus:outline-none focus:ring-2 focus:ring-deep-blue-600/50"
            />
          </div>

          {/* Message */}
          <div>
            <label className="mb-2 block text-sm font-medium">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Provide details about your feedback..."
              required
              rows={6}
              className="w-full rounded-lg border border-white/10 bg-titanium-950 px-4 py-3 text-silver placeholder-silver-light/50 focus:border-deep-blue-600 focus:outline-none focus:ring-2 focus:ring-deep-blue-600/50"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-white/10 px-6 py-3 font-semibold text-silver-light transition-colors hover:bg-titanium-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !subject || !message}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-deep-blue-800 px-6 py-3 font-semibold text-silver transition-colors hover:bg-deep-blue-700 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Feedback
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
