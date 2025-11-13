import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { CoachingFramework } from '@/lib/ai/frameworks'

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

    const { data: session, error } = await supabase
      .from('coaching_sessions')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (error || !session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // If the session has a conversation, fetch it too
    let conversation = null
    if (session.conversation_id) {
      const { data: conv } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', session.conversation_id)
        .single()

      conversation = conv
    }

    return NextResponse.json({ session, conversation })
  } catch (error) {
    console.error('Error in GET /api/sessions/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
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

    const body = await request.json()
    const {
      scheduled_for,
      duration_minutes,
      framework_used,
      goal,
      outcome_summary,
      action_items,
      rating,
      completed,
    } = body

    // Validate framework if provided
    if (framework_used) {
      const validFrameworks: CoachingFramework[] = ['grow', 'clear', 'oskar']
      if (!validFrameworks.includes(framework_used)) {
        return NextResponse.json(
          { error: 'Invalid framework. Must be grow, clear, or oskar' },
          { status: 400 }
        )
      }
    }

    // Validate duration if provided
    if (duration_minutes) {
      if (
        duration_minutes < 15 ||
        duration_minutes > 120 ||
        duration_minutes % 15 !== 0
      ) {
        return NextResponse.json(
          {
            error:
              'Duration must be between 15 and 120 minutes in 15-minute increments',
          },
          { status: 400 }
        )
      }
    }

    // Validate rating if provided
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Build update object
    const updates: any = {}
    if (scheduled_for !== undefined) updates.scheduled_for = scheduled_for
    if (duration_minutes !== undefined)
      updates.duration_minutes = duration_minutes
    if (framework_used !== undefined) updates.framework_used = framework_used
    if (goal !== undefined) updates.goal = goal
    if (outcome_summary !== undefined) updates.outcome_summary = outcome_summary
    if (action_items !== undefined) updates.action_items = action_items
    if (rating !== undefined) updates.rating = rating
    if (completed !== undefined) updates.completed = completed

    const { data: session, error } = await supabase
      .from('coaching_sessions')
      .update(updates)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error || !session) {
      console.error('Error updating session:', error)
      return NextResponse.json(
        { error: 'Failed to update session' },
        { status: 500 }
      )
    }

    return NextResponse.json({ session })
  } catch (error) {
    console.error('Error in PATCH /api/sessions/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    // Only allow deleting sessions that haven't been completed
    const { data: session } = await supabase
      .from('coaching_sessions')
      .select('completed')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    if (session.completed) {
      return NextResponse.json(
        { error: 'Cannot delete completed sessions' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('coaching_sessions')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting session:', error)
      return NextResponse.json(
        { error: 'Failed to delete session' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/sessions/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
