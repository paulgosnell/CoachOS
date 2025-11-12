import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const goalData = await request.json()

    const { data: goal, error } = await supabase
      .from('goals')
      .insert({
        user_id: user.id,
        title: goalData.title,
        description: goalData.description,
        category: goalData.category,
        priority: goalData.priority || 3,
        target_date: goalData.target_date,
        status: 'active',
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(goal)
  } catch (error: any) {
    console.error('Failed to create goal:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create goal' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const goalData = await request.json()

    if (!goalData.id) {
      return NextResponse.json({ error: 'Goal ID required' }, { status: 400 })
    }

    // Verify the goal belongs to the user
    const { data: existingGoal, error: checkError } = await supabase
      .from('goals')
      .select('id')
      .eq('id', goalData.id)
      .eq('user_id', user.id)
      .single()

    if (checkError || !existingGoal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
    }

    // Update the goal
    const updateData: any = {}
    if (goalData.title !== undefined) updateData.title = goalData.title
    if (goalData.description !== undefined) updateData.description = goalData.description
    if (goalData.category !== undefined) updateData.category = goalData.category
    if (goalData.priority !== undefined) updateData.priority = goalData.priority
    if (goalData.target_date !== undefined) updateData.target_date = goalData.target_date
    if (goalData.status !== undefined) updateData.status = goalData.status
    if (goalData.completed_at !== undefined) updateData.completed_at = goalData.completed_at

    const { data: goal, error } = await supabase
      .from('goals')
      .update(updateData)
      .eq('id', goalData.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(goal)
  } catch (error: any) {
    console.error('Failed to update goal:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update goal' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Goal ID required' }, { status: 400 })
    }

    // Verify the goal belongs to the user and delete
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Failed to delete goal:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete goal' },
      { status: 500 }
    )
  }
}
