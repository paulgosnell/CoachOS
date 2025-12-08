import { isAdmin } from '@/lib/admin'
import { NextRequest } from 'next/server'
import {
  getConversationSummary,
  generateConversationSummary
} from '@/lib/memory/conversation-summary'

// GET - Fetch existing summary
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdmin())) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { id } = await params
    const summary = await getConversationSummary(id)

    if (!summary) {
      return new Response(JSON.stringify({ exists: false }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ exists: true, summary }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error: any) {
    console.error('Get summary error:', error)
    return new Response(error.message || 'Internal server error', { status: 500 })
  }
}

// POST - Generate new summary
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdmin())) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { id } = await params
    const summary = await generateConversationSummary(id)

    if (!summary) {
      return new Response('Failed to generate summary', { status: 500 })
    }

    return new Response(JSON.stringify(summary), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error: any) {
    console.error('Generate summary error:', error)
    return new Response(error.message || 'Internal server error', { status: 500 })
  }
}
