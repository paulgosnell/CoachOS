'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Clock, Target, Sparkles } from 'lucide-react'
import { getAllFrameworks, type CoachingFramework } from '@/lib/ai/frameworks'

export function SessionBooking() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    duration: '45',
    framework: 'grow' as CoachingFramework,
    goal: '',
  })

  const frameworks = getAllFrameworks()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Combine date and time into ISO string
      const scheduledFor = new Date(
        `${formData.date}T${formData.time}`
      ).toISOString()

      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scheduled_for: scheduledFor,
          duration_minutes: parseInt(formData.duration),
          framework_used: formData.framework,
          goal: formData.goal || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create session')
      }

      const { session } = await response.json()

      // Redirect to sessions page
      router.push(`/sessions?booked=${session.id}`)
      router.refresh()
    } catch (err) {
      console.error('Error booking session:', err)
      setError(err instanceof Error ? err.message : 'Failed to book session')
    } finally {
      setLoading(false)
    }
  }

  const selectedFramework = frameworks.find((f) => f.id === formData.framework)

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0]

  // Get minimum time (if today is selected)
  const isToday = formData.date === today
  const now = new Date()
  const minTime = isToday
    ? `${String(now.getHours()).padStart(2, '0')}:${String(Math.ceil(now.getMinutes() / 15) * 15).padStart(2, '0')}`
    : '09:00'

  return (
    <div className="card">
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-deep-blue-600" />
          <h2 className="text-2xl font-bold">Book a Coaching Session</h2>
        </div>
        <p className="text-silver-light">
          Schedule a structured coaching session using a proven framework
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Framework Selection */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Coaching Framework
          </label>
          <div className="space-y-3">
            {frameworks.map((framework) => (
              <label
                key={framework.id}
                className={`block cursor-pointer rounded-lg border p-4 transition-all ${
                  formData.framework === framework.id
                    ? 'border-deep-blue-600 bg-deep-blue-900/20'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <input
                  type="radio"
                  name="framework"
                  value={framework.id}
                  checked={formData.framework === framework.id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      framework: e.target.value as CoachingFramework,
                    })
                  }
                  className="sr-only"
                />
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-1 font-semibold">{framework.name}</div>
                    <div className="mb-2 text-sm text-silver-light">
                      {framework.description}
                    </div>
                    <div className="text-xs text-silver-lighter">
                      Best for: {framework.bestFor.join(', ')}
                    </div>
                  </div>
                  {formData.framework === framework.id && (
                    <div className="ml-4 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-deep-blue-600">
                      <div className="h-2 w-2 rounded-full bg-white" />
                    </div>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Date and Time */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="date" className="mb-2 block text-sm font-medium">
              <Calendar className="mr-1.5 inline h-4 w-4" />
              Date
            </label>
            <input
              type="date"
              id="date"
              required
              min={today}
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="input w-full"
            />
          </div>

          <div>
            <label htmlFor="time" className="mb-2 block text-sm font-medium">
              <Clock className="mr-1.5 inline h-4 w-4" />
              Time
            </label>
            <input
              type="time"
              id="time"
              required
              step="900"
              min={minTime}
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
              className="input w-full"
            />
            <p className="mt-1 text-xs text-silver-lighter">15-minute intervals</p>
          </div>
        </div>

        {/* Duration */}
        <div>
          <label htmlFor="duration" className="mb-2 block text-sm font-medium">
            Duration
          </label>
          <select
            id="duration"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
            className="input w-full"
          >
            <option value="30">30 minutes</option>
            <option value="45">45 minutes (recommended)</option>
            <option value="60">60 minutes</option>
            <option value="90">90 minutes</option>
          </select>
          {selectedFramework && (
            <p className="mt-1 text-xs text-silver-lighter">
              Suggested duration for {selectedFramework.name}:{' '}
              {selectedFramework.duration} minutes
            </p>
          )}
        </div>

        {/* Session Goal (Optional) */}
        <div>
          <label htmlFor="goal" className="mb-2 block text-sm font-medium">
            <Target className="mr-1.5 inline h-4 w-4" />
            What do you want to focus on? (Optional)
          </label>
          <textarea
            id="goal"
            rows={3}
            value={formData.goal}
            onChange={(e) =>
              setFormData({ ...formData, goal: e.target.value })
            }
            placeholder="E.g., Deciding whether to hire a new sales person, Planning Q1 strategy, Dealing with a difficult team situation..."
            className="input w-full resize-none"
          />
          <p className="mt-1 text-xs text-silver-lighter">
            This helps prepare the coaching conversation
          </p>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn btn-ghost"
            disabled={loading}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                Booking...
              </>
            ) : (
              'Book Session'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
