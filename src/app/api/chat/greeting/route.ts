import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { getRelevantContext } from '@/lib/ai/rag'

export const maxDuration = 60

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, business_context')
      .eq('id', user.id)
      .single()

    // Get user's recent goals
    const { data: goals } = await supabase
      .from('goals')
      .select('title, description, category')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('priority', { ascending: true })
      .limit(3)

    // Get relevant context from RAG
    const contextQuery = `Recent session context for ${profile?.full_name || 'user'}`
    const ragContext = await getRelevantContext(user.id, contextQuery)

    // Generate personalized greeting
    const firstName = profile?.full_name?.split(' ')[0] || 'there'

    const prompt = `Generate a brief, natural greeting (2-3 sentences max) for a coaching session.

User context:
- Name: ${firstName}
- Business: ${profile?.business_context || 'Not specified'}
- Active goals: ${goals?.map(g => g.title).join(', ') || 'None set yet'}
- Recent context: ${ragContext.substring(0, 500)}

Guidelines:
- Use their first name naturally
- Reference something specific from their context (a goal, challenge, or recent topic)
- Keep it conversational and warm, not corporate
- End with an open question about what they want to focus on
- 2-3 sentences max
- No emojis`

    const result = await generateText({
      model: openai('gpt-4o'),
      prompt,
      temperature: 0.8,
    })

    return NextResponse.json({
      greeting: result.text.trim(),
    })
  } catch (error: any) {
    console.error('Greeting generation error:', error)
    // Fallback to generic greeting
    return NextResponse.json({
      greeting: "Hey! What would you like to work on today?",
    })
  }
}
