import { createClient } from '@/lib/supabase/server'
import { extractActionItems, saveActionItems } from '@/lib/ai/actions'

export async function POST(req: Request) {
  try {
    const { conversationId, messages } = await req.json()

    if (!conversationId || !messages) {
      return new Response('Missing conversationId or messages', { status: 400 })
    }

    // Verify authentication
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Verify conversation belongs to user
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('id, user_id')
      .eq('id', conversationId)
      .eq('user_id', user.id)
      .single()

    if (convError || !conversation) {
      return new Response('Conversation not found', { status: 404 })
    }

    // Extract and save action items
    const actions = await extractActionItems(conversationId, user.id, messages)
    await saveActionItems(conversationId, user.id, actions)

    return new Response(
      JSON.stringify({
        success: true,
        actionCount: actions.length,
        actions,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error: any) {
    console.error('Action extraction API error:', error)
    return new Response(error.message || 'Internal server error', { status: 500 })
  }
}
