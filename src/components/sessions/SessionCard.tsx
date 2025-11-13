'use client'

import { useRouter } from 'next/navigation'
import { Calendar, Clock, Target, Play, FileText, Trash2 } from 'lucide-react'
import { getFramework } from '@/lib/ai/frameworks'
import { format, isPast, isFuture, isToday } from 'date-fns'

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

interface SessionCardProps {
  session: Session
  onDelete?: (id: string) => void
}

export function SessionCard({ session, onDelete }: SessionCardProps) {
  const router = useRouter()
  const framework = getFramework(session.framework_used as any)
  const scheduledDate = new Date(session.scheduled_for)
  const isPastSession = isPast(scheduledDate) && !isToday(scheduledDate)
  const canStart =
    (isToday(scheduledDate) || isPast(scheduledDate)) && !session.completed

  const handleStart = () => {
    router.push(`/sessions/${session.id}/active`)
  }

  const handleViewSummary = () => {
    router.push(`/sessions/${session.id}`)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to cancel this session?')) {
      return
    }

    try {
      const response = await fetch(`/api/sessions/${session.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete session')
      }

      onDelete?.(session.id)
    } catch (error) {
      console.error('Error deleting session:', error)
      alert('Failed to cancel session. Please try again.')
    }
  }

  return (
    <div className="card group relative">
      {/* Status Badge */}
      <div className="absolute right-4 top-4">
        {session.completed ? (
          <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
            Completed
          </span>
        ) : isPastSession ? (
          <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-medium text-yellow-400">
            Missed
          </span>
        ) : isFuture(scheduledDate) ? (
          <span className="rounded-full bg-deep-blue-600/20 px-3 py-1 text-xs font-medium text-deep-blue-400">
            Upcoming
          </span>
        ) : (
          <span className="animate-pulse rounded-full bg-gold/20 px-3 py-1 text-xs font-medium text-gold">
            Ready to Start
          </span>
        )}
      </div>

      {/* Framework Name */}
      <div className="mb-3">
        <h3 className="text-lg font-semibold">{framework.name}</h3>
        <p className="text-sm text-silver-light">{framework.description}</p>
      </div>

      {/* Session Goal */}
      {session.goal && (
        <div className="mb-4 rounded-lg border border-white/5 bg-titanium-900/50 p-3">
          <div className="mb-1 flex items-center gap-1.5 text-xs text-silver-lighter">
            <Target className="h-3.5 w-3.5" />
            Session Focus
          </div>
          <p className="text-sm">{session.goal}</p>
        </div>
      )}

      {/* Session Details */}
      <div className="mb-4 grid gap-3 text-sm sm:grid-cols-2">
        <div className="flex items-center gap-2 text-silver-light">
          <Calendar className="h-4 w-4 text-deep-blue-600" />
          <span>
            {isToday(scheduledDate)
              ? 'Today'
              : format(scheduledDate, 'MMM d, yyyy')}
            {' at '}
            {format(scheduledDate, 'h:mm a')}
          </span>
        </div>
        <div className="flex items-center gap-2 text-silver-light">
          <Clock className="h-4 w-4 text-deep-blue-600" />
          <span>{session.duration_minutes} minutes</span>
        </div>
      </div>

      {/* Rating (if completed) */}
      {session.completed && session.rating && (
        <div className="mb-4 flex items-center gap-2 text-sm">
          <span className="text-silver-light">Your rating:</span>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={
                  i < session.rating! ? 'text-gold' : 'text-silver-darker'
                }
              >
                ★
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4">
        {session.completed ? (
          <button
            onClick={handleViewSummary}
            className="btn btn-secondary flex-1"
          >
            <FileText className="h-4 w-4" />
            View Summary
          </button>
        ) : canStart ? (
          <>
            <button onClick={handleStart} className="btn btn-primary flex-1">
              <Play className="h-4 w-4" />
              Start Session
            </button>
            <button
              onClick={handleDelete}
              className="btn btn-ghost"
              title="Cancel session"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => router.push(`/sessions/${session.id}/prepare`)}
              className="btn btn-secondary flex-1"
            >
              <FileText className="h-4 w-4" />
              Prepare
            </button>
            <button
              onClick={handleDelete}
              className="btn btn-ghost"
              title="Cancel session"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
