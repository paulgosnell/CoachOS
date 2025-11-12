'use client'

import { useEffect, useState } from 'react'
import { MessageCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Feedback {
  id: string
  user_id: string | null
  type: string
  category: string
  subject: string
  message: string
  status: string
  priority: string
  created_at: string
}

export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadFeedback()
  }, [])

  const loadFeedback = async () => {
    try {
      const response = await fetch('/api/admin/feedback')
      if (!response.ok) throw new Error('Failed to load feedback')

      const data = await response.json()
      setFeedback(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getTypeBadge = (type: string) => {
    const badges: Record<string, string> = {
      bug: '🐛 Bug',
      feature: '✨ Feature',
      improvement: '🚀 Improvement',
      general: '💬 General',
    }
    return badges[type] || type
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-blue-500/10 text-blue-400',
      reviewed: 'bg-purple-500/10 text-purple-400',
      in_progress: 'bg-yellow-500/10 text-yellow-400',
      resolved: 'bg-green-500/10 text-green-400',
      closed: 'bg-gray-500/10 text-gray-400',
    }
    return colors[status] || colors.new
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-titanium-950">
        <div className="text-silver-light">Loading feedback...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-titanium-950">
        <div className="text-center">
          <div className="mb-4 text-red-400">{error}</div>
          <Link href="/admin" className="btn btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-titanium-950 p-6">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="mb-4 inline-flex items-center gap-2 text-sm text-silver-light hover:text-silver"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Admin Dashboard
          </Link>
          <div>
            <h1 className="mb-2 text-3xl font-bold">User Feedback</h1>
            <p className="text-silver-light">
              {feedback.filter((f) => f.status === 'new').length} new,{' '}
              {feedback.length} total
            </p>
          </div>
        </div>

        {/* Feedback List */}
        <div className="space-y-4">
          {feedback.map((item) => (
            <div key={item.id} className="card">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="font-semibold">{getTypeBadge(item.type)}</span>
                    <span className={`rounded-lg px-2 py-1 text-xs ${getStatusColor(item.status)}`}>
                      {item.status.replace('_', ' ')}
                    </span>
                    {item.priority !== 'medium' && (
                      <span
                        className={`rounded-lg px-2 py-1 text-xs ${
                          item.priority === 'urgent'
                            ? 'bg-red-500/10 text-red-400'
                            : item.priority === 'high'
                              ? 'bg-orange-500/10 text-orange-400'
                              : 'bg-gray-500/10 text-gray-400'
                        }`}
                      >
                        {item.priority}
                      </span>
                    )}
                  </div>

                  <h3 className="mb-2 text-lg font-semibold">{item.subject}</h3>

                  <p className="mb-3 text-sm text-silver-light">{item.message}</p>

                  {item.category && (
                    <div className="text-xs text-silver-light">Category: {item.category}</div>
                  )}
                </div>

                <div className="ml-4 text-right text-xs text-silver-light">
                  {new Date(item.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          ))}

          {feedback.length === 0 && (
            <div className="card text-center">
              <div className="py-12">
                <MessageCircle className="mx-auto mb-4 h-12 w-12 text-gray-500" />
                <h3 className="mb-2 text-lg font-semibold">No feedback yet</h3>
                <p className="text-sm text-silver-light">
                  User feedback will appear here when submitted
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
