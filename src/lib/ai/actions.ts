import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface ActionItem {
  task: string
  description?: string
  priority?: 'low' | 'medium' | 'high'
  due_date?: string
}

/**
 * Extracts action items from a conversation using AI
 * Returns formatted action items ready to be saved to database
 */
export async function extractActionItems(
  conversationId: string,
  userId: string,
  recentMessages: Array<{ role: string; content: string }>
): Promise<ActionItem[]> {
  try {
    // Build conversation history for context
    const conversationText = recentMessages
      .map((msg) => `${msg.role === 'user' ? 'User' : 'Coach'}: ${msg.content}`)
      .join('\n\n')

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Cheaper model for extraction
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant that extracts action items from coaching conversations.

Analyze the conversation and identify clear, actionable commitments or tasks the user mentioned they will do.

ONLY extract items that are:
- Specific actions the user committed to
- Clear next steps mentioned by the user
- Tasks with clear verbs (email, call, review, schedule, etc.)

DO NOT extract:
- Vague ideas or maybes
- Things the coach suggested but user didn't commit to
- General advice or discussion points

Return a JSON array of action items. Each item should have:
- task (required): Clear, actionable task in imperative form
- description (optional): Additional context if needed
- priority (optional): "low", "medium", or "high" based on urgency mentioned
- due_date (optional): ISO date string if a specific deadline was mentioned

If no clear action items exist, return an empty array.`,
        },
        {
          role: 'user',
          content: conversationText,
        },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    })

    const result = JSON.parse(response.choices[0].message.content || '{"actions": []}')
    return result.actions || []
  } catch (error) {
    console.error('Failed to extract action items:', error)
    return []
  }
}

/**
 * Saves action items to the database
 */
export async function saveActionItems(
  conversationId: string,
  userId: string,
  actions: ActionItem[]
): Promise<void> {
  if (actions.length === 0) return

  try {
    const supabase = await createClient()

    const actionRecords = actions.map((action) => ({
      user_id: userId,
      conversation_id: conversationId,
      task: action.task,
      description: action.description,
      priority: action.priority || 'medium',
      due_date: action.due_date,
      status: 'pending',
    }))

    const { error } = await supabase.from('action_items').insert(actionRecords)

    if (error) {
      console.error('Failed to save action items:', error)
    }
  } catch (error) {
    console.error('Error saving action items:', error)
  }
}

/**
 * Formats action items for display in chat
 */
export function formatActionItemsForChat(actions: ActionItem[]): string {
  if (actions.length === 0) return ''

  const items = actions.map((action) => {
    let line = `• ${action.task}`
    if (action.due_date) {
      const date = new Date(action.due_date)
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      line += ` (by ${dateStr})`
    }
    return line
  }).join('\n')

  return `📋 Action Items:\n${items}`
}
