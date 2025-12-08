import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'
import { generateEmbedding } from './embeddings'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface ConversationSummary {
  id: string
  conversation_id: string
  user_id: string
  summary: string
  key_topics: string[]
  decisions_made: string[]
  action_items_discussed: string[]
  goals_referenced: string[]
  blockers_identified: string[]
  breakthroughs: string[]
  patterns_noticed: string[]
  user_state: string | null
  coaching_approach_used: string | null
  session_value: string | null
  message_count: number
  generated_at: string
}

/**
 * Generates a comprehensive summary of a conversation
 * Designed for MemoryOS - captures key insights for long-term retrieval
 */
export async function generateConversationSummary(
  conversationId: string
): Promise<ConversationSummary | null> {
  const supabase = await createClient()

  // Get conversation and messages
  const { data: conversation, error: convError } = await supabase
    .from('conversations')
    .select('id, user_id, title, session_type, started_at')
    .eq('id', conversationId)
    .single()

  if (convError || !conversation) {
    console.error('Conversation not found:', convError)
    return null
  }

  const { data: messages, error: msgError } = await supabase
    .from('messages')
    .select('role, content, created_at')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (msgError || !messages || messages.length === 0) {
    console.error('No messages found:', msgError)
    return null
  }

  // Get user's goals for context
  const { data: goals } = await supabase
    .from('goals')
    .select('title')
    .eq('user_id', conversation.user_id)
    .eq('status', 'active')
    .limit(5)

  const goalsContext = goals?.map(g => g.title).join(', ') || 'None set'

  // Build transcript
  const transcript = messages
    .map(m => `${m.role === 'user' ? 'User' : 'Coach'}: ${m.content}`)
    .join('\n\n')

  // Generate summary using GPT
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are analyzing a coaching conversation for long-term memory storage. Extract comprehensive insights that will be useful for the AI coach to reference in future sessions.

The user's active goals are: ${goalsContext}

Your response must be valid JSON with this exact structure:
{
  "summary": "3-5 sentence overview capturing the essence of the conversation - what was discussed, what was achieved, what matters",
  "key_topics": ["topic1", "topic2", "topic3"],
  "decisions_made": ["decision1", "decision2"],
  "action_items_discussed": ["task1", "task2"],
  "goals_referenced": ["any goals mentioned or worked on"],
  "blockers_identified": ["obstacles, challenges, things in the way"],
  "breakthroughs": ["aha moments, realizations, shifts in thinking"],
  "patterns_noticed": ["recurring themes, behaviors, tendencies observed"],
  "user_state": "one word describing user's emotional/energy state: struggling | energized | confused | focused | overwhelmed | motivated | stuck | reflective",
  "coaching_approach_used": "primary approach: support | challenge | strategic | tactical | exploratory | celebratory",
  "session_value": "one sentence on what value the user got from this session"
}

Be specific and concrete. These summaries will be retrieved months later to remind the coach what was discussed.`
      },
      {
        role: 'user',
        content: `Analyze this coaching conversation:\n\n${transcript}`
      }
    ],
    temperature: 0.3,
    response_format: { type: 'json_object' }
  })

  const result = JSON.parse(response.choices[0].message.content || '{}')

  // Generate embedding for the summary (for semantic search later)
  const embeddingText = `${result.summary} Topics: ${result.key_topics?.join(', ')} Decisions: ${result.decisions_made?.join(', ')} Breakthroughs: ${result.breakthroughs?.join(', ')}`
  let embedding = null
  try {
    embedding = await generateEmbedding(embeddingText)
  } catch (e) {
    console.error('Failed to generate embedding:', e)
  }

  // Store in database
  const { data: summary, error: insertError } = await supabase
    .from('conversation_summaries')
    .upsert({
      conversation_id: conversationId,
      user_id: conversation.user_id,
      summary: result.summary || 'No summary generated',
      key_topics: result.key_topics || [],
      decisions_made: result.decisions_made || [],
      action_items_discussed: result.action_items_discussed || [],
      goals_referenced: result.goals_referenced || [],
      blockers_identified: result.blockers_identified || [],
      breakthroughs: result.breakthroughs || [],
      patterns_noticed: result.patterns_noticed || [],
      user_state: result.user_state || null,
      coaching_approach_used: result.coaching_approach_used || null,
      session_value: result.session_value || null,
      embedding,
      message_count: messages.length,
      generated_at: new Date().toISOString(),
      model_used: 'gpt-4o-mini',
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'conversation_id'
    })
    .select()
    .single()

  if (insertError) {
    console.error('Failed to store summary:', insertError)
    return null
  }

  return summary
}

/**
 * Get existing summary for a conversation
 */
export async function getConversationSummary(
  conversationId: string
): Promise<ConversationSummary | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('conversation_summaries')
    .select('*')
    .eq('conversation_id', conversationId)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

/**
 * Get recent summaries for a user (for MemoryOS context)
 */
export async function getRecentConversationSummaries(
  userId: string,
  limit: number = 10
): Promise<ConversationSummary[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('conversation_summaries')
    .select('*')
    .eq('user_id', userId)
    .order('generated_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Failed to fetch summaries:', error)
    return []
  }

  return data || []
}

/**
 * Search summaries by semantic similarity
 */
export async function searchSummaries(
  userId: string,
  queryEmbedding: number[],
  limit: number = 5,
  threshold: number = 0.7
): Promise<Array<ConversationSummary & { similarity: number }>> {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc('match_conversation_summaries', {
    query_embedding: queryEmbedding,
    match_user_id: userId,
    match_threshold: threshold,
    match_count: limit
  })

  if (error) {
    console.error('Failed to search summaries:', error)
    return []
  }

  return data || []
}
