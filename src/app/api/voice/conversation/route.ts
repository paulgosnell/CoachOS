import { createClient } from '@/lib/supabase/server'
import { assembleUserContext } from '@/lib/ai/context'
import { generateSystemPrompt } from '@/lib/ai/prompts'

const ELEVENLABS_AGENT_ID = 'agent_1601k9wcf2dpfwmbdzxqew0f2pjx'

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

    // Check if ElevenLabs API key is configured
    if (!process.env.ELEVENLABS_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'ElevenLabs API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Assemble full user context (profile, goals, business, RAG memories)
    const context = await assembleUserContext(
      user.id,
      '', // No current message for initial setup
      5 // memoryLimit
    )

    // Generate the Coach OS system prompt with full context
    const systemPrompt = generateSystemPrompt(context)
    const firstName = context.profile.fullName.split(' ')[0]

    // Get a signed URL for the agent conversation with prompt override
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${ELEVENLABS_AGENT_ID}`,
      {
        method: 'GET',
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.text()
      console.error('ElevenLabs API error:', errorData)
      throw new Error(`Failed to get signed URL: ${response.status}`)
    }

    const data = await response.json()

    // Return the signed URL and overrides for the frontend
    return new Response(
      JSON.stringify({
        signedUrl: data.signed_url,
        agentId: ELEVENLABS_AGENT_ID,
        overrides: {
          agent: {
            prompt: {
              prompt: systemPrompt,
            },
            firstMessage: `Hey ${firstName}! Ready to dive in?`,
          },
        },
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error: any) {
    console.error('ElevenLabs conversation creation error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
