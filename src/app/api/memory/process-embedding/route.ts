import { createClient } from '@/lib/supabase/server'
import { processMessageEmbedding } from '@/lib/memory/embeddings'

/**
 * API route to process embeddings for messages
 * Can be called after a message is created to generate its embedding
 * In production, this would be a background job or webhook
 */
export async function POST(req: Request) {
  try {
    const { messageId, conversationId, userId, content, role } = await req.json()

    if (!messageId || !conversationId || !userId || !content || !role) {
      return new Response('Missing required fields', { status: 400 })
    }

    // Verify authentication
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user || user.id !== userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Process embedding
    await processMessageEmbedding(messageId, conversationId, userId, content, role)

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('Failed to process embedding:', error)
    return new Response(error.message || 'Internal server error', { status: 500 })
  }
}
