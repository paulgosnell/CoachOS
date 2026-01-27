import { createClient } from '@/lib/supabase/server'
import { assembleUserContextWithRAG } from '@/lib/ai/context'
import { generateSystemPrompt } from '@/lib/ai/prompts'
import { generateADHDCoachPrompt } from '@/lib/ai/prompts-adhd'
import { generateLifeCoachPrompt } from '@/lib/ai/prompts-life'
import { generateADHDLifeCoachPrompt } from '@/lib/ai/prompts-adhd-life'
import { normalizeCoachType, CoachType } from '@/lib/ai/coach-types'
import { processMessageEmbedding } from '@/lib/memory/embeddings'
import { extractActionItems, saveActionItems } from '@/lib/ai/actions'
import { generateConversationSummary, getConversationSummary } from '@/lib/memory/conversation-summary'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { UserContext } from '@/lib/ai/context'

// Generate summary every N messages to capture key moments
const SUMMARY_THRESHOLD = 10

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

/**
 * Get the appropriate system prompt based on coach type
 */
function getSystemPromptForCoachType(coachType: CoachType, context: UserContext): string {
  switch (coachType) {
    case 'business':
      return generateSystemPrompt(context)
    case 'adhd-business':
      return generateADHDCoachPrompt(context)
    case 'life':
      return generateLifeCoachPrompt(context)
    case 'adhd-life':
      return generateADHDLifeCoachPrompt(context)
    default:
      return generateSystemPrompt(context)
  }
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')

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

    // Get user's coach type preference
    const { data: profile } = await supabase
      .from('profiles')
      .select('coach_preference')
      .eq('id', user.id)
      .single()

    const coachType = normalizeCoachType(profile?.coach_preference?.coach_type)

    // Assemble user context with RAG (semantic search for relevant past conversations)
    const context = await assembleUserContextWithRAG(user.id, conversationId, message, 20, 5)

    // Generate system prompt based on coach type
    const systemPrompt = getSystemPromptForCoachType(coachType, context)

    // Prepare chat history for Gemini
    // Gemini requires first message to be from 'user', so filter out any leading assistant messages
    let historyStartIndex = 0
    for (let i = 0; i < context.recentHistory.length; i++) {
      if (context.recentHistory[i].role === 'user') {
        historyStartIndex = i
        break
      }
    }
    const validHistory = context.recentHistory.slice(historyStartIndex)

    const chatHistory = validHistory.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }))

    // Initialize Gemini model with system instruction
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: systemPrompt,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    })

    // Start chat with history
    const chat = model.startChat({
      history: chatHistory,
    })

    // Stream the response
    const result = await chat.sendMessageStream(message)

    // Create a streaming response
    let fullResponse = ''
    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      async start(controller) {
        let inputTokens = 0
        let outputTokens = 0

        for await (const chunk of result.stream) {
          const content = chunk.text()
          if (content) {
            fullResponse += content
            // Send chunk in streaming format using JSON.stringify for proper escaping
            controller.enqueue(encoder.encode(`0:${JSON.stringify(content)}\n`))
          }

          // Try to get usage metadata from chunk
          if (chunk.usageMetadata) {
            inputTokens = chunk.usageMetadata.promptTokenCount || 0
            outputTokens = chunk.usageMetadata.candidatesTokenCount || 0
          }
        }

        // Get final usage from response
        const response = await result.response
        if (response.usageMetadata) {
          inputTokens = response.usageMetadata.promptTokenCount || 0
          outputTokens = response.usageMetadata.candidatesTokenCount || 0
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

          // Track token usage
          if (inputTokens > 0 || outputTokens > 0) {
            try {
              // Calculate cost for Gemini 2.5 Flash
              // Pricing: $0.30/1M input, $2.50/1M output (non-thinking mode)
              const inputCost = (inputTokens / 1_000_000) * 0.30
              const outputCost = (outputTokens / 1_000_000) * 2.50
              const totalCost = inputCost + outputCost

              // Save token usage
              await supabase.from('token_usage').insert({
                user_id: user.id,
                conversation_id: conversationId,
                message_id: assistantMessage?.id,
                session_type: 'chat',
                model: 'gemini-2.5-flash',
                input_tokens: inputTokens,
                output_tokens: outputTokens,
                total_tokens: inputTokens + outputTokens,
                input_cost: inputCost,
                output_cost: outputCost,
                total_cost: totalCost,
              })
            } catch (err) {
              console.error('Failed to track token usage:', err)
            }
          }

          // Check if response contains action items (📋 emoji indicates action items)
          if (fullResponse.includes('📋')) {
            // Extract and save action items from the conversation
            const recentMessages = [
              ...context.recentHistory.slice(-5), // Last 5 messages for context
              { role: 'user', content: message },
              { role: 'assistant', content: fullResponse },
            ]

            extractActionItems(conversationId, user.id, recentMessages)
              .then((actions) => saveActionItems(conversationId, user.id, actions))
              .catch((err) => console.error('Failed to extract/save action items:', err))
          }

          // MemoryOS: Generate summary periodically to capture key moments
          // This ensures no breakthrough, decision, or pattern is lost
          try {
            // Get current message count
            const { count: messageCount } = await supabase
              .from('messages')
              .select('*', { count: 'exact', head: true })
              .eq('conversation_id', conversationId)

            // Check if we have an existing summary
            const existingSummary = await getConversationSummary(conversationId)
            const lastSummaryCount = existingSummary?.message_count || 0

            // Generate new summary if we've had enough new messages since last summary
            if (messageCount && (messageCount - lastSummaryCount) >= SUMMARY_THRESHOLD) {
              console.log(`[MemoryOS] Generating summary for conversation ${conversationId} (${messageCount} messages, last summary at ${lastSummaryCount})`)
              generateConversationSummary(conversationId)
                .then((summary) => {
                  if (summary) {
                    console.log(`[MemoryOS] Summary generated:`, {
                      topics: summary.key_topics?.length || 0,
                      decisions: summary.decisions_made?.length || 0,
                      breakthroughs: summary.breakthroughs?.length || 0,
                    })
                  }
                })
                .catch((err) => console.error('[MemoryOS] Failed to generate summary:', err))
            }
          } catch (err) {
            console.error('[MemoryOS] Summary check failed:', err)
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
