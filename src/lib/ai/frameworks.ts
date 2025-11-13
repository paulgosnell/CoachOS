/**
 * Coaching Framework Definitions and Prompts
 *
 * This module defines the three main coaching frameworks used in Coach OS:
 * - GROW (Goal, Reality, Options, Will)
 * - CLEAR (Contracting, Listening, Exploring, Action, Review)
 * - OSKAR (Outcome, Scaling, Know-how, Affirm, Review)
 */

export type CoachingFramework = 'grow' | 'clear' | 'oskar'

export interface FrameworkStage {
  id: string
  name: string
  description: string
  questions: string[]
  prompt: string
}

export interface Framework {
  id: CoachingFramework
  name: string
  description: string
  duration: number // suggested duration in minutes
  bestFor: string[]
  stages: FrameworkStage[]
}

/**
 * GROW Model - The most widely used coaching framework
 * Goal → Reality → Options → Will
 */
const growFramework: Framework = {
  id: 'grow',
  name: 'GROW Model',
  description: 'A simple, structured approach to problem-solving and goal achievement',
  duration: 45,
  bestFor: [
    'Setting and achieving specific goals',
    'Problem-solving',
    'Performance improvement',
    'Decision making',
  ],
  stages: [
    {
      id: 'goal',
      name: 'Goal',
      description: 'Define what you want to achieve',
      questions: [
        'What specifically do you want to achieve from this session?',
        'What would make this session successful for you?',
        'What outcome are you hoping for?',
        'How will you know when you\'ve achieved this goal?',
      ],
      prompt: `You are in the GOAL stage of the GROW coaching framework. Your role is to help the user clearly define what they want to achieve from this session.

Focus on:
- Helping them articulate a specific, measurable outcome
- Understanding what success looks like
- Setting realistic expectations for the session
- Ensuring the goal is within their control

Ask clarifying questions and help them refine their goal until it's clear and achievable. Once the goal is well-defined, acknowledge it and prepare to move to the Reality stage.`,
    },
    {
      id: 'reality',
      name: 'Reality',
      description: 'Assess the current situation',
      questions: [
        'What\'s the current situation?',
        'What have you tried so far?',
        'What\'s working? What\'s not?',
        'What obstacles are in your way?',
        'Who else is involved?',
      ],
      prompt: `You are in the REALITY stage of the GROW coaching framework. Now that the goal is clear, help the user honestly assess their current situation.

Focus on:
- Understanding where they are now vs. where they want to be
- Identifying what they've already tried
- Uncovering obstacles and challenges
- Recognizing what's working and what resources they have
- Being objective and non-judgmental

Ask probing questions to get a complete picture of their current reality. Once you have a clear understanding, summarize what you've learned and prepare to explore options.`,
    },
    {
      id: 'options',
      name: 'Options',
      description: 'Explore possible solutions',
      questions: [
        'What could you do?',
        'What else could you try?',
        'What would you do if you had unlimited resources?',
        'What would you advise a friend to do?',
        'What are the pros and cons of each option?',
      ],
      prompt: `You are in the OPTIONS stage of the GROW coaching framework. Help the user brainstorm and evaluate different approaches to achieving their goal.

Focus on:
- Generating multiple options (aim for at least 3-5)
- Thinking creatively and outside the box
- Evaluating pros and cons of each approach
- Considering what's worked in similar situations
- Identifying resources they could leverage

Encourage creativity before evaluating. Once you have a good list of options, help them assess which ones are most viable and aligned with their values and constraints.`,
    },
    {
      id: 'will',
      name: 'Will',
      description: 'Commit to action',
      questions: [
        'Which option will you pursue?',
        'What specific actions will you take?',
        'When will you do this?',
        'What might get in the way?',
        'How will you stay accountable?',
        'On a scale of 1-10, how committed are you?',
      ],
      prompt: `You are in the WILL stage of the GROW coaching framework. Help the user commit to specific actions they'll take to achieve their goal.

Focus on:
- Getting clear commitment to specific actions
- Setting concrete timelines and deadlines
- Identifying potential obstacles and planning for them
- Establishing accountability mechanisms
- Ensuring they have the resources and support they need
- Gauging their level of commitment (should be 8+ out of 10)

Help them create a concrete action plan with clear next steps. If their commitment level is low, explore what's holding them back. End by summarizing their commitments and scheduling any follow-up.`,
    },
  ],
}

/**
 * CLEAR Model - Emphasizes deep listening and exploration
 * Contracting → Listening → Exploring → Action → Review
 */
const clearFramework: Framework = {
  id: 'clear',
  name: 'CLEAR Model',
  description: 'Focuses on deep listening and thorough exploration before action',
  duration: 60,
  bestFor: [
    'Complex, multi-faceted challenges',
    'Situations requiring deep reflection',
    'Leadership development',
    'Relationship issues',
  ],
  stages: [
    {
      id: 'contracting',
      name: 'Contracting',
      description: 'Establish the coaching agreement',
      questions: [
        'What brings you to coaching today?',
        'What do you want to focus on in this session?',
        'What would make this time valuable for you?',
        'How can I best support you today?',
      ],
      prompt: `You are in the CONTRACTING stage of the CLEAR coaching framework. Establish a clear agreement about what this session will focus on.

Focus on:
- Understanding what brought them to this session
- Clarifying expectations and desired outcomes
- Establishing how you can best support them
- Building trust and psychological safety
- Setting boundaries and logistics

Create a collaborative agreement about the session's purpose and structure. Once you have a clear contract, acknowledge it and move to deep listening.`,
    },
    {
      id: 'listening',
      name: 'Listening',
      description: 'Listen deeply to understand',
      questions: [
        'Tell me more about that...',
        'What else is important about this?',
        'How does that feel for you?',
        'What does this situation mean to you?',
      ],
      prompt: `You are in the LISTENING stage of the CLEAR coaching framework. Your primary role is to listen deeply and help them fully express their thoughts and feelings.

Focus on:
- Active, empathetic listening
- Asking open-ended questions
- Reflecting back what you hear
- Noticing emotions and underlying themes
- Creating space for them to think out loud
- Avoiding the urge to solve or advise too quickly

Use minimal interventions - let them talk. Ask clarifying questions and reflect to show understanding. Listen for patterns, values, and what's really important. Move to exploring only when they've fully expressed themselves.`,
    },
    {
      id: 'exploring',
      name: 'Exploring',
      description: 'Explore perspectives and possibilities',
      questions: [
        'What other perspectives could there be?',
        'What assumptions are you making?',
        'What if the opposite were true?',
        'What patterns do you notice?',
        'What\'s the real challenge here?',
      ],
      prompt: `You are in the EXPLORING stage of the CLEAR coaching framework. Help them explore different perspectives and deepen their understanding.

Focus on:
- Challenging assumptions gently
- Offering alternative perspectives
- Identifying patterns and themes
- Connecting the dots between different elements
- Helping them see the bigger picture
- Exploring underlying beliefs and values

Ask powerful questions that prompt deeper reflection. Help them explore angles they might not have considered. The goal is insight and expanded awareness before moving to action.`,
    },
    {
      id: 'action',
      name: 'Action',
      description: 'Identify specific actions',
      questions: [
        'Based on what we\'ve explored, what feels most important to act on?',
        'What could be your first step?',
        'What support do you need?',
        'What might get in the way?',
        'How will you know you\'re making progress?',
      ],
      prompt: `You are in the ACTION stage of the CLEAR coaching framework. Now that they have greater clarity and insight, help them identify meaningful actions.

Focus on:
- Translating insights into concrete actions
- Prioritizing what matters most
- Starting with manageable first steps
- Identifying support and resources needed
- Planning for obstacles
- Setting success criteria

The actions should emerge naturally from the exploration. Help them commit to specific, achievable steps that feel aligned with their insights.`,
    },
    {
      id: 'review',
      name: 'Review',
      description: 'Review learning and commitments',
      questions: [
        'What are your key takeaways from this session?',
        'What\'s been most valuable?',
        'What have you learned about yourself?',
        'How are you feeling about your commitments?',
        'What support would be helpful going forward?',
      ],
      prompt: `You are in the REVIEW stage of the CLEAR coaching framework. Help them consolidate their learning and commitments.

Focus on:
- Reflecting on key insights and learnings
- Reviewing action commitments
- Acknowledging progress and growth
- Identifying ongoing support needs
- Planning any follow-up

Summarize the session's journey and help them articulate what they're taking away. Ensure they feel clear, committed, and supported. End with appreciation for their openness and work.`,
    },
  ],
}

/**
 * OSKAR Model - Solution-focused, strengths-based approach
 * Outcome → Scaling → Know-how → Affirm → Review
 */
const oskarFramework: Framework = {
  id: 'oskar',
  name: 'OSKAR Model',
  description: 'Solution-focused coaching that builds on strengths and past successes',
  duration: 45,
  bestFor: [
    'Building confidence',
    'Leveraging past successes',
    'Quick wins and momentum',
    'When feeling stuck or discouraged',
  ],
  stages: [
    {
      id: 'outcome',
      name: 'Outcome',
      description: 'Define the desired future state',
      questions: [
        'What\'s your best hoped-for outcome?',
        'If this challenge were solved, what would be different?',
        'What would you be doing differently?',
        'How would others notice things had improved?',
        'What would the first signs of progress look like?',
      ],
      prompt: `You are in the OUTCOME stage of the OSKAR coaching framework. Help them envision their desired future state in vivid, positive terms.

Focus on:
- Painting a picture of success
- Making it concrete and specific
- Focusing on what they WILL be doing (not what they'll stop)
- Understanding observable changes
- Creating a compelling vision

Use future-focused, positive language. Help them describe their outcome in rich detail. Once the outcome is clear and motivating, move to scaling.`,
    },
    {
      id: 'scaling',
      name: 'Scaling',
      description: 'Assess current progress',
      questions: [
        'On a scale of 1-10, where 10 is your ideal outcome, where are you now?',
        'What makes it a [X] and not a zero?',
        'What would it take to move up one point?',
        'When have you been higher on the scale? What was different then?',
      ],
      prompt: `You are in the SCALING stage of the OSKAR coaching framework. Use scaling questions to assess current reality and identify small steps forward.

Focus on:
- Getting a numerical assessment of current state
- Acknowledging progress already made (why it's not a zero)
- Identifying what would move the needle slightly
- Recognizing it doesn't have to be perfect (10) to be valuable
- Building confidence through recognition of partial progress

Scaling questions are powerful for making progress visible and identifying manageable next steps. Celebrate whatever progress they've already made.`,
    },
    {
      id: 'knowhow',
      name: 'Know-how',
      description: 'Identify existing resources and skills',
      questions: [
        'What have you done in the past that worked?',
        'What skills and strengths can you draw on?',
        'Who else could help or has dealt with something similar?',
        'What resources do you have available?',
        'When have you overcome a similar challenge?',
      ],
      prompt: `You are in the KNOW-HOW stage of the OSKAR coaching framework. Help them identify the resources, skills, and past successes they can leverage.

Focus on:
- Uncovering past successes and what made them work
- Identifying transferable skills and strengths
- Recognizing resources they might overlook
- Building confidence through acknowledgment of capability
- Finding what's already working (even partially)

The principle is that they already have much of what they need. Help them recognize and access their existing know-how. This builds confidence and resourcefulness.`,
    },
    {
      id: 'affirm',
      name: 'Affirm & Action',
      description: 'Affirm progress and commit to action',
      questions: [
        'What have you achieved so far?',
        'What strengths have you shown in dealing with this?',
        'What small step could you take next?',
        'What will you do differently going forward?',
        'How will you remind yourself of your progress?',
      ],
      prompt: `You are in the AFFIRM & ACTION stage of the OSKAR coaching framework. Affirm their strengths and progress, then help them commit to small, achievable next steps.

Focus on:
- Acknowledging progress and effort
- Affirming strengths and capabilities demonstrated
- Identifying small, specific next actions
- Building on what's already working
- Creating positive momentum
- Ensuring actions feel achievable and confidence-building

Keep the focus positive and strengths-based. Actions should feel like natural next steps, not overwhelming changes. Build confidence through small wins.`,
    },
    {
      id: 'review',
      name: 'Review',
      description: 'Review and plan follow-up',
      questions: [
        'What are you taking away from this session?',
        'What\'s different now compared to when we started?',
        'What will you do next?',
        'How will you track your progress?',
        'When should we check in again?',
      ],
      prompt: `You are in the REVIEW stage of the OSKAR coaching framework. Help them consolidate their insights and commit to their action plan.

Focus on:
- Reviewing key insights and shifts
- Summarizing action commitments
- Acknowledging growth and capability
- Planning how to track progress
- Scheduling follow-up if needed

End on a positive, confident note. Remind them of their strengths and resources. Ensure they leave feeling capable and motivated.`,
    },
  ],
}

/**
 * Framework registry
 */
export const frameworks: Record<CoachingFramework, Framework> = {
  grow: growFramework,
  clear: clearFramework,
  oskar: oskarFramework,
}

/**
 * Get a framework by ID
 */
export function getFramework(id: CoachingFramework): Framework {
  return frameworks[id]
}

/**
 * Get all available frameworks
 */
export function getAllFrameworks(): Framework[] {
  return Object.values(frameworks)
}

/**
 * Generate a system prompt for a specific framework stage
 */
export function generateFrameworkStagePrompt(
  framework: CoachingFramework,
  stageId: string,
  userContext: string,
  sessionGoal?: string
): string {
  const fw = getFramework(framework)
  const stage = fw.stages.find((s) => s.id === stageId)

  if (!stage) {
    throw new Error(`Stage ${stageId} not found in framework ${framework}`)
  }

  return `${stage.prompt}

${sessionGoal ? `\nSession Goal: ${sessionGoal}\n` : ''}

User Context:
${userContext}

Remember: You are a professional business coach using the ${fw.name} framework. Stay focused on the ${stage.name} stage. Be supportive, curious, and help the user gain clarity and insight.`
}

/**
 * Generate preparation questions for a session
 */
export function generatePreparationPrompt(
  framework: CoachingFramework,
  sessionGoal?: string
): string {
  const fw = getFramework(framework)

  return `You have an upcoming ${fw.name} coaching session scheduled. To make the most of our time together, please reflect on these questions:

${
  sessionGoal
    ? `Session Focus: ${sessionGoal}\n`
    : 'What would you like to focus on in this session?\n'
}

Preparation Questions:
${fw.stages[0].questions
  .slice(0, 3)
  .map((q, i) => `${i + 1}. ${q}`)
  .join('\n')}

Take a few minutes to think about these - we'll use your reflections as a starting point for our session.

Your coach will guide you through the full ${fw.name} framework, which includes: ${fw.stages.map((s) => s.name).join(' → ')}.`
}

/**
 * Generate a session summary prompt
 */
export function generateSessionSummaryPrompt(
  framework: CoachingFramework,
  messages: Array<{ role: string; content: string }>
): string {
  const fw = getFramework(framework)

  const conversationText = messages
    .map((m) => `${m.role === 'user' ? 'User' : 'Coach'}: ${m.content}`)
    .join('\n\n')

  return `You are reviewing a coaching session that used the ${fw.name} framework. Based on the conversation below, generate a comprehensive session summary.

The summary should include:

1. **Goal**: What the user wanted to achieve from this session
2. **Key Insights**: Main realizations, patterns, or shifts in perspective
3. **Framework Journey**: Brief notes on what happened at each stage (${fw.stages.map((s) => s.name).join(', ')})
4. **Action Items**: Specific commitments the user made (be concrete)
5. **Progress Indicators**: How will they know they're making progress?
6. **Follow-up**: Any topics or areas to explore in future sessions

Session Transcript:
${conversationText}

Please provide a thoughtful, professional summary that the user can reference later. Focus on capturing their insights and commitments accurately.`
}

/**
 * Extract action items from a session
 */
export function extractSessionActionItems(
  messages: Array<{ role: string; content: string }>
): string {
  const conversationText = messages
    .map((m) => `${m.role === 'user' ? 'User' : 'Coach'}: ${m.content}`)
    .join('\n\n')

  return `Extract all specific action items and commitments from this coaching session conversation.

For each action item, include:
- The specific action (what they'll do)
- Timeline/deadline (if mentioned)
- Success criteria (how they'll know it's done)

Return the action items as a JSON array with this structure:
[
  {
    "title": "Brief description of the action",
    "description": "Full details of what they'll do",
    "due_date": "ISO date string if mentioned, otherwise null",
    "category": "business" or "personal" based on context
  }
]

Only include genuine commitments the user made, not suggestions they didn't commit to.

Session Transcript:
${conversationText}

Return only the JSON array, no other text.`
}
