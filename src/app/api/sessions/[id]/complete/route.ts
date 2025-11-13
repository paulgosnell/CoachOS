import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import {
  generateSessionSummaryPrompt,
  extractSessionActionItems,
} from '@/lib/ai/frameworks'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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

    const body = await request.json()
    const { rating } = body

    // Validate rating
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
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

    if (!session.conversation_id) {
      return NextResponse.json(
        { error: 'Session has no associated conversation' },
        { status: 400 }
      )
    }

    // Get all messages from the conversation
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('role, content')
      .eq('conversation_id', session.conversation_id)
      .order('created_at', { ascending: true })

    if (messagesError) {
      console.error('Error fetching messages:', messagesError)
      return NextResponse.json(
        { error: 'Failed to fetch conversation messages' },
        { status: 500 }
      )
    }

    // Generate session summary using AI
    let outcome_summary = ''
    let action_items: any[] = []

    try {
      // Generate summary
      const summaryPrompt = generateSessionSummaryPrompt(
        session.framework_used,
        messages
      )

      const summaryResponse = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: summaryPrompt,
          },
        ],
        temperature: 0.7,
      })

      outcome_summary =
        summaryResponse.choices[0]?.message?.content || 'Summary not available'

      // Extract action items
      const actionItemsPrompt = extractSessionActionItems(messages)

      const actionItemsResponse = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: actionItemsPrompt,
          },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      })

      const actionItemsText =
        actionItemsResponse.choices[0]?.message?.content || '[]'
      const parsedActionItems = JSON.parse(actionItemsText)
      action_items = Array.isArray(parsedActionItems)
        ? parsedActionItems
        : parsedActionItems.action_items || []

      // Also save action items to the action_items table
      if (action_items.length > 0) {
        const actionItemsToInsert = action_items.map((item: any) => ({
          user_id: user.id,
          conversation_id: session.conversation_id,
          title: item.title,
          description: item.description || item.title,
          due_date: item.due_date || null,
          category: item.category || 'business',
          completed: false,
        }))

        const { error: actionItemsError } = await supabase
          .from('action_items')
          .insert(actionItemsToInsert)

        if (actionItemsError) {
          console.error('Error saving action items:', actionItemsError)
        }
      }
    } catch (aiError) {
      console.error('Error generating summary or action items:', aiError)
      // Continue anyway - we'll mark as complete even if AI processing fails
      outcome_summary = 'Summary generation failed - please review the conversation manually.'
    }

    // Update the session as completed
    const { data: updatedSession, error: updateError } = await supabase
      .from('coaching_sessions')
      .update({
        completed: true,
        outcome_summary,
        action_items,
        rating: rating || null,
      })
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error completing session:', updateError)
      return NextResponse.json(
        { error: 'Failed to complete session' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      session: updatedSession,
      summary: outcome_summary,
      action_items,
    })
  } catch (error) {
    console.error('Error in POST /api/sessions/[id]/complete:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
