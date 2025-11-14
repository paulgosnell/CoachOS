import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ActiveSessionClient } from '@/components/sessions/ActiveSessionClient'
import { getFramework } from '@/lib/ai/frameworks'

export default async function ActiveSessionPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get the session
  const { data: session, error } = await supabase
    .from('coaching_sessions')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (error || !session) {
    redirect('/sessions')
  }

  // If session is completed, redirect to summary
  if (session.completed) {
    redirect(`/sessions/${params.id}`)
  }

  let conversationId = session.conversation_id

  // Start the session (create conversation if needed)
  if (!conversationId) {
    const framework = getFramework(session.framework_used)
    const title = session.goal
      ? `${framework.name}: ${session.goal}`
      : `${framework.name} Session`

    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .insert({
        user_id: user.id,
        session_type: 'structured',
        title,
        duration: session.duration_minutes,
        metadata: {
          session_id: session.id,
          framework: session.framework_used,
          current_stage: framework.stages[0].id,
          stage_index: 0,
        },
      })
      .select()
      .single()

    if (convError) {
      console.error('Error creating conversation:', convError)
      redirect('/sessions')
    }

    // Link the conversation to the session
    await supabase
      .from('coaching_sessions')
      .update({ conversation_id: conversation.id })
      .eq('id', session.id)

    conversationId = conversation.id
  }

  if (!conversationId) {
    redirect('/sessions')
  }

  return (
    <ActiveSessionClient sessionId={params.id} conversationId={conversationId} />
  )
}
