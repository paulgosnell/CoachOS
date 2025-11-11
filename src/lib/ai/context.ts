import { createClient } from '@/lib/supabase/server'

export interface UserContext {
  profile: {
    fullName: string
    email: string
  }
  business: {
    industry?: string
    companyStage?: string
    role?: string
    companyName?: string
    teamSize?: string
    location?: string
    revenueRange?: string
    markets?: string[]
    keyChallenges?: string[]
    reportsTo?: string
    directReports?: number
  }
  goals: Array<{
    title: string
    description?: string
    category?: string
    priority: number
    targetDate?: string
    status: string
  }>
  recentHistory: Array<{
    role: 'user' | 'assistant'
    content: string
  }>
}

/**
 * Assembles comprehensive user context for AI coaching
 * Includes profile, business info, goals, and conversation history
 */
export async function assembleUserContext(
  userId: string,
  conversationId: string,
  messageLimit: number = 10
): Promise<UserContext> {
  const supabase = await createClient()

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', userId)
    .single()

  // Fetch business profile
  const { data: businessProfile } = await supabase
    .from('business_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  // Fetch active goals
  const { data: goals } = await supabase
    .from('goals')
    .select('title, description, category, priority, target_date, status')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('priority', { ascending: true })
    .limit(5)

  // Fetch recent conversation history
  const { data: messages } = await supabase
    .from('messages')
    .select('role, content')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false })
    .limit(messageLimit)

  return {
    profile: {
      fullName: profile?.full_name || 'User',
      email: profile?.email || '',
    },
    business: {
      industry: businessProfile?.industry,
      companyStage: businessProfile?.company_stage,
      role: businessProfile?.role,
      companyName: businessProfile?.company_name,
      teamSize: businessProfile?.team_size,
      location: businessProfile?.location,
      revenueRange: businessProfile?.revenue_range,
      markets: businessProfile?.markets,
      keyChallenges: businessProfile?.key_challenges,
      reportsTo: businessProfile?.reports_to,
      directReports: businessProfile?.direct_reports,
    },
    goals: (goals || []).map((g) => ({
      title: g.title,
      description: g.description || undefined,
      category: g.category || undefined,
      priority: g.priority,
      targetDate: g.target_date || undefined,
      status: g.status,
    })),
    recentHistory: (messages || [])
      .reverse()
      .map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
  }
}

/**
 * Formats user context into a readable string for the system prompt
 */
export function formatUserContext(context: UserContext): string {
  const parts: string[] = []

  // Profile
  parts.push(`USER PROFILE:`)
  parts.push(`Name: ${context.profile.fullName}`)
  if (context.profile.email) {
    parts.push(`Email: ${context.profile.email}`)
  }
  parts.push('')

  // Business Context
  if (Object.values(context.business).some((v) => v)) {
    parts.push(`BUSINESS CONTEXT:`)
    if (context.business.role) parts.push(`Role: ${context.business.role}`)
    if (context.business.companyName) parts.push(`Company: ${context.business.companyName}`)
    if (context.business.industry) parts.push(`Industry: ${context.business.industry}`)
    if (context.business.companyStage) parts.push(`Stage: ${context.business.companyStage}`)
    if (context.business.teamSize) parts.push(`Team Size: ${context.business.teamSize}`)
    if (context.business.location) parts.push(`Location: ${context.business.location}`)
    if (context.business.revenueRange) parts.push(`Revenue: ${context.business.revenueRange}`)
    if (context.business.directReports !== undefined)
      parts.push(`Direct Reports: ${context.business.directReports}`)
    if (context.business.reportsTo) parts.push(`Reports To: ${context.business.reportsTo}`)

    if (context.business.markets && context.business.markets.length > 0) {
      parts.push(`Markets: ${context.business.markets.join(', ')}`)
    }

    if (context.business.keyChallenges && context.business.keyChallenges.length > 0) {
      parts.push(`Key Challenges:`)
      context.business.keyChallenges.forEach((challenge) => {
        parts.push(`  - ${challenge}`)
      })
    }
    parts.push('')
  }

  // Goals
  if (context.goals.length > 0) {
    parts.push(`ACTIVE GOALS (Priority Order):`)
    context.goals.forEach((goal, index) => {
      parts.push(`${index + 1}. ${goal.title}`)
      if (goal.description) parts.push(`   ${goal.description}`)
      if (goal.category) parts.push(`   Category: ${goal.category}`)
      if (goal.targetDate) parts.push(`   Target: ${goal.targetDate}`)
    })
    parts.push('')
  }

  return parts.join('\n')
}
