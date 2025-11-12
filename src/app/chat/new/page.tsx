import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function NewChatPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Check for most recent conversation (within last 24 hours)
  const oneDayAgo = new Date()
  oneDayAgo.setHours(oneDayAgo.getHours() - 24)

  const { data: recentConversation } = await supabase
    .from('conversations')
    .select('id, created_at')
    .eq('user_id', user.id)
    .eq('session_type', 'quick-checkin')
    .gte('created_at', oneDayAgo.toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  // If there's a recent conversation, redirect to it
  if (recentConversation) {
    redirect(`/chat/${recentConversation.id}`)
  }

  // Otherwise, create a new conversation
  const { data: conversation, error } = await supabase
    .from('conversations')
    .insert({
      user_id: user.id,
      session_type: 'quick-checkin',
      title: 'New Conversation',
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to create conversation:', error)
    redirect('/dashboard')
  }

  // Redirect to the new conversation
  redirect(`/chat/${conversation.id}`)
}
