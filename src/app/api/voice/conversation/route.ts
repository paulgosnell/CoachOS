import { createClient } from '@/lib/supabase/server'
import { ElevenLabsClient } from 'elevenlabs'
import { assembleUserContext } from '@/lib/ai/context'
import { generateSystemPrompt } from '@/lib/ai/prompts'

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
})

export async function POST(req: Request) {
  try {
    // Verify authentication
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Assemble full user context (profile, goals, business, RAG memories)
    const context = await assembleUserContext(
      user.id,
      '', // No current message for initial setup
      5 // memoryLimit
    )

    // Generate the Coach OS system prompt with full context
    const systemPrompt = generateSystemPrompt(context)

    // Create a conversation with ElevenLabs
    // This returns a signed URL that the frontend can use to connect
    const conversation = await elevenlabs.conversationalAi.createConversation({
      agent: {
        prompt: {
          prompt: systemPrompt,
        },
        first_message: `Hey ${context.profile.fullName.split(' ')[0]}! Ready to dive in?`,
        language: 'en',
        // Use ElevenLabs' premium voice (you can customize this)
        tts: {
          voice_id: '21m00Tcm4TlvDq8ikWAM', // Rachel - professional female voice
        },
      },
    })

    // Return the signed URL for the frontend to connect
    return new Response(
      JSON.stringify({
        signedUrl: conversation.signed_url,
        conversationId: conversation.conversation_id,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error: any) {
    console.error('ElevenLabs conversation creation error:', error)
    return new Response(error.message || 'Internal server error', { status: 500 })
  }
}
