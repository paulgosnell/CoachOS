import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * Generates an embedding vector for a given text using OpenAI's text-embedding-3-small model
 * Returns a 1536-dimension vector
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
      encoding_format: 'float',
    })

    return response.data[0].embedding
  } catch (error) {
    console.error('Failed to generate embedding:', error)
    throw error
  }
}

/**
 * Generates embeddings for a message including its context
 * Combines message content with metadata for better semantic search
 */
export async function generateMessageEmbedding(
  messageId: string,
  content: string,
  role: 'user' | 'assistant',
  conversationContext?: string
): Promise<number[]> {
  // Create enriched text for embedding
  // Include role and context to improve semantic matching
  let textToEmbed = `${role === 'user' ? 'User' : 'Coach'}: ${content}`

  if (conversationContext) {
    textToEmbed = `Context: ${conversationContext}\n\n${textToEmbed}`
  }

  return generateEmbedding(textToEmbed)
}

/**
 * Searches for similar messages using vector similarity
 * Returns the most relevant messages from past conversations
 */
export async function searchSimilarMessages(
  userId: string,
  queryEmbedding: number[],
  limit: number = 5,
  excludeConversationId?: string
): Promise<
  Array<{
    id: string
    content: string
    role: 'user' | 'assistant'
    conversationId: string
    similarity: number
    createdAt: Date
  }>
> {
  const supabase = await createClient()

  // Build the query
  let query = supabase.rpc('search_similar_messages', {
    query_embedding: queryEmbedding,
    match_threshold: 0.7, // Only return matches above 70% similarity
    match_count: limit,
    user_id_filter: userId,
  })

  if (excludeConversationId) {
    query = query.neq('conversation_id', excludeConversationId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Failed to search similar messages:', error)
    return []
  }

  return data.map((item: any) => ({
    id: item.message_id,
    content: item.content,
    role: item.role,
    conversationId: item.conversation_id,
    similarity: item.similarity,
    createdAt: new Date(item.created_at),
  }))
}

/**
 * Processes a message to generate and store its embedding
 * Should be called after a message is created
 */
export async function processMessageEmbedding(
  messageId: string,
  conversationId: string,
  userId: string,
  content: string,
  role: 'user' | 'assistant'
): Promise<void> {
  try {
    const supabase = await createClient()

    // Generate embedding
    const embedding = await generateMessageEmbedding(messageId, content, role)

    // Store in conversation_embeddings table
    const { error } = await supabase.from('conversation_embeddings').insert({
      message_id: messageId,
      conversation_id: conversationId,
      user_id: userId,
      embedding,
      content, // Store content for easy retrieval
      role,
    })

    if (error) {
      console.error('Failed to store embedding:', error)
      throw error
    }
  } catch (error) {
    console.error('Failed to process message embedding:', error)
    // Don't throw - embeddings are nice-to-have, not critical
  }
}

/**
 * Batch processes embeddings for existing messages
 * Useful for backfilling embeddings for historical data
 */
export async function batchProcessEmbeddings(
  userId: string,
  limit: number = 100
): Promise<number> {
  const supabase = await createClient()

  // Find messages without embeddings
  const { data: messages } = await supabase
    .from('messages')
    .select('id, conversation_id, content, role, conversations!inner(user_id)')
    .eq('conversations.user_id', userId)
    .not(
      'id',
      'in',
      `(SELECT message_id FROM conversation_embeddings WHERE user_id = '${userId}')`
    )
    .limit(limit)

  if (!messages || messages.length === 0) {
    return 0
  }

  let processed = 0

  for (const message of messages) {
    try {
      await processMessageEmbedding(
        message.id,
        message.conversation_id,
        userId,
        message.content,
        message.role as 'user' | 'assistant'
      )
      processed++
    } catch (error) {
      console.error(`Failed to process message ${message.id}:`, error)
    }
  }

  return processed
}
