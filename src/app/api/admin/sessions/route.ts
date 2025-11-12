import { createClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'

export async function GET(req: Request) {
  try {
    // Check admin authorization
    if (!(await isAdmin())) {
      return new Response('Unauthorized', { status: 401 })
    }

    const supabase = await createClient()

    // Get URL params for filtering
    const url = new URL(req.url)
    const userId = url.searchParams.get('userId')
    const limit = parseInt(url.searchParams.get('limit') || '50')

    // Get all sessions with stats from the admin view
    let query = supabase
      .from('admin_session_summary')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(limit)

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Failed to fetch sessions:', error)
      return new Response('Failed to fetch sessions', { status: 500 })
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('Admin sessions API error:', error)
    return new Response(error.message || 'Internal server error', { status: 500 })
  }
}
