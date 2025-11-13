import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { CoachingFramework } from '@/lib/ai/frameworks'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const includeCompleted = searchParams.get('completed') === 'true'
    const upcoming = searchParams.get('upcoming') === 'true'

    let query = supabase
      .from('coaching_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('scheduled_for', { ascending: true })

    // Filter by completion status
    if (!includeCompleted) {
      query = query.eq('completed', false)
    }

    // Filter for upcoming sessions only
    if (upcoming) {
      query = query.gte('scheduled_for', new Date().toISOString())
    }

    const { data: sessions, error } = await query

    if (error) {
      console.error('Error fetching sessions:', error)
      return NextResponse.json(
        { error: 'Failed to fetch sessions' },
        { status: 500 }
      )
    }

    return NextResponse.json({ sessions })
  } catch (error) {
    console.error('Error in GET /api/sessions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
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
      duration_minutes = 45,
      framework_used = 'grow',
      goal,
    } = body

    // Validate required fields
    if (!scheduled_for) {
      return NextResponse.json(
        { error: 'scheduled_for is required' },
        { status: 400 }
      )
    }

    // Validate framework
    const validFrameworks: CoachingFramework[] = ['grow', 'clear', 'oskar']
    if (!validFrameworks.includes(framework_used)) {
      return NextResponse.json(
        { error: 'Invalid framework. Must be grow, clear, or oskar' },
        { status: 400 }
      )
    }

    // Validate duration
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

    // Create the session
    const { data: session, error } = await supabase
      .from('coaching_sessions')
      .insert({
        user_id: user.id,
        scheduled_for,
        duration_minutes,
        framework_used,
        goal: goal || null,
        completed: false,
        action_items: [],
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating session:', error)
      return NextResponse.json(
        { error: 'Failed to create session' },
        { status: 500 }
      )
    }

    return NextResponse.json({ session }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/sessions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
