import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const { conversationId, usage } = await req.json()

    if (!conversationId || !usage) {
      return new Response('Missing conversationId or usage', { status: 400 })
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

    // Extract token counts from OpenAI Realtime usage object
    // Usage format: { total_tokens, input_tokens, output_tokens, input_token_details: { text_tokens, audio_tokens }, output_token_details: { text_tokens, audio_tokens } }
    const inputTextTokens = usage.input_token_details?.text_tokens || 0
    const inputAudioTokens = usage.input_token_details?.audio_tokens || 0
    const outputTextTokens = usage.output_token_details?.text_tokens || 0
    const outputAudioTokens = usage.output_token_details?.audio_tokens || 0

    // Calculate total input/output
    const totalInputTokens = inputTextTokens + inputAudioTokens
    const totalOutputTokens = outputTextTokens + outputAudioTokens

    // Calculate cost using database function
    const { data: costData } = await supabase.rpc('calculate_token_cost', {
      p_model: 'gpt-4o-realtime-preview-2024-12-17',
      p_input_tokens: inputTextTokens,
      p_output_tokens: outputTextTokens,
      p_input_audio_tokens: inputAudioTokens,
      p_output_audio_tokens: outputAudioTokens,
    })

    // Save token usage
    await supabase.from('token_usage').insert({
      user_id: user.id,
      conversation_id: conversationId,
      session_type: 'voice',
      model: 'gpt-4o-realtime-preview-2024-12-17',
      input_tokens: inputTextTokens,
      output_tokens: outputTextTokens,
      input_audio_tokens: inputAudioTokens,
      output_audio_tokens: outputAudioTokens,
      total_tokens: usage.total_tokens || (totalInputTokens + totalOutputTokens),
      input_cost: costData?.input_cost || 0,
      output_cost: costData?.output_cost || 0,
      total_cost: costData?.total_cost || 0,
      metadata: { raw_usage: usage },
    })

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('Voice track usage error:', error)
    return new Response(error.message || 'Internal server error', { status: 500 })
  }
}
