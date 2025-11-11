import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MessageSquare } from 'lucide-react'

export default async function ChatIndexPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Check if user has completed onboarding
  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_completed')
    .eq('id', user.id)
    .single()

  if (!profile?.onboarding_completed) {
    redirect('/onboarding')
  }

  // Try to get the most recent conversation
  const { data: recentConversation } = await supabase
    .from('conversations')
    .select('id')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()

  // If there's a recent conversation, redirect to it
  if (recentConversation) {
    redirect(`/chat/${recentConversation.id}`)
  }

  // Otherwise, show empty state
  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-deep-blue-800 to-silver-darker">
          <MessageSquare className="h-10 w-10 text-silver" />
        </div>

        <h1 className="mb-3 text-2xl font-bold">Start a conversation</h1>
        <p className="mb-6 text-silver-light">
          Click "New Conversation" to begin your coaching session
        </p>

        <div className="rounded-2xl border border-white/5 bg-titanium-900/50 p-6 text-left">
          <h3 className="mb-3 font-semibold">💡 What you can ask</h3>
          <ul className="space-y-2 text-sm text-silver-light">
            <li>• Get strategic advice on your current challenges</li>
            <li>• Work through decisions with structured frameworks</li>
            <li>• Review progress on your goals</li>
            <li>• Plan your week or quarter ahead</li>
            <li>• Get accountability check-ins</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
