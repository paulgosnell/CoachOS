'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Check, Circle, Calendar, Flag, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Task {
  id: string
  task: string
  description: string | null
  status: string
  priority: string
  due_date: string | null
  created_at: string
}

interface TaskListProps {
  tasks: Task[]
}

const priorityColors: Record<string, string> = {
  high: 'text-red-400',
  medium: 'text-yellow-400',
  low: 'text-green-400',
}

const priorityLabels: Record<string, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

export function TaskList({ tasks }: TaskListProps) {
  const [updating, setUpdating] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const toggleTask = async (taskId: string, currentStatus: string) => {
    setUpdating(taskId)
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed'

    try {
      const { error } = await supabase
        .from('action_items')
        .update({
          status: newStatus,
          completed_at: newStatus === 'completed' ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', taskId)

      if (error) {
        console.error('Error updating task:', error)
      } else {
        router.refresh()
      }
    } catch (err) {
      console.error('Failed to update task:', err)
    } finally {
      setUpdating(null)
    }
  }

  const deleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return

    setUpdating(taskId)
    try {
      const { error } = await supabase
        .from('action_items')
        .delete()
        .eq('id', taskId)

      if (error) {
        console.error('Error deleting task:', error)
      } else {
        router.refresh()
      }
    } catch (err) {
      console.error('Failed to delete task:', err)
    } finally {
      setUpdating(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`group rounded-xl border border-white/10 bg-titanium-900/50 p-4 transition-all hover:border-white/20 ${
            task.status === 'completed' ? 'opacity-60' : ''
          }`}
        >
          <div className="flex items-start gap-3">
            {/* Checkbox */}
            <button
              onClick={() => toggleTask(task.id, task.status)}
              disabled={updating === task.id}
              className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border transition-all ${
                task.status === 'completed'
                  ? 'border-deep-blue-600 bg-deep-blue-600 text-white'
                  : 'border-silver-dark hover:border-deep-blue-600'
              } ${updating === task.id ? 'opacity-50' : ''}`}
            >
              {task.status === 'completed' ? (
                <Check className="h-3 w-3" />
              ) : (
                <Circle className="h-3 w-3 opacity-0 group-hover:opacity-30" />
              )}
            </button>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <p
                className={`font-medium ${
                  task.status === 'completed'
                    ? 'text-silver-dark line-through'
                    : 'text-silver-light'
                }`}
              >
                {task.task}
              </p>

              {task.description && (
                <p className="mt-1 text-sm text-silver-dark line-clamp-2">
                  {task.description}
                </p>
              )}

              {/* Meta info */}
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-silver-dark">
                {task.priority && (
                  <span className={`flex items-center gap-1 ${priorityColors[task.priority]}`}>
                    <Flag className="h-3 w-3" />
                    {priorityLabels[task.priority]}
                  </span>
                )}

                {task.due_date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(task.due_date)}
                  </span>
                )}

                <span className="text-silver-dark/50">
                  Added {formatDate(task.created_at)}
                </span>
              </div>
            </div>

            {/* Delete button */}
            <button
              onClick={() => deleteTask(task.id)}
              disabled={updating === task.id}
              className="flex-shrink-0 rounded-lg p-2 text-silver-dark opacity-0 transition-all hover:bg-white/5 hover:text-red-400 group-hover:opacity-100"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
