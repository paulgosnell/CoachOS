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
  actionItems: Array<{
    task: string
    description?: string
    priority: 'low' | 'medium' | 'high'
    dueDate?: string
    status: string
    createdAt: Date
  }>
  recentHistory: Array<{
    role: 'user' | 'assistant'
    content: string
  }>
  relevantMemories?: Array<{
    content: string
    role: 'user' | 'assistant'
    similarity: number
    createdAt: Date
  }>
  weeklySummaries?: Array<{
    summary: string
    wins: string[]
    challenges: string[]
    decisions: string[]
    weeksAgo: number
  }>
  monthlySummary?: {
    summary: string
    patterns: string[]
    growthAreas: string[]
    focusAreas: string[]
    coachObservations: string | null
  }
  recentSessionSummaries?: Array<{
    summary: string
    keyTopics: string[]
    decisions: string[]
    breakthroughs: string[]
    patterns: string[]
    userState: string | null
    daysAgo: number
    isMilestone?: boolean
    isRelevant?: boolean
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

  // Fetch pending action items (tasks)
  const { data: actionItems } = await supabase
    .from('action_items')
    .select('task, description, priority, due_date, status, created_at')
    .eq('user_id', userId)
    .eq('status', 'pending')
    .order('due_date', { ascending: true, nullsFirst: false })
    .order('priority', { ascending: false })
    .limit(10)

  // Fetch recent conversation history (only if conversationId provided)
  let messages: { role: string; content: string }[] | null = null
  if (conversationId && messageLimit > 0) {
    const { data } = await supabase
      .from('messages')
      .select('role, content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(messageLimit)
    messages = data
  }

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
    actionItems: (actionItems || []).map((a) => ({
      task: a.task,
      description: a.description || undefined,
      priority: a.priority as 'low' | 'medium' | 'high',
      dueDate: a.due_date || undefined,
      status: a.status,
      createdAt: new Date(a.created_at),
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
 * Assembles enhanced user context with RAG (Retrieval Augmented Generation)
 * Includes relevant memories from past conversations via vector search
 */
export async function assembleUserContextWithRAG(
  userId: string,
  conversationId: string,
  currentMessage: string,
  messageLimit: number = 10,
  memoryLimit: number = 5
): Promise<UserContext> {
  // Get base context
  const context = await assembleUserContext(userId, conversationId, messageLimit)

  try {
    // Import memory utilities (dynamic to avoid circular deps)
    const { generateEmbedding, searchSimilarMessages } = await import('@/lib/memory/embeddings')
    const { getRecentSummaries } = await import('@/lib/memory/summaries')
    const { getRecentConversationSummaries, getMilestoneSummaries, searchSummaries } = await import('@/lib/memory/conversation-summary')

    // Generate embedding for current message
    const queryEmbedding = await generateEmbedding(currentMessage)

    // Search for relevant past messages
    const relevantMessages = await searchSimilarMessages(
      userId,
      queryEmbedding,
      memoryLimit,
      conversationId // Exclude current conversation
    )

    // Add relevant memories to context
    if (relevantMessages.length > 0) {
      context.relevantMemories = relevantMessages.map((m) => ({
        content: m.content,
        role: m.role,
        similarity: m.similarity,
        createdAt: m.createdAt,
      }))
    }

    // Get weekly and monthly summaries
    const summaries = await getRecentSummaries(userId, 4) // Last 4 weeks
    const now = Date.now()

    if (summaries.weeklySummaries.length > 0) {
      context.weeklySummaries = summaries.weeklySummaries.map((s) => ({
        summary: s.summary,
        wins: s.wins || [],
        challenges: s.challenges_faced || [],
        decisions: s.key_decisions || [],
        weeksAgo: Math.floor((now - new Date(s.week_start).getTime()) / (1000 * 60 * 60 * 24 * 7)),
      }))
    }

    if (summaries.monthlySummaries.length > 0) {
      const latest = summaries.monthlySummaries[0]
      context.monthlySummary = {
        summary: latest.summary,
        patterns: latest.behavioral_patterns || [],
        growthAreas: latest.growth_areas || [],
        focusAreas: latest.focus_areas_next_month || [],
        coachObservations: latest.coach_observations,
      }
    }

    // Get recent conversation summaries (MemoryOS)
    const sessionSummaries = await getRecentConversationSummaries(userId, 10)

    // Get milestone summaries (breakthroughs/decisions from ANY time)
    const milestoneSummaries = await getMilestoneSummaries(userId, 5)

    // Search for semantically relevant summaries based on current message
    let relevantSummaries: Awaited<ReturnType<typeof searchSummaries>> = []
    try {
      relevantSummaries = await searchSummaries(userId, queryEmbedding, 3, 0.6)
    } catch (e) {
      console.error('Failed to search summaries:', e)
    }

    // Merge all summaries, deduplicating by conversation_id
    const seenIds = new Set<string>()
    const allSummaries: typeof context.recentSessionSummaries = []

    // Add recent summaries first
    for (const s of sessionSummaries) {
      if (!seenIds.has(s.conversation_id)) {
        seenIds.add(s.conversation_id)
        allSummaries.push({
          summary: s.summary,
          keyTopics: s.key_topics || [],
          decisions: s.decisions_made || [],
          breakthroughs: s.breakthroughs || [],
          patterns: s.patterns_noticed || [],
          userState: s.user_state,
          daysAgo: Math.floor((now - new Date(s.generated_at).getTime()) / (1000 * 60 * 60 * 24)),
        })
      }
    }

    // Add milestone summaries (marked as important)
    for (const s of milestoneSummaries) {
      if (!seenIds.has(s.conversation_id)) {
        seenIds.add(s.conversation_id)
        allSummaries.push({
          summary: s.summary,
          keyTopics: s.key_topics || [],
          decisions: s.decisions_made || [],
          breakthroughs: s.breakthroughs || [],
          patterns: s.patterns_noticed || [],
          userState: s.user_state,
          daysAgo: Math.floor((now - new Date(s.generated_at).getTime()) / (1000 * 60 * 60 * 24)),
          isMilestone: true,
        })
      }
    }

    // Add semantically relevant summaries
    for (const s of relevantSummaries) {
      if (!seenIds.has(s.conversation_id)) {
        seenIds.add(s.conversation_id)
        allSummaries.push({
          summary: s.summary,
          keyTopics: s.key_topics || [],
          decisions: s.decisions_made || [],
          breakthroughs: s.breakthroughs || [],
          patterns: s.patterns_noticed || [],
          userState: s.user_state,
          daysAgo: Math.floor((now - new Date(s.generated_at).getTime()) / (1000 * 60 * 60 * 24)),
          isRelevant: true,
        })
      }
    }

    if (allSummaries.length > 0) {
      context.recentSessionSummaries = allSummaries
    }
  } catch (error) {
    console.error('Failed to fetch RAG context:', error)
    // Continue without RAG if it fails
  }

  return context
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

  // Action Items (Tasks)
  if (context.actionItems && context.actionItems.length > 0) {
    parts.push(`OUTSTANDING TASKS:`)
    context.actionItems.forEach((item, index) => {
      const priorityLabel = item.priority === 'high' ? '🔴' : item.priority === 'medium' ? '🟡' : '🟢'
      const dueStr = item.dueDate ? ` (due: ${item.dueDate})` : ''
      parts.push(`${index + 1}. ${priorityLabel} ${item.task}${dueStr}`)
      if (item.description) parts.push(`   ${item.description}`)
    })
    parts.push('')
  }

  // Monthly Summary (high-level patterns and coach observations)
  if (context.monthlySummary) {
    parts.push(`LAST MONTH'S OVERVIEW:`)
    parts.push(context.monthlySummary.summary)
    if (context.monthlySummary.patterns.length > 0) {
      parts.push(`Behavioral Patterns: ${context.monthlySummary.patterns.join('; ')}`)
    }
    if (context.monthlySummary.growthAreas.length > 0) {
      parts.push(`Growth Areas: ${context.monthlySummary.growthAreas.join('; ')}`)
    }
    if (context.monthlySummary.focusAreas.length > 0) {
      parts.push(`Focus Areas This Month: ${context.monthlySummary.focusAreas.join('; ')}`)
    }
    if (context.monthlySummary.coachObservations) {
      parts.push(`Coach Observations: ${context.monthlySummary.coachObservations}`)
    }
    parts.push('')
  }

  // Weekly Summaries (recent weeks progress)
  if (context.weeklySummaries && context.weeklySummaries.length > 0) {
    parts.push(`RECENT WEEKS:`)
    context.weeklySummaries.slice(0, 4).forEach((week, index) => {
      const timeLabel = week.weeksAgo === 0 ? 'This week' : week.weeksAgo === 1 ? 'Last week' : `${week.weeksAgo} weeks ago`
      parts.push(``)
      parts.push(`${timeLabel}: ${week.summary}`)
      if (week.wins.length > 0) {
        parts.push(`  Wins: ${week.wins.slice(0, 3).join('; ')}`)
      }
      if (week.challenges.length > 0) {
        parts.push(`  Challenges: ${week.challenges.slice(0, 2).join('; ')}`)
      }
      if (week.decisions.length > 0) {
        parts.push(`  Key Decisions: ${week.decisions.slice(0, 2).join('; ')}`)
      }
    })
    parts.push('')
  }

  // Recent Session Summaries (from MemoryOS)
  if (context.recentSessionSummaries && context.recentSessionSummaries.length > 0) {
    parts.push(`SESSION HISTORY (MemoryOS):`)
    parts.push(`(Key insights from coaching conversations - recent + milestones + relevant to current topic)`)
    context.recentSessionSummaries.slice(0, 15).forEach((session, index) => {
      const timeAgo = session.daysAgo === 0 ? 'today' : session.daysAgo === 1 ? 'yesterday' : `${session.daysAgo} days ago`
      // Add markers for milestone or relevant summaries
      const markers: string[] = []
      if (session.isMilestone) markers.push('MILESTONE')
      if (session.isRelevant) markers.push('RELEVANT TO CURRENT TOPIC')
      const markerStr = markers.length > 0 ? ` [${markers.join(', ')}]` : ''
      parts.push(``)
      parts.push(`${index + 1}. [${timeAgo}]${markerStr} ${session.summary}`)
      if (session.keyTopics.length > 0) {
        parts.push(`   Topics: ${session.keyTopics.join(', ')}`)
      }
      if (session.decisions.length > 0) {
        parts.push(`   Decisions: ${session.decisions.slice(0, 2).join('; ')}`)
      }
      if (session.breakthroughs.length > 0) {
        parts.push(`   Breakthroughs: ${session.breakthroughs.join('; ')}`)
      }
      if (session.patterns.length > 0) {
        parts.push(`   Patterns: ${session.patterns.join('; ')}`)
      }
      if (session.userState) {
        parts.push(`   User state: ${session.userState}`)
      }
    })
    parts.push('')
  }

  // Relevant Memories (from RAG)
  if (context.relevantMemories && context.relevantMemories.length > 0) {
    parts.push(`RELEVANT PAST DISCUSSIONS:`)
    parts.push(`(Similar topics from previous conversations)`)
    context.relevantMemories.forEach((memory, index) => {
      const daysAgo = Math.floor(
        (Date.now() - memory.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      )
      const timeAgo = daysAgo === 0 ? 'today' : daysAgo === 1 ? 'yesterday' : `${daysAgo} days ago`

      // Sentence-aware truncation: find the last sentence boundary within 250 chars
      let truncated = memory.content
      if (memory.content.length > 250) {
        const chunk = memory.content.slice(0, 250)
        const lastPeriod = chunk.lastIndexOf('.')
        const lastQuestion = chunk.lastIndexOf('?')
        const lastExclaim = chunk.lastIndexOf('!')
        const lastBoundary = Math.max(lastPeriod, lastQuestion, lastExclaim)

        if (lastBoundary > 100) {
          // Found a sentence boundary - use it
          truncated = memory.content.slice(0, lastBoundary + 1) + '..'
        } else {
          // No good boundary - just cut at 250
          truncated = memory.content.slice(0, 250) + '...'
        }
      }

      parts.push(`${index + 1}. [${timeAgo}] ${truncated}`)
    })
    parts.push('')
  }

  return parts.join('\n')
}
