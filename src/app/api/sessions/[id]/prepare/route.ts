import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { generatePreparationPrompt } from '@/lib/ai/frameworks'

export async function GET(
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

    // Generate preparation prompt
    const preparationPrompt = generatePreparationPrompt(
      session.framework_used,
      session.goal
    )

    return NextResponse.json({
      preparation: preparationPrompt,
      session,
    })
  } catch (error) {
    console.error('Error in GET /api/sessions/[id]/prepare:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
