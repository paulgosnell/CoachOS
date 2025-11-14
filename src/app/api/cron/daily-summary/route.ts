import { createClient } from '@/lib/supabase/server'
import { generateDailySummary } from '@/lib/memory/summaries'

/**
 * Cron job to generate daily summaries for all active users
 * Called by Vercel Cron at end of each day
 */
export async function GET(req: Request) {
  try {
    // Verify this is coming from Vercel Cron
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response('Unauthorized', { status: 401 })
    }

    const supabase = await createClient()

    // Get all users who have had conversations today
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { data: activeUsers } = await supabase
      .from('conversations')
      .select('user_id')
      .gte('started_at', today.toISOString())
      .order('user_id')

    if (!activeUsers || activeUsers.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No active users today', summariesGenerated: 0 }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Get unique user IDs
    const uniqueUserIds = [...new Set(activeUsers.map((u) => u.user_id))]

    // Generate summaries for each user
    const results = []
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    for (const userId of uniqueUserIds) {
      try {
        const summary = await generateDailySummary(userId, yesterday)
        if (summary) {
          results.push({ userId, success: true })
        } else {
          results.push({ userId, success: false, reason: 'No data to summarize' })
        }
      } catch (error: any) {
        console.error(`Failed to generate summary for user ${userId}:`, error)
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
    console.error('Daily summary cron error:', error)
    return new Response(error.message || 'Internal server error', { status: 500 })
  }
}
