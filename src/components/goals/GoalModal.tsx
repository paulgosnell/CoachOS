'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface Goal {
  id?: string
  title: string
  description?: string
  category?: string
  priority?: number
  target_date?: string
}

interface GoalModalProps {
  goal: Goal | null
  onClose: () => void
  onSave: (goal: Partial<Goal>) => void
}

const CATEGORIES = [
  'Revenue',
  'Product',
  'Hiring/Team',
  'Market Expansion',
  'Fundraising',
  'Operations',
  'Personal Development',
  'Other',
]

export function GoalModal({ goal, onClose, onSave }: GoalModalProps) {
  const [title, setTitle] = useState(goal?.title || '')
  const [description, setDescription] = useState(goal?.description || '')
  const [category, setCategory] = useState(goal?.category || '')
  const [priority, setPriority] = useState(goal?.priority?.toString() || '3')
  const [targetDate, setTargetDate] = useState(goal?.target_date?.split('T')[0] || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      alert('Please enter a goal title')
      return
    }

    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      category: category || undefined,
      priority: parseInt(priority),
      target_date: targetDate || undefined,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-xl border border-white/10 bg-titanium-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 p-6">
          <h2 className="text-2xl font-bold text-silver">
            {goal ? 'Edit Goal' : 'New Goal'}
          </h2>
          <button
            onClick={onClose}
            className="text-silver-light transition-colors hover:text-silver"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-medium text-silver">
                Goal Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Launch MVP by end of Q1"
                className="w-full rounded-lg border border-white/10 bg-titanium-800 px-4 py-3 text-silver placeholder:text-gray-500 focus:border-white/20 focus:outline-none"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-silver">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add more details about this goal..."
                rows={3}
                className="w-full rounded-lg border border-white/10 bg-titanium-800 px-4 py-3 text-silver placeholder:text-gray-500 focus:border-white/20 focus:outline-none"
              />
            </div>

            {/* Category & Priority */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-silver">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-titanium-800 px-4 py-3 text-silver focus:border-white/20 focus:outline-none"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-silver">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-titanium-800 px-4 py-3 text-silver focus:border-white/20 focus:outline-none"
                >
                  <option value="1">1 - Highest</option>
                  <option value="2">2 - High</option>
                  <option value="3">3 - Medium</option>
                  <option value="4">4 - Low</option>
                  <option value="5">5 - Lowest</option>
                </select>
              </div>
            </div>

            {/* Target Date */}
            <div>
              <label className="mb-2 block text-sm font-medium text-silver">
                Target Date
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-titanium-800 px-4 py-3 text-silver focus:border-white/20 focus:outline-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-white/10 px-4 py-3 font-medium text-silver transition-colors hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-deep-blue-700 px-4 py-3 font-medium text-silver transition-colors hover:bg-deep-blue-600"
            >
              {goal ? 'Save Changes' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
