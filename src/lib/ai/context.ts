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
  recentSummaries?: {
    daily: string[]
    weekly: string[]
  }
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

    // Get recent summaries
    const summaries = await getRecentSummaries(userId, 7)

    if (summaries.dailySummaries.length > 0 || summaries.weeklySummaries.length > 0) {
      context.recentSummaries = {
        daily: summaries.dailySummaries.map((s) => s.summary),
        weekly: summaries.weeklySummaries.map((s) => s.summary),
      }
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

  // Recent Summaries
  if (context.recentSummaries) {
    if (context.recentSummaries.weekly.length > 0) {
      parts.push(`RECENT PROGRESS (Last Week):`)
      context.recentSummaries.weekly.forEach((summary) => {
        parts.push(`- ${summary}`)
      })
      parts.push('')
    }

    if (context.recentSummaries.daily.length > 0) {
      parts.push(`RECENT SESSIONS (Last 7 Days):`)
      context.recentSummaries.daily.slice(0, 3).forEach((summary) => {
        parts.push(`- ${summary}`)
      })
      parts.push('')
    }
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
