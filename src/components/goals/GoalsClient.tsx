'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Target, Calendar, ArrowLeft, CheckCircle2, Circle, Plus, Edit2, Trash2, Check, X } from 'lucide-react'
import { MobileHeader } from '@/components/MobileHeader'
import { GoalModal } from './GoalModal'
import { trackGoalCreated, trackGoalUpdated, trackGoalCompleted, trackGoalDeleted } from '@/lib/analytics'

interface Goal {
  id: string
  title: string
  description?: string
  category?: string
  priority?: number
  target_date?: string
  status: string
  completed_at?: string
}

interface GoalsClientProps {
  initialGoals: Goal[]
}

export function GoalsClient({ initialGoals }: GoalsClientProps) {
  const router = useRouter()
  const [goals, setGoals] = useState<Goal[]>(initialGoals)
  const [showModal, setShowModal] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)

  const activeGoals = goals.filter((g) => g.status === 'active')
  const completedGoals = goals.filter((g) => g.status === 'completed')

  const handleAddGoal = () => {
    setEditingGoal(null)
    setShowModal(true)
  }

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal)
    setShowModal(true)
  }

  const handleSaveGoal = async (goalData: Partial<Goal>) => {
    try {
      const response = await fetch('/api/goals', {
        method: editingGoal ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...goalData,
          id: editingGoal?.id,
        }),
      })

      if (!response.ok) throw new Error('Failed to save goal')

      const savedGoal = await response.json()

      if (editingGoal) {
        // Update existing goal
        setGoals(goals.map((g) => (g.id === editingGoal.id ? savedGoal : g)))
        trackGoalUpdated(editingGoal.id)
      } else {
        // Add new goal
        setGoals([...goals, savedGoal])
        trackGoalCreated(goalData.category, goalData.priority?.toString())
      }

      setShowModal(false)
      setEditingGoal(null)
      router.refresh()
    } catch (error) {
      console.error('Failed to save goal:', error)
      alert('Failed to save goal. Please try again.')
    }
  }

  const handleCompleteGoal = async (goalId: string) => {
    try {
      const response = await fetch('/api/goals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: goalId,
          status: 'completed',
          completed_at: new Date().toISOString(),
        }),
      })

      if (!response.ok) throw new Error('Failed to complete goal')

      const updatedGoal = await response.json()
      setGoals(goals.map((g) => (g.id === goalId ? updatedGoal : g)))

      // Find the goal to track its category
      const completedGoal = goals.find((g) => g.id === goalId)
      trackGoalCompleted(goalId, completedGoal?.category)

      router.refresh()
    } catch (error) {
      console.error('Failed to complete goal:', error)
      alert('Failed to complete goal. Please try again.')
    }
  }

  const handleDeleteGoal = async (goalId: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return

    try {
      const response = await fetch('/api/goals', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: goalId }),
      })

      if (!response.ok) throw new Error('Failed to delete goal')

      setGoals(goals.filter((g) => g.id !== goalId))
      trackGoalDeleted(goalId)
      router.refresh()
    } catch (error) {
      console.error('Failed to delete goal:', error)
      alert('Failed to delete goal. Please try again.')
    }
  }

  return (
    <div className="min-h-screen">
      <MobileHeader title="Your Goals" />

      <div className="p-4 md:p-6">
        <div className="container mx-auto max-w-4xl">
          {/* Desktop Header */}
          <div className="mb-8 hidden lg:block">
            <Link
              href="/dashboard"
              className="mb-4 inline-flex items-center gap-2 text-sm text-silver-light hover:text-silver"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="mb-2 text-3xl font-bold">Your Goals</h1>
                <p className="text-silver-light">Track your progress and commitments</p>
              </div>
              <button
                onClick={handleAddGoal}
                className="flex items-center gap-2 rounded-lg bg-deep-blue-700 px-4 py-2 font-medium text-silver transition-colors hover:bg-deep-blue-600"
              >
                <Plus className="h-5 w-5" />
                New Goal
              </button>
            </div>
          </div>

          {/* Mobile Add Button */}
          <div className="mb-6 lg:hidden">
            <button
              onClick={handleAddGoal}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-deep-blue-700 px-4 py-3 font-medium text-silver transition-colors hover:bg-deep-blue-600"
            >
              <Plus className="h-5 w-5" />
              New Goal
            </button>
          </div>

          {/* Active Goals */}
          <div className="mb-8">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
              <Circle className="h-5 w-5 text-deep-blue-600" />
              Active Goals ({activeGoals.length})
            </h2>

            {activeGoals.length === 0 ? (
              <div className="card text-center">
                <Target className="mx-auto mb-3 h-12 w-12 text-gray-500" />
                <p className="mb-2 text-silver-light">No active goals yet</p>
                <p className="text-sm text-gray-500">Click "New Goal" to add your first goal</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeGoals.map((goal) => (
                  <div key={goal.id} className="card">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{goal.title}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        {goal.priority && (
                          <span className="rounded-full bg-deep-blue-800/50 px-3 py-1 text-xs font-medium">
                            Priority {goal.priority}
                          </span>
                        )}
                        <button
                          onClick={() => handleCompleteGoal(goal.id)}
                          className="text-green-500 transition-colors hover:text-green-400"
                          title="Mark as complete"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleEditGoal(goal)}
                          className="text-silver-light transition-colors hover:text-silver"
                          title="Edit goal"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="text-red-400 transition-colors hover:text-red-300"
                          title="Delete goal"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {goal.description && (
                      <p className="mb-3 text-sm text-silver-light">{goal.description}</p>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {goal.category && (
                        <span className="rounded-lg bg-titanium-900/50 px-2 py-1 text-xs text-gray-400">
                          {goal.category}
                        </span>
                      )}
                      {goal.target_date && (
                        <span className="flex items-center gap-1 rounded-lg bg-titanium-900/50 px-2 py-1 text-xs text-gray-400">
                          <Calendar className="h-3 w-3" />
                          {new Date(goal.target_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Completed Goals */}
          {completedGoals.length > 0 && (
            <div>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Completed Goals ({completedGoals.length})
              </h2>

              <div className="space-y-4">
                {completedGoals.map((goal) => (
                  <div key={goal.id} className="card opacity-60">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <h3 className="text-lg font-semibold line-through">{goal.title}</h3>
                      <div className="flex items-center gap-2">
                        {goal.completed_at && (
                          <span className="text-xs text-gray-500">
                            Completed{' '}
                            {new Date(goal.completed_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        )}
                        <button
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="text-red-400/60 transition-colors hover:text-red-300"
                          title="Delete goal"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {goal.description && (
                      <p className="text-sm text-silver-light">{goal.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {goals.length === 0 && (
            <div className="card text-center">
              <Target className="mx-auto mb-4 h-16 w-16 text-gray-500" />
              <h3 className="mb-2 text-xl font-semibold">No goals yet</h3>
              <p className="mb-6 text-silver-light">
                Start by adding your first goal to track your progress
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Goal Modal */}
      {showModal && (
        <GoalModal
          goal={editingGoal}
          onClose={() => {
            setShowModal(false)
            setEditingGoal(null)
          }}
          onSave={handleSaveGoal}
        />
      )}
    </div>
  )
}
