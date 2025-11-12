'use client'

import { useEffect, useState } from 'react'
import { Users, ArrowLeft, TrendingUp, MessageSquare, Target } from 'lucide-react'
import Link from 'next/link'

interface User {
  id: string
  email: string
  full_name: string | null
  created_at: string
  onboarding_completed: boolean
  total_conversations: number
  total_messages: number
  last_active: string | null
  avg_sentiment: number
  conversations_last_7_days: number
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (!response.ok) throw new Error('Failed to load users')

      const data = await response.json()
      setUsers(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getSentimentColor = (score: number) => {
    if (score > 0.3) return 'text-green-500'
    if (score < -0.3) return 'text-red-500'
    return 'text-gray-400'
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-titanium-950">
        <div className="text-silver-light">Loading users...</div>
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
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="mb-4 inline-flex items-center gap-2 text-sm text-silver-light hover:text-silver"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Admin Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold">Users</h1>
              <p className="text-silver-light">{users.length} total users</p>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-white">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold">{user.full_name || 'No name'}</div>
                      <div className="text-sm text-silver-light">{user.email}</div>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MessageSquare className="h-4 w-4 text-silver-light" />
                      <span className="text-silver-light">
                        {user.total_conversations} conversations
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="h-4 w-4 text-silver-light" />
                      <span className="text-silver-light">
                        {user.total_messages} messages
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Target className={`h-4 w-4 ${getSentimentColor(user.avg_sentiment)}`} />
                      <span className={getSentimentColor(user.avg_sentiment)}>
                        Sentiment: {user.avg_sentiment > 0 ? '+' : ''}
                        {user.avg_sentiment.toFixed(2)}
                      </span>
                    </div>

                    <div className="text-sm text-silver-light">
                      Active {user.conversations_last_7_days} times this week
                    </div>
                  </div>
                </div>

                <div className="ml-4 text-right">
                  <div className="mb-2 text-xs text-silver-light">Joined</div>
                  <div className="text-sm font-medium">{formatDate(user.created_at)}</div>
                  {user.last_active && (
                    <>
                      <div className="mt-3 text-xs text-silver-light">Last Active</div>
                      <div className="text-sm font-medium">{formatDate(user.last_active)}</div>
                    </>
                  )}
                  {!user.onboarding_completed && (
                    <div className="mt-3 rounded-lg bg-orange-500/10 px-2 py-1 text-xs text-orange-400">
                      Incomplete Onboarding
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {users.length === 0 && (
            <div className="card text-center">
              <div className="py-12">
                <Users className="mx-auto mb-4 h-12 w-12 text-gray-500" />
                <h3 className="mb-2 text-lg font-semibold">No users yet</h3>
                <p className="text-sm text-silver-light">Users will appear here once they sign up</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
