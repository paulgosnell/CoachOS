import { createClient } from '@/lib/supabase/server'
import { generateConversationSummary } from '@/lib/memory/conversation-summary'

/**
 * POST /api/conversations/[id]/summarize
 *
 * Generates a MemoryOS summary for a conversation.
 * Called automatically when voice/chat sessions end.
 *
 * This is CRITICAL for coaching continuity - without summaries,
 * the coach cannot remember previous sessions and users have to repeat themselves.
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()

    // Verify authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const { id: conversationId } = await params

    // Verify the conversation belongs to this user
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('id, user_id, ended_at')
      .eq('id', conversationId)
      .single()

    if (convError || !conversation) {
      return new Response(JSON.stringify({ error: 'Conversation not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (conversation.user_id !== user.id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Check if conversation has enough messages to summarize
    const { count } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('conversation_id', conversationId)

    if (!count || count < 2) {
      return new Response(JSON.stringify({
        success: false,
        reason: 'Not enough messages to summarize',
        messageCount: count || 0
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Generate the summary - this extracts all the key moments, patterns, decisions
    console.log(`[MemoryOS] Generating summary for conversation ${conversationId} (${count} messages)`)
    const summary = await generateConversationSummary(conversationId)

    if (!summary) {
      console.error(`[MemoryOS] Failed to generate summary for conversation ${conversationId}`)
      return new Response(JSON.stringify({
        success: false,
        reason: 'Summary generation failed'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    console.log(`[MemoryOS] Summary generated for conversation ${conversationId}:`, {
      topics: summary.key_topics?.length || 0,
      decisions: summary.decisions_made?.length || 0,
      breakthroughs: summary.breakthroughs?.length || 0,
      patterns: summary.patterns_noticed?.length || 0,
      userState: summary.user_state
    })

    return new Response(JSON.stringify({
      success: true,
      summary: {
        id: summary.id,
        topics: summary.key_topics,
        decisions: summary.decisions_made,
        breakthroughs: summary.breakthroughs,
        patterns: summary.patterns_noticed,
        userState: summary.user_state
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error: any) {
    console.error('[MemoryOS] Summary generation error:', error)
    return new Response(JSON.stringify({
      error: error.message || 'Failed to generate summary'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
