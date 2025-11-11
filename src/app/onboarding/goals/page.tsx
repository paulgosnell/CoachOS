'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Loader2, Plus, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Goal {
  title: string
  description: string
  category: string
  priority: number
  targetDate: string
}

export default function GoalsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [goals, setGoals] = useState<Goal[]>([
    {
      title: '',
      description: '',
      category: '',
      priority: 1,
      targetDate: '',
    },
  ])

  const addGoal = () => {
    setGoals([
      ...goals,
      {
        title: '',
        description: '',
        category: '',
        priority: goals.length + 1,
        targetDate: '',
      },
    ])
  }

  const removeGoal = (index: number) => {
    if (goals.length > 1) {
      setGoals(goals.filter((_, i) => i !== index))
    }
  }

  const updateGoal = (index: number, field: keyof Goal, value: string | number) => {
    const newGoals = [...goals]
    newGoals[index] = {
      ...newGoals[index],
      [field]: value,
    }
    setGoals(newGoals)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Filter out empty goals
      const validGoals = goals.filter((goal) => goal.title.trim() !== '')

      if (validGoals.length === 0) {
        throw new Error('Please add at least one goal')
      }

      // Save goals
      const goalsToInsert = validGoals.map((goal) => ({
        user_id: user.id,
        title: goal.title,
        description: goal.description || null,
        category: goal.category || null,
        priority: goal.priority,
        target_date: goal.targetDate || null,
        status: 'active',
      }))

      const { error: goalsError } = await supabase.from('goals').insert(goalsToInsert)

      if (goalsError) throw goalsError

      // Mark onboarding as completed
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', user.id)

      if (profileError) throw profileError

      // Navigate to completion
      router.push('/onboarding/complete')
    } catch (err: any) {
      console.error('Error saving goals:', err)
      setError(err.message || 'Failed to save goals')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">What are your top priorities?</h1>
        <p className="text-silver-light">
          Share 3-5 goals you want to focus on. I'll help you make progress on each one.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Goals List */}
        {goals.map((goal, index) => (
          <div key={index} className="card-elevated relative">
            {/* Remove Button */}
            {goals.length > 1 && (
              <button
                type="button"
                onClick={() => removeGoal(index)}
                className="absolute right-4 top-4 rounded-lg p-2 text-gray-500 transition-colors hover:bg-titanium-900 hover:text-red-400"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {/* Goal Number */}
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-deep-blue-800 text-sm font-semibold">
                {index + 1}
              </div>
              <h3 className="text-lg font-semibold">Goal {index + 1}</h3>
            </div>

            <div className="space-y-4">
              {/* Goal Title */}
              <div>
                <label
                  htmlFor={`goal-title-${index}`}
                  className="mb-2 block text-sm font-medium text-silver-light"
                >
                  What do you want to achieve? <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id={`goal-title-${index}`}
                  value={goal.title}
                  onChange={(e) => updateGoal(index, 'title', e.target.value)}
                  required
                  className="input"
                  placeholder="e.g., Reach £1M ARR"
                />
              </div>

              {/* Goal Description */}
              <div>
                <label
                  htmlFor={`goal-description-${index}`}
                  className="mb-2 block text-sm font-medium text-silver-light"
                >
                  More details <span className="text-xs text-gray-500">(optional)</span>
                </label>
                <textarea
                  id={`goal-description-${index}`}
                  value={goal.description}
                  onChange={(e) => updateGoal(index, 'description', e.target.value)}
                  rows={2}
                  className="input"
                  placeholder="What does success look like? Any specific milestones?"
                />
              </div>

              {/* Category & Target Date */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor={`goal-category-${index}`}
                    className="mb-2 block text-sm font-medium text-silver-light"
                  >
                    Category <span className="text-xs text-gray-500">(optional)</span>
                  </label>
                  <select
                    id={`goal-category-${index}`}
                    value={goal.category}
                    onChange={(e) => updateGoal(index, 'category', e.target.value)}
                    className="input"
                  >
                    <option value="">Select category</option>
                    <option value="revenue">Revenue</option>
                    <option value="product">Product</option>
                    <option value="hiring">Hiring / Team</option>
                    <option value="market_expansion">Market Expansion</option>
                    <option value="fundraising">Fundraising</option>
                    <option value="operations">Operations</option>
                    <option value="personal">Personal Development</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor={`goal-target-${index}`}
                    className="mb-2 block text-sm font-medium text-silver-light"
                  >
                    Target Date <span className="text-xs text-gray-500">(optional)</span>
                  </label>
                  <input
                    type="date"
                    id={`goal-target-${index}`}
                    value={goal.targetDate}
                    onChange={(e) => updateGoal(index, 'targetDate', e.target.value)}
                    className="input"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add Goal Button */}
        {goals.length < 5 && (
          <button
            type="button"
            onClick={addGoal}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-700 py-4 text-silver-light transition-colors hover:border-silver hover:text-white"
          >
            <Plus className="h-5 w-5" />
            Add Another Goal
          </button>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn btn-ghost"
            disabled={loading}
          >
            ← Back
          </button>

          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Complete Setup
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Tips */}
      <div className="mt-8 rounded-2xl border border-white/5 bg-titanium-900/50 p-6">
        <h4 className="mb-3 font-semibold">💡 Tips for setting goals</h4>
        <ul className="space-y-2 text-sm text-silver-light">
          <li>• Be specific: "Reach £1M ARR" beats "Grow revenue"</li>
          <li>• Set realistic timelines: What can you achieve in 3-6 months?</li>
          <li>• Focus on what matters: 3-5 priorities are better than 20</li>
          <li>• Track progress: I'll help you stay accountable to these goals</li>
        </ul>
      </div>
    </div>
  )
}
