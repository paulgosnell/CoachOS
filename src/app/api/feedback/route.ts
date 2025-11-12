import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const { type, category, subject, message } = await req.json()

    if (!type || !subject || !message) {
      return new Response('Missing required fields', { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Insert feedback
    const { data, error } = await supabase
      .from('feedback')
      .insert({
        user_id: user.id,
        type,
        category: category || 'general',
        subject,
        message,
        status: 'new',
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to save feedback:', error)
      return new Response('Failed to save feedback', { status: 500 })
    }

    return new Response(JSON.stringify(data), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('Feedback API error:', error)
    return new Response(error.message || 'Internal server error', { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Get user's own feedback
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch feedback:', error)
      return new Response('Failed to fetch feedback', { status: 500 })
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('Feedback GET error:', error)
    return new Response(error.message || 'Internal server error', { status: 500 })
  }
}
