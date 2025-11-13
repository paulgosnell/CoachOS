import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ActiveSessionClient } from '@/components/sessions/ActiveSessionClient'

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

  // Start the session (creates conversation if needed)
  const startResponse = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/sessions/${params.id}/start`,
    {
      method: 'POST',
      headers: {
        Cookie: `sb-access-token=${(await supabase.auth.getSession()).data.session?.access_token}; sb-refresh-token=${(await supabase.auth.getSession()).data.session?.refresh_token}`,
      },
    }
  )

  let conversationId = session.conversation_id

  if (startResponse.ok) {
    const data = await startResponse.json()
    conversationId = data.conversation_id
  }

  if (!conversationId) {
    redirect('/sessions')
  }

  return (
    <ActiveSessionClient sessionId={params.id} conversationId={conversationId} />
  )
}
