import { createClient } from '@/lib/supabase/server'
import { assembleUserContextWithRAG } from '@/lib/ai/context'
import { generateSystemPrompt } from '@/lib/ai/prompts'
import { processMessageEmbedding } from '@/lib/memory/embeddings'
import OpenAI from 'openai'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { conversationId, message } = await req.json()

    if (!conversationId || !message) {
      return new Response('Missing conversationId or message', { status: 400 })
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

    // Save user message to database
    const { data: userMessage, error: userMsgError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        user_id: user.id,
        role: 'user',
        content: message,
      })
      .select()
      .single()

    if (userMsgError) {
      console.error('Failed to save user message:', userMsgError)
      return new Response('Failed to save message', { status: 500 })
    }

    // Generate embedding for user message (async, don't await)
    if (userMessage) {
      processMessageEmbedding(
        userMessage.id,
        conversationId,
        user.id,
        message,
        'user'
      ).catch((err) => console.error('Failed to process user message embedding:', err))
    }

    // Assemble user context with RAG (semantic search for relevant past conversations)
    const context = await assembleUserContextWithRAG(user.id, conversationId, message, 20, 5)

    // Generate system prompt
    const systemPrompt = generateSystemPrompt(context)

    // Prepare messages for OpenAI
    const messages = [
      {
        role: 'system' as const,
        content: systemPrompt,
      },
      ...context.recentHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      {
        role: 'user' as const,
        content: message,
      },
    ]

    // Call OpenAI with streaming
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: 0.7,
      max_tokens: 1000,
      stream: true,
    })

    // Create a streaming response
    let fullResponse = ''
    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || ''
          if (content) {
            fullResponse += content
            // Send chunk in streaming format
            controller.enqueue(encoder.encode(`0:"${content}"\n`))
          }
        }

        // Save complete response to database
        try {
          const { data: assistantMessage } = await supabase
            .from('messages')
            .insert({
              conversation_id: conversationId,
              user_id: user.id,
              role: 'assistant',
              content: fullResponse,
            })
            .select()
            .single()

          // Update conversation timestamp
          await supabase
            .from('conversations')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', conversationId)

          // Generate embedding for assistant message (async, don't await)
          if (assistantMessage) {
            processMessageEmbedding(
              assistantMessage.id,
              conversationId,
              user.id,
              fullResponse,
              'assistant'
            ).catch((err) => console.error('Failed to process assistant message embedding:', err))
          }
        } catch (error) {
          console.error('Failed to save assistant message:', error)
        }

        controller.close()
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    })
  } catch (error: any) {
    console.error('Chat API error:', error)
    return new Response(error.message || 'Internal server error', { status: 500 })
  }
}
