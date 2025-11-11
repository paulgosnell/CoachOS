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

  // Create a new conversation
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
