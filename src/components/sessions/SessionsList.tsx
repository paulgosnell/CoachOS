'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Calendar, Plus, Loader2 } from 'lucide-react'
import { SessionCard } from './SessionCard'

interface Session {
  id: string
  scheduled_for: string
  duration_minutes: number
  framework_used: string
  goal: string | null
  outcome_summary: string | null
  completed: boolean
  rating: number | null
}

export function SessionsList() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [sessions, setSessions] = useState<Session[]>([])
  const [showCompleted, setShowCompleted] = useState(false)

  const bookedSessionId = searchParams.get('booked')

  useEffect(() => {
    fetchSessions()
  }, [showCompleted])

  const fetchSessions = async () => {
    try {
      const url = new URL('/api/sessions', window.location.origin)
      url.searchParams.set('completed', showCompleted.toString())

      const response = await fetch(url.toString())
      const data = await response.json()

      if (response.ok) {
        setSessions(data.sessions || [])
      }
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (id: string) => {
    setSessions(sessions.filter((s) => s.id !== id))
  }

  const upcomingSessions = sessions.filter((s) => !s.completed)
  const completedSessions = sessions.filter((s) => s.completed)
  const displaySessions = showCompleted ? completedSessions : upcomingSessions

  return (
    <div>
      {/* Success Message */}
      {bookedSessionId && (
        <div className="mb-6 rounded-lg border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-400">
          Session booked successfully! You'll receive a reminder before it
          starts.
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {showCompleted ? 'Completed Sessions' : 'Upcoming Sessions'}
          </h2>
          <p className="text-sm text-silver-light">
            {showCompleted
              ? `${completedSessions.length} completed session${completedSessions.length !== 1 ? 's' : ''}`
              : `${upcomingSessions.length} upcoming session${upcomingSessions.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={() => router.push('/sessions/new')}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4" />
          Book Session
        </button>
      </div>

      {/* Toggle */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setShowCompleted(false)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            !showCompleted
              ? 'bg-deep-blue-600 text-white'
              : 'bg-titanium-900/50 text-silver-light hover:bg-titanium-900'
          }`}
        >
          Upcoming ({upcomingSessions.length})
        </button>
        <button
          onClick={() => setShowCompleted(true)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            showCompleted
              ? 'bg-deep-blue-600 text-white'
              : 'bg-titanium-900/50 text-silver-light hover:bg-titanium-900'
          }`}
        >
          Completed ({completedSessions.length})
        </button>
      </div>

      {/* Sessions List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-deep-blue-600" />
        </div>
      ) : displaySessions.length === 0 ? (
        <div className="card text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-deep-blue-800 to-silver-darker">
            <Calendar className="h-8 w-8 text-silver" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">
            {showCompleted ? 'No Completed Sessions Yet' : 'No Upcoming Sessions'}
          </h3>
          <p className="mb-6 text-silver-light">
            {showCompleted
              ? 'Complete your first coaching session to see it here'
              : 'Book your first structured coaching session to get started'}
          </p>
          {!showCompleted && (
            <button
              onClick={() => router.push('/sessions/new')}
              className="btn btn-primary"
            >
              <Plus className="h-4 w-4" />
              Book Your First Session
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displaySessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
