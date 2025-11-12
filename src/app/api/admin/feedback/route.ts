import { createClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'

export async function GET(req: Request) {
  try {
    // Check admin authorization
    if (!(await isAdmin())) {
      return new Response('Unauthorized', { status: 401 })
    }

    const supabase = await createClient()

    // Get all feedback
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
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
    console.error('Admin feedback API error:', error)
    return new Response(error.message || 'Internal server error', { status: 500 })
  }
}
