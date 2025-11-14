import { createClient } from '@/lib/supabase/server'
import { generateWeeklySummary } from '@/lib/memory/summaries'

/**
 * Cron job to generate weekly summaries for all active users
 * Called by Vercel Cron every Sunday night
 */
export async function GET(req: Request) {
  try {
    // Verify this is coming from Vercel Cron
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response('Unauthorized', { status: 401 })
    }

    const supabase = await createClient()

    // Get all users who have daily summaries from the past week
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - 7)
    weekStart.setHours(0, 0, 0, 0)

    const { data: activeSummaries } = await supabase
      .from('daily_summaries')
      .select('user_id')
      .gte('date', weekStart.toISOString().split('T')[0])
      .order('user_id')

    if (!activeSummaries || activeSummaries.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No daily summaries this week', summariesGenerated: 0 }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Get unique user IDs
    const uniqueUserIds = [...new Set(activeSummaries.map((s) => s.user_id))]

    // Generate weekly summaries
    const results = []
    const lastWeekStart = new Date()
    lastWeekStart.setDate(lastWeekStart.getDate() - 7)
    lastWeekStart.setHours(0, 0, 0, 0)

    for (const userId of uniqueUserIds) {
      try {
        const summary = await generateWeeklySummary(userId, lastWeekStart)
        if (summary) {
          results.push({ userId, success: true })
        } else {
          results.push({ userId, success: false, reason: 'No data to summarize' })
        }
      } catch (error: any) {
        console.error(`Failed to generate weekly summary for user ${userId}:`, error)
        results.push({ userId, success: false, reason: error.message })
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        summariesGenerated: results.filter((r) => r.success).length,
        totalUsers: uniqueUserIds.length,
        results,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    console.error('Weekly summary cron error:', error)
    return new Response(error.message || 'Internal server error', { status: 500 })
  }
}
