import { createClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'
import { NextRequest } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authorization
    if (!(await isAdmin())) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { id } = await params
    const supabase = await createClient()

    // Get session details from the admin view
    const { data: session, error: sessionError } = await supabase
      .from('admin_session_summary')
      .select('*')
      .eq('id', id)
      .single()

    if (sessionError || !session) {
      console.error('Session not found:', sessionError)
      return new Response('Session not found', { status: 404 })
    }

    // Get messages for this session
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('id, role, content, created_at')
      .eq('conversation_id', id)
      .order('created_at', { ascending: true })

    if (messagesError) {
      console.error('Failed to fetch messages:', messagesError)
    }

    return new Response(
      JSON.stringify({
        ...session,
        messages: messages || [],
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error: any) {
    console.error('Admin session detail API error:', error)
    return new Response(error.message || 'Internal server error', { status: 500 })
  }
}
