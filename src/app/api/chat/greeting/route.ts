import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { assembleUserContext } from '@/lib/ai/context'
import OpenAI from 'openai'

export const maxDuration = 60

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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
      .select('full_name')
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

    // Get recent conversation context
    const { data: recentMessages } = await supabase
      .from('messages')
      .select('content, role, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)

    // Generate personalized greeting
    const firstName = profile?.full_name?.split(' ')[0] || 'there'
    const goalsText = goals?.map(g => g.title).join(', ') || 'None set yet'
    const recentContext = recentMessages?.slice(0, 2).map(m => m.content).join(' ') || ''

    const prompt = `Generate a brief, natural greeting (2-3 sentences max) for a coaching session.

User context:
- Name: ${firstName}
- Active goals: ${goalsText}
- Recent topics: ${recentContext.substring(0, 300)}

Guidelines:
- Use their first name naturally
- Reference something specific from their context if available
- Keep it conversational and warm, not corporate
- End with an open question about what they want to focus on
- 2-3 sentences max
- No emojis`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 150,
    })

    const greeting = completion.choices[0]?.message?.content?.trim() || "Hey! What would you like to work on today?"

    return NextResponse.json({ greeting })
  } catch (error: any) {
    console.error('Greeting generation error:', error)
    // Fallback to generic greeting
    return NextResponse.json({
      greeting: "Hey! What would you like to work on today?",
    })
  }
}
