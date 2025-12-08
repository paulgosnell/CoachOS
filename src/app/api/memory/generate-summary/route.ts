import { createClient } from '@/lib/supabase/server'
import { generateWeeklySummary, generateMonthlySummary } from '@/lib/memory/summaries'

/**
 * API route to generate weekly or monthly summaries
 * Can be called via cron job or manually
 */
export async function POST(req: Request) {
  try {
    const { type, date } = await req.json()

    if (!type || !date) {
      return new Response('Missing type or date', { status: 400 })
    }

    // Verify authentication
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const targetDate = new Date(date)

    let result
    if (type === 'weekly') {
      result = await generateWeeklySummary(user.id, targetDate)
    } else if (type === 'monthly') {
      result = await generateMonthlySummary(user.id, targetDate)
    } else {
      return new Response('Invalid type. Must be "weekly" or "monthly"', { status: 400 })
    }

    if (!result) {
      return new Response(JSON.stringify({ success: false, message: 'No data to summarize' }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: true, summary: result }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('Failed to generate summary:', error)
    return new Response(error.message || 'Internal server error', { status: 500 })
  }
}
