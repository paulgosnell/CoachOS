# Application Architecture Reference

A comprehensive technical reference for building AI-powered conversational applications with long-term memory, real-time voice interactions, and structured session workflows.

---

## Table of Contents

1. [Tech Stack Overview](#tech-stack-overview)
2. [Project Structure](#project-structure)
3. [Architecture Patterns](#architecture-patterns)
4. [Core Features & Capabilities](#core-features--capabilities)
5. [Data Model](#data-model)
6. [API Design Patterns](#api-design-patterns)
7. [AI Integration Patterns](#ai-integration-patterns)
8. [Real-Time Features](#real-time-features)
9. [Memory & RAG System](#memory--rag-system)
10. [Authentication & Authorization](#authentication--authorization)
11. [State Management](#state-management)
12. [UI Component Architecture](#ui-component-architecture)
13. [Deployment Architecture](#deployment-architecture)
14. [Development Workflow](#development-workflow)

---

## Tech Stack Overview

### Frontend

| Category | Technology | Purpose |
|----------|------------|---------|
| Framework | Next.js 14 (App Router) | Full-stack React framework with server components |
| Language | TypeScript 5.6 | Type-safe development |
| UI Library | React 18.3 | Component-based UI |
| Styling | Tailwind CSS 3.4 | Utility-first CSS framework |
| Animations | Framer Motion 12 | Smooth UI animations |
| Icons | Lucide React | Consistent icon library |
| Charts | Recharts 3.4 | Data visualization |
| Forms | React Hook Form 7 + Zod | Form handling with validation |
| Markdown | React Markdown + Remark GFM | Rich text rendering |

### Backend & Infrastructure

| Category | Technology | Purpose |
|----------|------------|---------|
| Runtime | Node.js (Next.js API Routes) | Serverless API endpoints |
| Database | PostgreSQL (Supabase) | Primary data persistence |
| Vector Store | pgvector extension | Semantic search & embeddings |
| Authentication | Supabase Auth | JWT-based auth with SSR support |
| Real-time | WebSockets | Bidirectional communication |
| Email | Resend | Transactional emails |
| Payments | Revolut API | Subscription management |
| Hosting | Vercel | Serverless deployment |

### AI & Machine Learning

| Category | Technology | Purpose |
|----------|------------|---------|
| Primary LLM | Google Gemini 2.5 Flash | Text generation & reasoning |
| Voice LLM | Gemini Live API | Real-time voice conversations |
| Action Extraction | OpenAI GPT-4o-mini | Structured data extraction |
| Embeddings | OpenAI text-embedding-3-small | 1536-dim vector generation |
| Speech-to-Text | OpenAI Whisper | Audio transcription |
| Text-to-Speech | ElevenLabs / Native TTS | Voice synthesis |

### Development Tools

| Tool | Purpose |
|------|---------|
| ESLint | Code linting |
| TypeScript | Static type checking |
| npm | Package management |
| PWA Support | @ducanh2912/next-pwa |
| Analytics | Vercel Analytics |

---

## Project Structure

```
/src
├── /app                          # Next.js App Router
│   ├── /(auth)                   # Auth pages (login, signup, callbacks)
│   ├── /api                      # API routes (serverless functions)
│   │   ├── /chat                 # Text conversation endpoints
│   │   ├── /voice                # Voice conversation endpoints
│   │   ├── /memory               # Embeddings & summaries
│   │   ├── /sessions             # Session management
│   │   ├── /admin                # Admin dashboard APIs
│   │   ├── /payments             # Payment processing
│   │   ├── /cron                 # Scheduled jobs
│   │   └── /settings             # User settings
│   ├── /dashboard                # Main user dashboard
│   ├── /chat                     # Chat interface pages
│   ├── /voice-[feature]          # Voice interaction pages
│   ├── /sessions                 # Session booking & management
│   ├── /goals                    # Goal management
│   ├── /tasks                    # Task/action items
│   ├── /admin                    # Admin panel
│   ├── /onboarding               # User setup flow
│   └── /layout.tsx               # Root layout
│
├── /components                   # Reusable React components
│   ├── /chat                     # MessageInput, MessageBubble, ConversationList
│   ├── /voice                    # VoiceRecorder, AudioPlayer, VoiceConversation
│   ├── /dashboard                # Progress charts, summary cards
│   ├── /sessions                 # Session cards, booking UI
│   ├── /goals                    # Goal modals, lists
│   ├── /tasks                    # Task lists, action items
│   ├── /settings                 # Settings panels
│   ├── /ui                       # Generic UI primitives (Tabs, Modal, etc.)
│   ├── ErrorBoundary.tsx         # Error handling wrapper
│   └── Toast.tsx                 # Notification system
│
├── /lib                          # Utility modules
│   ├── /supabase
│   │   ├── client.ts             # Browser Supabase client
│   │   ├── server.ts             # Server Supabase client
│   │   └── middleware.ts         # Session refresh middleware
│   ├── /ai
│   │   ├── context.ts            # User context assembly + RAG
│   │   ├── prompts.ts            # System prompt templates
│   │   ├── frameworks.ts         # Structured conversation frameworks
│   │   └── actions.ts            # Action item extraction
│   ├── /memory
│   │   ├── embeddings.ts         # Vector embedding generation
│   │   ├── conversation-summary.ts
│   │   └── summaries.ts          # Daily/weekly/monthly summaries
│   ├── admin.ts                  # Admin utilities
│   ├── analytics.ts              # Event tracking
│   ├── email.ts                  # Email sending
│   └── subscription.ts           # Feature gating
│
├── /middleware.ts                # Global Next.js middleware
└── /globals.css                  # Global styles + Tailwind
```

### Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies and scripts |
| `tsconfig.json` | TypeScript config with path aliases (`@/*`) |
| `tailwind.config.ts` | Custom design tokens, colors, animations |
| `next.config.js` | PWA setup, image optimization |
| `vercel.json` | Build config, cron jobs |
| `.env.example` | Environment variable template |

---

## Architecture Patterns

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│  React Components → State Management → Event Handlers           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                          API LAYER                              │
│  Next.js API Routes → Auth Middleware → Business Logic          │
└─────────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   DATABASE      │  │   AI SERVICES   │  │ EXTERNAL APIs   │
│   PostgreSQL    │  │   Gemini/OpenAI │  │ Payments/Email  │
│   + pgvector    │  │   + Embeddings  │  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### Request Flow Pattern

```
User Input
    ↓
[API Route Handler]
    ↓
[Authentication Check]
    ↓
[Context Assembly (Profile + History + RAG)]
    ↓
[System Prompt Generation]
    ↓
[AI Model Invocation]
    ↓
[Response Streaming to Client]
    ↓
[Async: Save Message + Generate Embedding + Extract Actions]
    ↓
[Usage Tracking]
```

### Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| Next.js App Router | Modern file-based routing, Server Components, streaming |
| Supabase (PostgreSQL) | All-in-one BaaS: auth, database, storage, realtime |
| Vercel Hosting | Native Next.js optimization, edge functions, cron |
| Zustand | Minimal state library when needed |
| OpenAI Embeddings | Industry standard for RAG systems |
| Tailwind CSS | Utility-first, design tokens for consistency |
| TypeScript Strict | Type safety across the codebase |
| PWA Support | Offline capability, installable experience |

---

## Core Features & Capabilities

### 1. Text Conversations
- Real-time streaming responses from LLMs
- Context-aware conversations using user profile and history
- Automatic action item extraction from conversations
- Conversation persistence and history

### 2. Voice Interactions
- Real-time bidirectional voice using WebSockets
- Speech-to-text transcription
- Natural text-to-speech synthesis
- Audio processing (PCM encoding, resampling)

### 3. Long-Term Memory (RAG)
- Vector embeddings for semantic search
- Retrieval of relevant past conversations
- Daily/weekly/monthly summary generation
- Pattern recognition across sessions

### 4. Structured Sessions
- Pre-defined workflow frameworks (GROW, CLEAR, OSKAR)
- Stage-based guided interactions
- Session booking and scheduling
- Progress tracking

### 5. Goal & Task Management
- User-defined goals with priorities
- Auto-extracted action items from conversations
- Status tracking (pending, in-progress, completed)
- Due date management

### 6. Admin Dashboard
- User management and oversight
- Session history with message detail
- Usage analytics and cost tracking
- Feedback management

### 7. Subscription & Payments
- Tiered feature access (Free/Pro)
- Payment processing integration
- Subscription lifecycle management
- Feature gating based on plan

---

## Data Model

### Core Tables

```sql
-- User Profiles (extends auth.users)
profiles
├── id (uuid, PK, references auth.users)
├── email (text)
├── full_name (text)
├── subscription_status (text)
├── preferences (jsonb)
├── is_admin (boolean)
├── onboarding_completed (boolean)
├── created_at (timestamp)
└── updated_at (timestamp)

-- Extended Profile Data
business_profiles
├── id (uuid, PK)
├── user_id (uuid, FK → profiles)
├── company_name (text)
├── industry (text)
├── role (text)
├── team_size (text)
├── key_challenges (text[])
└── created_at (timestamp)

-- User Goals
goals
├── id (uuid, PK)
├── user_id (uuid, FK → profiles)
├── title (text)
├── description (text)
├── category (text)
├── priority (integer)
├── status (text)
├── target_date (date)
├── created_at (timestamp)
└── updated_at (timestamp)

-- Conversations
conversations
├── id (uuid, PK)
├── user_id (uuid, FK → profiles)
├── title (text)
├── session_type (text)
├── created_at (timestamp)
└── updated_at (timestamp)

-- Messages
messages
├── id (uuid, PK)
├── conversation_id (uuid, FK → conversations)
├── user_id (uuid, FK → profiles)
├── role (text: 'user' | 'assistant')
├── content (text)
└── created_at (timestamp)

-- Vector Embeddings for RAG
conversation_embeddings
├── id (uuid, PK)
├── message_id (uuid, FK → messages)
├── user_id (uuid, FK → profiles)
├── embedding (vector(1536))
├── content (text)
├── role (text)
└── created_at (timestamp)

-- Extracted Action Items
action_items
├── id (uuid, PK)
├── user_id (uuid, FK → profiles)
├── conversation_id (uuid, FK → conversations)
├── task (text)
├── description (text)
├── priority (text)
├── due_date (date)
├── status (text)
└── created_at (timestamp)

-- Summaries (Daily/Weekly/Monthly)
daily_summaries / weekly_summaries / monthly_summaries
├── id (uuid, PK)
├── user_id (uuid, FK → profiles)
├── period_start (date)
├── period_end (date)
├── summary (text)
├── key_topics (text[])
├── wins (text[])
├── challenges (text[])
├── goals_progress (jsonb)
└── created_at (timestamp)

-- Usage Tracking
token_usage
├── id (uuid, PK)
├── user_id (uuid, FK → profiles)
├── model (text)
├── input_tokens (integer)
├── output_tokens (integer)
├── input_cost (decimal)
├── output_cost (decimal)
└── created_at (timestamp)

-- Subscriptions
subscriptions
├── id (uuid, PK)
├── user_id (uuid, FK → profiles)
├── status (text)
├── plan (text)
├── payment_provider_id (text)
├── expires_at (timestamp)
└── created_at (timestamp)
```

### Database Extensions

```sql
-- Required PostgreSQL Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  -- UUID generation
CREATE EXTENSION IF NOT EXISTS "vector";      -- pgvector for embeddings
```

### Vector Index for Semantic Search

```sql
-- IVFFlat index for fast cosine similarity search
CREATE INDEX ON conversation_embeddings
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```

---

## API Design Patterns

### Standard API Route Structure

```typescript
// /src/app/api/[feature]/route.ts

import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  // 1. Authentication
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  // 2. Input Validation
  const body = await request.json()
  // Validate with Zod schema...

  // 3. Business Logic
  try {
    const result = await performOperation(body)

    // 4. Database Operations
    const { data, error } = await supabase
      .from('table')
      .insert(result)

    if (error) throw error

    // 5. Return Response
    return Response.json(data)
  } catch (error) {
    return Response.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}
```

### Streaming Response Pattern

```typescript
export async function POST(request: Request) {
  // ... auth & validation ...

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()

      for await (const chunk of aiResponse.stream) {
        const content = chunk.text()
        controller.enqueue(
          encoder.encode(`0:${JSON.stringify(content)}\n`)
        )
      }

      controller.close()
    }
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  })
}
```

### Error Handling with Step Tracking

```typescript
export async function POST(request: Request) {
  let step = 'init'

  try {
    step = 'authenticate'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    step = 'validate'
    const body = await request.json()

    step = 'process'
    const result = await processRequest(body)

    step = 'save'
    await saveToDatabase(result)

    return Response.json({ success: true })
  } catch (error) {
    console.error(`Error at step "${step}":`, error)
    return Response.json(
      { error: (error as Error).message, step },
      { status: 500 }
    )
  }
}
```

### API Route Categories

| Category | Endpoints | Purpose |
|----------|-----------|---------|
| `/api/chat/*` | Text conversation handling |
| `/api/voice/*` | Voice session management |
| `/api/memory/*` | Embeddings & summaries |
| `/api/sessions/*` | Structured session management |
| `/api/goals/*` | Goal CRUD operations |
| `/api/admin/*` | Admin dashboard data |
| `/api/payments/*` | Payment processing |
| `/api/cron/*` | Scheduled job endpoints |
| `/api/settings/*` | User preferences |

---

## AI Integration Patterns

### Context Assembly for AI Requests

```typescript
// /src/lib/ai/context.ts

interface UserContext {
  profile: {
    name: string
    email: string
  }
  business: {
    company: string
    industry: string
    role: string
    challenges: string[]
  }
  goals: Goal[]
  actionItems: ActionItem[]
  recentHistory: Message[]
  relevantMemories: Memory[]  // From RAG search
  summaries: {
    weekly: string
    monthly: string
  }
}

export async function assembleUserContext(
  userId: string,
  currentQuery: string
): Promise<UserContext> {
  // 1. Fetch user profile
  const profile = await fetchProfile(userId)

  // 2. Fetch business context
  const business = await fetchBusinessProfile(userId)

  // 3. Fetch active goals
  const goals = await fetchGoals(userId, { status: 'active' })

  // 4. Fetch pending action items
  const actionItems = await fetchActionItems(userId, { status: 'pending' })

  // 5. Fetch recent conversation history
  const recentHistory = await fetchRecentMessages(userId, limit: 10)

  // 6. Semantic search for relevant memories
  const queryEmbedding = await generateEmbedding(currentQuery)
  const relevantMemories = await searchSimilarMemories(
    userId,
    queryEmbedding,
    { threshold: 0.7, limit: 5 }
  )

  // 7. Fetch recent summaries
  const summaries = await fetchSummaries(userId)

  return {
    profile,
    business,
    goals,
    actionItems,
    recentHistory,
    relevantMemories,
    summaries
  }
}
```

### System Prompt Generation

```typescript
// /src/lib/ai/prompts.ts

export function generateSystemPrompt(context: UserContext): string {
  return `
You are an AI assistant helping ${context.profile.name}.

## User Context
- Role: ${context.business.role} at ${context.business.company}
- Industry: ${context.business.industry}
- Key Challenges: ${context.business.challenges.join(', ')}

## Active Goals
${context.goals.map(g => `- ${g.title} (Priority: ${g.priority})`).join('\n')}

## Pending Action Items
${context.actionItems.map(a => `- ${a.task}`).join('\n')}

## Relevant Past Conversations
${context.relevantMemories.map(m => m.content).join('\n\n')}

## Recent Context
${context.summaries.weekly}

## Instructions
- Be direct and conversational
- Keep responses concise (2-3 sentences for simple queries)
- Reference specific details from the user's context
- When the user commits to an action, mark it with 📋
`
}
```

### Action Item Extraction

```typescript
// /src/lib/ai/actions.ts

interface ExtractedAction {
  task: string
  description: string
  priority: 'high' | 'medium' | 'low'
  due_date: string | null
}

export async function extractActionItems(
  conversationContent: string
): Promise<ExtractedAction[]> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Extract concrete action items the user committed to.
        Only include actions they explicitly agreed to do.
        Return JSON array: [{ task, description, priority, due_date }]`
      },
      { role: 'user', content: conversationContent }
    ],
    response_format: { type: 'json_object' }
  })

  return JSON.parse(response.choices[0].message.content).actions
}
```

### Structured Conversation Frameworks

```typescript
// /src/lib/ai/frameworks.ts

interface Framework {
  name: string
  description: string
  stages: Stage[]
  estimatedDuration: number
}

interface Stage {
  name: string
  purpose: string
  promptTemplate: string
  expectedOutcome: string
}

export const GROW_FRAMEWORK: Framework = {
  name: 'GROW',
  description: 'Goal-Reality-Options-Will framework for problem-solving',
  estimatedDuration: 45,
  stages: [
    {
      name: 'Goal',
      purpose: 'Define what the user wants to achieve',
      promptTemplate: 'What specific outcome do you want from this session?',
      expectedOutcome: 'Clear, measurable goal statement'
    },
    {
      name: 'Reality',
      purpose: 'Understand current situation',
      promptTemplate: 'Where are you now in relation to this goal?',
      expectedOutcome: 'Honest assessment of current state'
    },
    {
      name: 'Options',
      purpose: 'Explore possible approaches',
      promptTemplate: 'What options do you have? What else could you try?',
      expectedOutcome: 'List of potential actions'
    },
    {
      name: 'Will',
      purpose: 'Commit to specific actions',
      promptTemplate: 'What will you do? When will you do it?',
      expectedOutcome: 'Concrete commitments with timelines'
    }
  ]
}
```

---

## Real-Time Features

### WebSocket Architecture for Voice

```typescript
// /src/components/voice/VoiceConversation.tsx

export function VoiceConversation() {
  const wsRef = useRef<WebSocket | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isRecording, setIsRecording] = useState(false)

  const connect = async () => {
    // 1. Get WebSocket URL from API
    const response = await fetch('/api/voice/session', { method: 'POST' })
    const { wsUrl } = await response.json()

    // 2. Establish WebSocket connection
    wsRef.current = new WebSocket(wsUrl)

    wsRef.current.onopen = () => {
      setIsConnected(true)
      // Send initial configuration
      wsRef.current?.send(JSON.stringify({
        type: 'setup',
        config: { sampleRate: 24000, encoding: 'pcm16' }
      }))
    }

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      handleServerMessage(data)
    }

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    wsRef.current.onclose = () => {
      setIsConnected(false)
    }
  }

  const handleServerMessage = (data: ServerMessage) => {
    switch (data.type) {
      case 'audio':
        playAudio(data.audio)
        break
      case 'transcript':
        updateTranscript(data.text)
        break
      case 'response_end':
        handleResponseComplete()
        break
    }
  }

  const sendAudio = (audioData: Float32Array) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      // Convert Float32 to 16-bit PCM
      const pcm16 = float32ToPcm16(audioData)
      // Base64 encode for transmission
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(pcm16.buffer)))

      wsRef.current.send(JSON.stringify({
        type: 'audio',
        audio: base64Audio
      }))
    }
  }

  // ... component rendering
}
```

### Audio Processing Utilities

```typescript
// Audio conversion utilities

function float32ToPcm16(float32Array: Float32Array): Int16Array {
  const pcm16 = new Int16Array(float32Array.length)
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]))
    pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff
  }
  return pcm16
}

function pcm16ToFloat32(pcm16Array: Int16Array): Float32Array {
  const float32 = new Float32Array(pcm16Array.length)
  for (let i = 0; i < pcm16Array.length; i++) {
    float32[i] = pcm16Array[i] / (pcm16Array[i] < 0 ? 0x8000 : 0x7fff)
  }
  return float32
}

function resampleAudio(
  audioData: Float32Array,
  fromSampleRate: number,
  toSampleRate: number
): Float32Array {
  const ratio = fromSampleRate / toSampleRate
  const newLength = Math.round(audioData.length / ratio)
  const result = new Float32Array(newLength)

  for (let i = 0; i < newLength; i++) {
    const srcIndex = i * ratio
    const srcIndexFloor = Math.floor(srcIndex)
    const srcIndexCeil = Math.min(srcIndexFloor + 1, audioData.length - 1)
    const t = srcIndex - srcIndexFloor
    result[i] = audioData[srcIndexFloor] * (1 - t) + audioData[srcIndexCeil] * t
  }

  return result
}
```

### HTTP Streaming for Text

```typescript
// Client-side streaming consumption

async function streamChat(message: string, conversationId: string) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, conversationId })
  })

  const reader = response.body?.getReader()
  const decoder = new TextDecoder()
  let fullResponse = ''

  while (reader) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value)
    const lines = chunk.split('\n').filter(Boolean)

    for (const line of lines) {
      if (line.startsWith('0:')) {
        const content = JSON.parse(line.slice(2))
        fullResponse += content
        updateUI(fullResponse)  // Progressive update
      }
    }
  }

  return fullResponse
}
```

---

## Memory & RAG System

### Embedding Generation

```typescript
// /src/lib/memory/embeddings.ts

import OpenAI from 'openai'

const openai = new OpenAI()

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
    dimensions: 1536
  })

  return response.data[0].embedding
}

export async function processMessageEmbedding(
  messageId: string,
  userId: string,
  content: string,
  role: string
) {
  const embedding = await generateEmbedding(content)

  await supabase
    .from('conversation_embeddings')
    .insert({
      message_id: messageId,
      user_id: userId,
      embedding,
      content,
      role
    })
}
```

### Semantic Search

```typescript
// /src/lib/memory/embeddings.ts

export async function searchSimilarMemories(
  userId: string,
  queryEmbedding: number[],
  options: {
    threshold?: number
    limit?: number
    excludeConversationId?: string
  } = {}
): Promise<Memory[]> {
  const { threshold = 0.7, limit = 5, excludeConversationId } = options

  // Use pgvector's cosine similarity operator
  let query = supabase
    .rpc('match_embeddings', {
      query_embedding: queryEmbedding,
      match_threshold: threshold,
      match_count: limit,
      p_user_id: userId
    })

  if (excludeConversationId) {
    query = query.neq('conversation_id', excludeConversationId)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

// SQL function for vector search
/*
CREATE OR REPLACE FUNCTION match_embeddings(
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  p_user_id uuid
)
RETURNS TABLE (
  id uuid,
  content text,
  role text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ce.id,
    ce.content,
    ce.role,
    1 - (ce.embedding <=> query_embedding) as similarity
  FROM conversation_embeddings ce
  WHERE ce.user_id = p_user_id
    AND 1 - (ce.embedding <=> query_embedding) > match_threshold
  ORDER BY ce.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
*/
```

### Summary Generation

```typescript
// /src/lib/memory/summaries.ts

export async function generateWeeklySummary(
  userId: string,
  weekStart: Date,
  weekEnd: Date
) {
  // 1. Fetch all messages from the week
  const messages = await fetchMessagesInRange(userId, weekStart, weekEnd)

  // 2. Fetch daily summaries if available
  const dailySummaries = await fetchDailySummaries(userId, weekStart, weekEnd)

  // 3. Fetch goals progress
  const goals = await fetchGoals(userId)

  // 4. Generate summary with AI
  const summary = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Generate a weekly summary for a user. Include:
        - Key wins and accomplishments
        - Challenges faced
        - Progress on goals
        - Patterns or insights noticed
        - Recommendations for next week`
      },
      {
        role: 'user',
        content: JSON.stringify({
          dailySummaries,
          messageCount: messages.length,
          goals,
          weekStart,
          weekEnd
        })
      }
    ]
  })

  // 5. Save summary
  await supabase
    .from('weekly_summaries')
    .insert({
      user_id: userId,
      week_start: weekStart,
      week_end: weekEnd,
      summary: summary.choices[0].message.content,
      // ... parsed fields
    })
}
```

---

## Authentication & Authorization

### Supabase SSR Authentication

```typescript
// /src/lib/supabase/server.ts

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component - ignore
          }
        },
      },
    }
  )
}
```

```typescript
// /src/lib/supabase/client.ts

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### Middleware for Session Refresh

```typescript
// /src/middleware.ts

import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

```typescript
// /src/lib/supabase/middleware.ts

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  await supabase.auth.getUser()

  return response
}
```

### Protected API Route Pattern

```typescript
// Standard auth check in all API routes

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  // User is authenticated, proceed...
}
```

### Admin Authorization

```typescript
// /src/lib/admin.ts

export async function isAdmin(userId: string): Promise<boolean> {
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', userId)
    .single()

  return profile?.is_admin === true
}

// Usage in admin API routes
export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !(await isAdmin(user.id))) {
    return new Response('Forbidden', { status: 403 })
  }

  // Admin-only logic...
}
```

### Feature Gating by Subscription

```typescript
// /src/lib/subscription.ts

type SubscriptionStatus = 'free' | 'pro' | 'enterprise'

interface FeatureAccess {
  textChat: boolean
  voiceChat: boolean
  structuredSessions: boolean
  actionItems: boolean
  unlimitedHistory: boolean
  advancedAnalytics: boolean
}

const FEATURE_MATRIX: Record<SubscriptionStatus, FeatureAccess> = {
  free: {
    textChat: true,
    voiceChat: false,
    structuredSessions: false,
    actionItems: false,
    unlimitedHistory: false,
    advancedAnalytics: false
  },
  pro: {
    textChat: true,
    voiceChat: true,
    structuredSessions: true,
    actionItems: true,
    unlimitedHistory: true,
    advancedAnalytics: false
  },
  enterprise: {
    textChat: true,
    voiceChat: true,
    structuredSessions: true,
    actionItems: true,
    unlimitedHistory: true,
    advancedAnalytics: true
  }
}

export async function checkFeatureAccess(
  userId: string,
  feature: keyof FeatureAccess
): Promise<boolean> {
  const status = await getSubscriptionStatus(userId)
  return FEATURE_MATRIX[status][feature]
}
```

---

## State Management

### Component-Level State Pattern

```typescript
// Primary approach: React useState for component state

function ConversationComponent() {
  // Loading states
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)

  // Error states
  const [error, setError] = useState<string | null>(null)

  // Data states
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')

  // Refs for non-rendering state
  const scrollRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Async operations with state management
  const sendMessage = async () => {
    setIsSending(true)
    setError(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: inputValue })
      })

      if (!response.ok) throw new Error('Failed to send')

      const data = await response.json()
      setMessages(prev => [...prev, data])
      setInputValue('')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsSending(false)
    }
  }

  // ...
}
```

### Zustand Store Pattern (When Needed)

```typescript
// /src/stores/appStore.ts

import { create } from 'zustand'

interface AppState {
  // Auth state
  user: User | null
  setUser: (user: User | null) => void

  // UI state
  sidebarOpen: boolean
  toggleSidebar: () => void

  // Active conversation
  activeConversationId: string | null
  setActiveConversation: (id: string | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  activeConversationId: null,
  setActiveConversation: (id) => set({ activeConversationId: id }),
}))

// Usage in components
function Header() {
  const { user, sidebarOpen, toggleSidebar } = useAppStore()
  // ...
}
```

### Form State with React Hook Form

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const goalSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['high', 'medium', 'low']),
  targetDate: z.string().optional()
})

type GoalFormData = z.infer<typeof goalSchema>

function GoalForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema)
  })

  const onSubmit = async (data: GoalFormData) => {
    await fetch('/api/goals', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title')} />
      {errors.title && <span>{errors.title.message}</span>}
      {/* ... */}
    </form>
  )
}
```

---

## UI Component Architecture

### Design System Configuration

```typescript
// tailwind.config.ts

import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Primary palette
        primary: {
          50: '#e6f0ff',
          100: '#b3d1ff',
          500: '#0066cc',
          600: '#0052a3',
          700: '#003d7a',
          900: '#001f3d'
        },
        // Neutral palette
        neutral: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#6c757d',
          600: '#495057',
          700: '#343a40',
          800: '#212529',
          900: '#121416'
        },
        // Semantic colors
        success: '#28a745',
        warning: '#ffc107',
        error: '#dc3545',
        info: '#17a2b8'
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'monospace']
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-subtle': 'pulseSubtle 2s infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        }
      }
    }
  },
  plugins: []
}

export default config
```

### Component Patterns

```typescript
// Button component with variants

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: React.ReactNode
  onClick?: () => void
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading,
  children,
  onClick
}: ButtonProps) {
  const baseStyles = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2'

  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-neutral-200 text-neutral-800 hover:bg-neutral-300 focus:ring-neutral-400',
    ghost: 'bg-transparent text-neutral-600 hover:bg-neutral-100 focus:ring-neutral-400'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]}`}
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  )
}
```

```typescript
// Message bubble component

interface MessageBubbleProps {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function MessageBubble({ role, content, timestamp }: MessageBubbleProps) {
  const isUser = role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`
          max-w-[80%] rounded-2xl px-4 py-3
          ${isUser
            ? 'bg-primary-600 text-white rounded-br-md'
            : 'bg-neutral-100 text-neutral-800 rounded-bl-md'
          }
        `}
      >
        <div className="prose prose-sm">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
        <div className={`text-xs mt-1 ${isUser ? 'text-primary-200' : 'text-neutral-500'}`}>
          {format(timestamp, 'HH:mm')}
        </div>
      </div>
    </div>
  )
}
```

### Error Boundary

```typescript
// /src/components/ErrorBoundary.tsx

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    // Send to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-6 bg-error/10 rounded-lg">
          <h2 className="text-lg font-semibold text-error">Something went wrong</h2>
          <p className="mt-2 text-neutral-600">{this.state.error?.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-4 btn btn-secondary"
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
```

---

## Deployment Architecture

### Vercel Configuration

```json
// vercel.json

{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["iad1"],
  "functions": {
    "src/app/api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 60
    }
  },
  "crons": [
    {
      "path": "/api/cron/daily-summary",
      "schedule": "0 2 * * *"
    },
    {
      "path": "/api/cron/weekly-summary",
      "schedule": "0 3 * * 0"
    }
  ]
}
```

### Environment Variables

```bash
# .env.example

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Services
OPENAI_API_KEY=your_openai_key
GOOGLE_GEMINI_API_KEY=your_gemini_key

# Voice Services
ELEVENLABS_API_KEY=your_elevenlabs_key

# Payments
REVOLUT_API_KEY=your_revolut_key
REVOLUT_WEBHOOK_SECRET=your_webhook_secret

# Email
RESEND_API_KEY=your_resend_key

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-app.com
CRON_SECRET=your_cron_secret
```

### PWA Configuration

```javascript
// next.config.js

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === 'development',
  workboxOptions: {
    disableDevLogs: true,
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|webp|svg|gif)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'images',
          expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 }
        }
      },
      {
        urlPattern: /^https:\/\/.*\/api\/.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api',
          expiration: { maxEntries: 50, maxAgeSeconds: 60 * 5 }
        }
      }
    ]
  }
})

module.exports = withPWA({
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' }
    ]
  }
})
```

---

## Development Workflow

### Available Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }
}
```

### Local Development Setup

```bash
# 1. Clone repository
git clone <repo-url>
cd <project>

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# 4. Set up Supabase
# - Create project at supabase.com
# - Run migrations (if any)
# - Enable pgvector extension

# 5. Start development server
npm run dev
```

### Database Migrations Pattern

```sql
-- migrations/001_initial_schema.sql

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  subscription_status TEXT DEFAULT 'free',
  is_admin BOOLEAN DEFAULT FALSE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

---

## Security Considerations

### Authentication Security
- JWT tokens stored in HTTP-only cookies
- Automatic session refresh via middleware
- Server-side auth validation on all API routes

### Database Security
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Service role key used only server-side

### API Security
- All endpoints require authentication (except public routes)
- Admin endpoints have additional authorization checks
- Input validation with Zod schemas
- Rate limiting can be added via Vercel

### Secret Management
- Environment variables for all secrets
- Never committed to version control
- Separate keys for development/production

---

## Cost Tracking

### Token Usage Monitoring

```typescript
// Track AI API usage for cost analysis

interface TokenUsage {
  model: string
  inputTokens: number
  outputTokens: number
  inputCost: number
  outputCost: number
}

const PRICING: Record<string, { input: number; output: number }> = {
  'gemini-2.5-flash': { input: 0.00030, output: 0.0025 },
  'gpt-4o': { input: 0.005, output: 0.015 },
  'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
  'text-embedding-3-small': { input: 0.00002, output: 0 }
}

export async function trackUsage(
  userId: string,
  model: string,
  inputTokens: number,
  outputTokens: number
) {
  const pricing = PRICING[model] || { input: 0, output: 0 }

  await supabase.from('token_usage').insert({
    user_id: userId,
    model,
    input_tokens: inputTokens,
    output_tokens: outputTokens,
    input_cost: (inputTokens / 1000) * pricing.input,
    output_cost: (outputTokens / 1000) * pricing.output
  })
}
```

---

## Summary

This architecture provides a solid foundation for building AI-powered conversational applications with:

- **Modern Stack**: Next.js 14 + TypeScript + Tailwind CSS
- **Scalable Backend**: Supabase (PostgreSQL) with serverless API routes
- **AI Integration**: Multi-model support with streaming responses
- **Long-Term Memory**: RAG system with vector embeddings
- **Real-Time Voice**: WebSocket-based bidirectional audio
- **Structured Workflows**: Framework-based guided sessions
- **Monetization**: Subscription tiers with feature gating
- **Admin Tools**: Dashboard for analytics and oversight

The patterns described are production-tested and can be adapted for various use cases including customer support, education, healthcare, professional services, and more.
