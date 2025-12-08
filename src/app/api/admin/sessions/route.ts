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

    const { data: sessions, error } = await query

    if (error) {
      console.error('Failed to fetch sessions:', error)
      return new Response('Failed to fetch sessions', { status: 500 })
    }

    // Get conversation summaries for these sessions
    const sessionIds = sessions?.map(s => s.id) || []
    const { data: summaries } = await supabase
      .from('conversation_summaries')
      .select('conversation_id, summary, key_topics, user_state, breakthroughs, decisions_made')
      .in('conversation_id', sessionIds)

    // Create a map for quick lookup
    const summaryMap = new Map(summaries?.map(s => [s.conversation_id, s]) || [])

    // Merge summary data into sessions
    const sessionsWithSummaries = sessions?.map(session => ({
      ...session,
      has_summary: summaryMap.has(session.id),
      summary_preview: summaryMap.get(session.id)?.summary || null,
      summary_topics: summaryMap.get(session.id)?.key_topics || [],
      summary_user_state: summaryMap.get(session.id)?.user_state || null,
      summary_breakthroughs: summaryMap.get(session.id)?.breakthroughs || [],
      summary_decisions: summaryMap.get(session.id)?.decisions_made || [],
    }))

    return new Response(JSON.stringify(sessionsWithSummaries), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('Admin sessions API error:', error)
    return new Response(error.message || 'Internal server error', { status: 500 })
  }
}
