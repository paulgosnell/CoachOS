import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getFramework } from '@/lib/ai/frameworks'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the session
    const { data: session, error: sessionError } = await supabase
      .from('coaching_sessions')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    if (session.completed) {
      return NextResponse.json(
        { error: 'Session already completed' },
        { status: 400 }
      )
    }

    // Check if session already has a conversation
    if (session.conversation_id) {
      return NextResponse.json({
        session,
        conversation_id: session.conversation_id,
      })
    }

    // Create a new conversation for this session
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
      })
      .select()
      .single()

    if (convError) {
      console.error('Error creating conversation:', convError)
      return NextResponse.json(
        { error: 'Failed to create conversation' },
        { status: 500 }
      )
    }

    // Link the conversation to the session
    const { error: updateError } = await supabase
      .from('coaching_sessions')
      .update({ conversation_id: conversation.id })
      .eq('id', session.id)

    if (updateError) {
      console.error('Error linking conversation to session:', updateError)
    }

    return NextResponse.json({
      session: { ...session, conversation_id: conversation.id },
      conversation_id: conversation.id,
    })
  } catch (error) {
    console.error('Error in POST /api/sessions/[id]/start:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
