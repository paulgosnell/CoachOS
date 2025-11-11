# Coach OS - Technical Architecture Document

**Version:** 1.0  
**Last Updated:** November 11, 2025  
**Status:** MVP Planning

---

## Technology Stack Overview

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **UI Library:** React 18
- **Styling:** TailwindCSS 3.4
- **AI Integration:** Vercel AI SDK 3.0
- **Voice:** ElevenLabs API or OpenAI Realtime API
- **PWA:** next-pwa plugin
- **State Management:** React Context + Zustand (for complex state)
- **Forms:** React Hook Form + Zod validation

### Backend
- **Database:** Supabase (PostgreSQL 15)
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage (for voice recordings)
- **Realtime:** Supabase Realtime (for live updates)
- **Edge Functions:** Supabase Edge Functions (Deno)
- **Vector Search:** pgvector extension for RAG

### AI & ML
- **LLM:** OpenAI GPT-4o or Anthropic Claude Sonnet 4
- **Embeddings:** OpenAI text-embedding-3-small
- **Voice Synthesis:** ElevenLabs or OpenAI TTS
- **Voice Recognition:** OpenAI Whisper (via API)

### Infrastructure
- **Hosting:** Vercel (frontend + API routes)
- **Database Hosting:** Supabase Cloud
- **CDN:** Vercel Edge Network
- **Monitoring:** Sentry (errors) + Vercel Analytics
- **Payments:** Stripe (post-MVP)

### Development Tools
- **Version Control:** Git + GitHub
- **Package Manager:** pnpm
- **Code Quality:** ESLint + Prettier
- **Type Checking:** TypeScript strict mode
- **Testing:** Vitest (unit) + Playwright (e2e)

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Next.js 14 PWA (Mobile-First)                         │ │
│  │  - React Components (TypeScript)                       │ │
│  │  - TailwindCSS Styling                                 │ │
│  │  - Service Worker (Offline Support)                    │ │
│  │  - Push Notification Handler                           │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                      API LAYER (Vercel)                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Next.js API Routes (Edge Runtime)                     │ │
│  │  - /api/chat (streaming responses)                     │ │
│  │  - /api/voice (voice processing)                       │ │
│  │  - /api/sessions (session management)                  │ │
│  │  - /api/context (context retrieval)                    │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                  AI ORCHESTRATION LAYER                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   OpenAI/    │  │  ElevenLabs  │  │   Vercel     │      │
│  │   Claude     │  │  Voice API   │  │   AI SDK     │      │
│  │   (LLM)      │  │  (TTS/STT)   │  │  (Streaming) │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE LAYER                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  PostgreSQL 15 + pgvector                              │ │
│  │  - User profiles & business data                       │ │
│  │  - Conversations & messages                            │ │
│  │  - Summaries & embeddings                              │ │
│  │  - Goals & action items                                │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Supabase Storage                                      │ │
│  │  - Voice recordings (audio files)                      │ │
│  │  - User uploads (future)                               │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Edge Functions (Deno)                                 │ │
│  │  - generate-daily-summary (scheduled)                  │ │
│  │  - generate-embeddings (on message create)             │ │
│  │  - send-push-notifications (scheduled)                 │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Database Schema (PostgreSQL)

### Core Tables

```sql
-- Enable pgvector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================================
-- USER & PROFILE TABLES
-- ============================================================================

-- Profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  coach_preference JSONB DEFAULT '{}'::JSONB, -- {voice: "male/female", style: "strategic/tactical/supportive", personality: "formal/casual"}
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Business profiles
CREATE TABLE business_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  industry TEXT,
  company_stage TEXT, -- startup, scaleup, corporate
  company_name TEXT,
  location TEXT,
  revenue_range TEXT, -- e.g., "0-100k", "100k-1m", "1m-10m", "10m+"
  team_size INTEGER,
  role TEXT, -- e.g., "Founder", "CEO", "VP Product"
  reports_to TEXT,
  direct_reports INTEGER,
  markets TEXT[], -- geographical markets
  key_challenges TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Goals and priorities
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT, -- revenue, product, hiring, market_expansion, personal
  status TEXT DEFAULT 'active', -- active, completed, on_hold, abandoned
  priority INTEGER, -- 1 (highest) to 5 (lowest)
  target_date DATE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_goals_user_status ON goals(user_id, status);
CREATE INDEX idx_goals_target_date ON goals(target_date) WHERE status = 'active';

-- ============================================================================
-- CONVERSATION TABLES
-- ============================================================================

-- Conversations (groups messages into sessions)
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  session_type TEXT NOT NULL, -- quick_checkin, structured_session
  title TEXT, -- AI-generated or user-provided
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_conversations_user_started ON conversations(user_id, started_at DESC);
CREATE INDEX idx_conversations_type ON conversations(session_type);

-- Messages (individual chat messages)
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL, -- user, assistant, system
  content TEXT NOT NULL,
  content_type TEXT DEFAULT 'text', -- text, voice_transcript
  audio_url TEXT, -- S3/Supabase Storage URL if voice message
  metadata JSONB DEFAULT '{}'::JSONB, -- {tokens_used, model_used, latency_ms}
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at);
CREATE INDEX idx_messages_user ON messages(user_id, created_at DESC);

-- ============================================================================
-- MEMORY & SUMMARY TABLES
-- ============================================================================

-- Daily summaries (AI-generated end-of-day recaps)
CREATE TABLE daily_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  summary TEXT NOT NULL, -- AI-generated prose summary
  key_topics TEXT[], -- extracted topics for search/filtering
  sentiment TEXT, -- positive, neutral, negative, mixed
  action_items JSONB DEFAULT '[]'::JSONB, -- [{task, status, due_date, completed_at}]
  conversation_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE INDEX idx_daily_summaries_user_date ON daily_summaries(user_id, date DESC);

-- Weekly summaries (rolled up from daily summaries)
CREATE TABLE weekly_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  summary TEXT NOT NULL,
  progress_notes TEXT,
  goals_progress JSONB DEFAULT '[]'::JSONB, -- [{goal_id, progress_description}]
  key_decisions TEXT[],
  challenges_faced TEXT[],
  wins TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);

CREATE INDEX idx_weekly_summaries_user_week ON weekly_summaries(user_id, week_start DESC);

-- ============================================================================
-- STRUCTURED COACHING SESSIONS
-- ============================================================================

-- Coaching sessions (scheduled structured sessions)
CREATE TABLE coaching_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
  scheduled_for TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 45,
  framework_used TEXT DEFAULT 'grow', -- grow, scaling_up, eos, custom
  goal TEXT, -- what user wants from this session
  outcome_summary TEXT, -- AI-generated summary of outcomes
  action_items JSONB DEFAULT '[]'::JSONB,
  rating INTEGER, -- 1-5 stars user rating
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_coaching_sessions_user_scheduled ON coaching_sessions(user_id, scheduled_for);
CREATE INDEX idx_coaching_sessions_completed ON coaching_sessions(completed, scheduled_for);

-- ============================================================================
-- RAG (RETRIEVAL AUGMENTED GENERATION) TABLES
-- ============================================================================

-- Vector embeddings for semantic search
CREATE TABLE conversation_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  embedding VECTOR(1536), -- OpenAI text-embedding-3-small dimensions
  content_snippet TEXT NOT NULL, -- the text that was embedded
  metadata JSONB DEFAULT '{}'::JSONB, -- {date, session_type, key_topics}
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optimize vector similarity search
CREATE INDEX idx_embeddings_user ON conversation_embeddings(user_id);
CREATE INDEX idx_embeddings_vector ON conversation_embeddings 
  USING ivfflat (embedding vector_cosine_ops) 
  WITH (lists = 100);

-- ============================================================================
-- ACTION ITEMS & TASKS
-- ============================================================================

CREATE TABLE action_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
  coaching_session_id UUID REFERENCES coaching_sessions(id) ON DELETE SET NULL,
  task TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending', -- pending, in_progress, completed, cancelled
  priority TEXT DEFAULT 'medium', -- low, medium, high
  due_date DATE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_action_items_user_status ON action_items(user_id, status);
CREATE INDEX idx_action_items_due_date ON action_items(due_date) WHERE status != 'completed';

-- ============================================================================
-- ANALYTICS & USAGE TRACKING
-- ============================================================================

CREATE TABLE usage_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- session_start, message_sent, voice_used, session_completed
  event_data JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_usage_events_user_type ON usage_events(user_id, event_type, created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaching_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_events ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only see their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Business profiles: users can only see/update their own
CREATE POLICY "Users can manage own business profile" ON business_profiles
  FOR ALL USING (auth.uid() = user_id);

-- Goals: users can only see/manage their own
CREATE POLICY "Users can manage own goals" ON goals
  FOR ALL USING (auth.uid() = user_id);

-- Conversations: users can only see/manage their own
CREATE POLICY "Users can manage own conversations" ON conversations
  FOR ALL USING (auth.uid() = user_id);

-- Messages: users can only see/manage their own
CREATE POLICY "Users can manage own messages" ON messages
  FOR ALL USING (auth.uid() = user_id);

-- Apply similar policies to all other tables...
-- (Pattern: FOR ALL USING (auth.uid() = user_id))

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_profiles_updated_at BEFORE UPDATE ON business_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coaching_sessions_updated_at BEFORE UPDATE ON coaching_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_action_items_updated_at BEFORE UPDATE ON action_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically end conversation when last message is > 10 min old
CREATE OR REPLACE FUNCTION auto_end_conversation()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET ended_at = NEW.created_at,
      duration_seconds = EXTRACT(EPOCH FROM (NEW.created_at - started_at))
  WHERE id = NEW.conversation_id
    AND ended_at IS NULL
    AND started_at < NEW.created_at - INTERVAL '10 minutes';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_end_conversation_trigger AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION auto_end_conversation();
```

---

## API Architecture

### Next.js API Routes (Edge Runtime)

#### 1. `/api/chat` - Main chat endpoint (streaming)

```typescript
// POST /api/chat
// Handles both text and voice conversations with streaming responses

interface ChatRequest {
  message: string;
  conversationId?: string; // if continuing existing conversation
  sessionType: 'quick_checkin' | 'structured_session';
  mode: 'text' | 'voice';
}

interface ChatResponse {
  // Streams back using Vercel AI SDK
  // Returns conversation_id, message_id for storage
}

Flow:
1. Receive user message
2. Fetch user context:
   - Business profile
   - Active goals
   - Last 7 days daily summaries
   - RAG search for relevant past conversations
3. Build system prompt with full context
4. Stream response from OpenAI/Claude
5. Store message in database
6. Trigger background: generate embedding
7. Return response with metadata
```

#### 2. `/api/voice/transcribe` - Voice to text

```typescript
// POST /api/voice/transcribe
// Converts voice recording to text using Whisper

interface TranscribeRequest {
  audioFile: File; // base64 or multipart
  conversationId?: string;
}

interface TranscribeResponse {
  text: string;
  confidence: number;
  duration: number;
}

Flow:
1. Receive audio file
2. Upload to Supabase Storage
3. Send to OpenAI Whisper API
4. Return transcript
5. (Optional) automatically send to /api/chat
```

#### 3. `/api/voice/synthesize` - Text to speech

```typescript
// POST /api/voice/synthesize
// Converts coach response to speech

interface SynthesizeRequest {
  text: string;
  voiceId: string; // from user coach_preference
}

interface SynthesizeResponse {
  audioUrl: string;
  duration: number;
}

Flow:
1. Receive text from coach
2. Send to ElevenLabs/OpenAI TTS
3. Store audio in Supabase Storage
4. Return audio URL
```

#### 4. `/api/context/retrieve` - Get user context

```typescript
// GET /api/context/retrieve
// Fetches comprehensive user context for prompt building

interface ContextResponse {
  businessProfile: BusinessProfile;
  activeGoals: Goal[];
  recentSummaries: DailySummary[];
  actionItems: ActionItem[];
  relevantHistory?: ConversationSnippet[]; // from RAG search
}

Flow:
1. Fetch business_profiles row
2. Fetch active goals
3. Fetch last 7 days of daily_summaries
4. Fetch pending action_items
5. (Optional) RAG search if query hint provided
6. Return comprehensive context object
```

#### 5. `/api/sessions/schedule` - Book coaching session

```typescript
// POST /api/sessions/schedule
// Creates a scheduled structured coaching session

interface ScheduleRequest {
  scheduledFor: string; // ISO datetime
  durationMinutes: number;
  goal: string;
  framework?: string; // default 'grow'
}

interface ScheduleResponse {
  sessionId: string;
  calendarLinks: {
    google: string;
    apple: string;
    outlook: string;
  };
}

Flow:
1. Create coaching_sessions row
2. Generate calendar event URLs
3. Schedule push notification reminder
4. Return session details
```

#### 6. `/api/sessions/complete` - End coaching session

```typescript
// POST /api/sessions/complete
// Marks session as complete, generates summary

interface CompleteRequest {
  sessionId: string;
  rating?: number; // 1-5 stars
}

interface CompleteResponse {
  summary: string;
  actionItems: ActionItem[];
}

Flow:
1. Mark coaching_sessions.completed = true
2. Generate AI summary of conversation
3. Extract action items
4. Store in database
5. Return summary for user review
```

---

## Memory & Context System Implementation

### Three-Tier Context Strategy

#### Tier 1: Active Context (Always in Prompt)

**Retrieved on every request:**
```typescript
interface ActiveContext {
  businessProfile: {
    industry: string;
    role: string;
    companyStage: string;
    teamSize: number;
    // ... other profile fields
  };
  currentGoals: Goal[]; // active goals only
  recentActivity: {
    last7DaysSummaries: DailySummary[];
    pendingActionItems: ActionItem[];
    upcomingSessions: CoachingSession[];
  };
}
```

**Token usage:** ~1,000-2,000 tokens  
**Performance:** <100ms (single DB query with joins)

#### Tier 2: Recent History (Loaded on Demand)

**Retrieved when needed:**
```typescript
interface RecentHistory {
  last30DaysConversations: Conversation[];
  last3MonthsWeeklySummaries: WeeklySummary[];
}
```

**Token usage:** ~3,000-5,000 tokens  
**When to load:** User asks about recent events, or structured session

#### Tier 3: Deep Memory (RAG Search)

**Retrieved via semantic search:**
```typescript
interface DeepMemory {
  relevantSnippets: Array<{
    conversationId: string;
    date: string;
    snippet: string;
    similarity: number;
  }>;
}
```

**How it works:**
1. User mentions something like "that London pitch"
2. Embed the query: "London pitch meeting"
3. Cosine similarity search in `conversation_embeddings`
4. Return top 5 most relevant snippets
5. Include in prompt context

**Token usage:** ~1,000-2,000 tokens  
**Performance:** <200ms (pgvector optimized)

### RAG Implementation Details

**Embedding Generation (Background Job):**

```typescript
// Supabase Edge Function: generate-embeddings
// Triggered on new message insert

export async function generateEmbedding(messageId: string) {
  // 1. Fetch message content
  const message = await supabase
    .from('messages')
    .select('*')
    .eq('id', messageId)
    .single();
  
  // 2. Generate embedding
  const embedding = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: message.content,
  });
  
  // 3. Store in conversation_embeddings
  await supabase.from('conversation_embeddings').insert({
    user_id: message.user_id,
    conversation_id: message.conversation_id,
    message_id: messageId,
    embedding: embedding.data[0].embedding,
    content_snippet: message.content.substring(0, 500),
    metadata: {
      date: message.created_at,
      session_type: 'quick_checkin', // fetch from conversation
    }
  });
}
```

**Semantic Search (on-demand):**

```typescript
export async function semanticSearch(
  userId: string,
  query: string,
  limit: number = 5
) {
  // 1. Generate query embedding
  const queryEmbedding = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: query,
  });
  
  // 2. Vector similarity search
  const { data, error } = await supabase.rpc('match_conversations', {
    query_embedding: queryEmbedding.data[0].embedding,
    match_threshold: 0.7, // similarity threshold
    match_count: limit,
    user_id: userId,
  });
  
  return data; // sorted by similarity desc
}

// PostgreSQL function for vector search
CREATE OR REPLACE FUNCTION match_conversations(
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT,
  user_id UUID
)
RETURNS TABLE (
  id UUID,
  content_snippet TEXT,
  similarity FLOAT,
  created_at TIMESTAMPTZ
)
LANGUAGE SQL STABLE
AS $$
  SELECT
    id,
    content_snippet,
    1 - (embedding <=> query_embedding) AS similarity,
    created_at
  FROM conversation_embeddings
  WHERE user_id = user_id
    AND 1 - (embedding <=> query_embedding) > match_threshold
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;
```

### Daily Summary Generation

**Supabase Edge Function (Scheduled):**

```typescript
// Runs every day at 11:59 PM user's local time
// Cron: "59 23 * * *"

export async function generateDailySummary(userId: string, date: string) {
  // 1. Fetch all conversations from that day
  const conversations = await supabase
    .from('conversations')
    .select('*, messages(*)')
    .eq('user_id', userId)
    .gte('started_at', `${date}T00:00:00`)
    .lt('started_at', `${date}T23:59:59`);
  
  if (conversations.data.length === 0) return; // No activity
  
  // 2. Build prompt for summary
  const prompt = `
    Analyze this user's conversations from ${date} and create a concise daily summary.
    
    Conversations:
    ${conversations.data.map(c => 
      `Session ${c.id}: ${c.messages.map(m => m.content).join('\n')}`
    ).join('\n\n')}
    
    Generate a summary covering:
    1. Key topics discussed
    2. Important decisions or insights
    3. Emotional tone (positive/negative/mixed)
    4. Any action items or commitments
    
    Format as JSON:
    {
      "summary": "2-3 sentence overview",
      "key_topics": ["topic1", "topic2", ...],
      "sentiment": "positive/negative/mixed",
      "action_items": [{task, due_date}]
    }
  `;
  
  // 3. Get AI summary
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini', // faster, cheaper for summarization
    messages: [{role: 'user', content: prompt}],
    response_format: { type: 'json_object' }
  });
  
  const summary = JSON.parse(completion.choices[0].message.content);
  
  // 4. Store in daily_summaries
  await supabase.from('daily_summaries').insert({
    user_id: userId,
    date: date,
    summary: summary.summary,
    key_topics: summary.key_topics,
    sentiment: summary.sentiment,
    action_items: summary.action_items,
    conversation_count: conversations.data.length,
  });
}
```

---

## Voice Implementation

### Option 1: ElevenLabs (Recommended for MVP)

**Pros:**
- Best voice quality in market
- Low latency (~500ms)
- Wide range of voices
- Voice cloning possible (future)

**Cons:**
- More expensive than OpenAI
- Separate service (complexity)

**Implementation:**

```typescript
// Voice synthesis
const audio = await elevenlabs.textToSpeech({
  text: coachResponse,
  voice_id: user.coach_preference.voice_id, // stored in DB
  model_id: 'eleven_turbo_v2', // fastest model
});

// Voice transcription (still use OpenAI Whisper)
const transcript = await openai.audio.transcriptions.create({
  file: audioFile,
  model: 'whisper-1',
});
```

### Option 2: OpenAI Realtime API

**Pros:**
- One provider for everything
- Lower latency (<300ms)
- Cheaper
- Built-in conversation mode

**Cons:**
- Voice quality slightly lower than ElevenLabs
- Fewer voice options
- Beta (may have stability issues)

**Implementation:**

```typescript
// Realtime API with WebSocket
const ws = new WebSocket('wss://api.openai.com/v1/realtime');

// Bidirectional audio streaming
ws.send(JSON.stringify({
  type: 'input_audio_buffer.append',
  audio: base64AudioChunk,
}));

ws.on('message', (data) => {
  // Receive audio response in real-time
  const response = JSON.parse(data);
  if (response.type === 'response.audio.delta') {
    playAudio(response.delta); // stream to user
  }
});
```

**Recommendation:** Start with ElevenLabs for voice quality (marketing advantage), evaluate OpenAI Realtime after MVP launch.

---

## Deployment & Infrastructure

### Vercel Configuration

```json
// vercel.json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["lhr1"], // London (closest to UK users)
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key",
    "SUPABASE_SERVICE_ROLE_KEY": "@supabase-service-key",
    "OPENAI_API_KEY": "@openai-api-key",
    "ANTHROPIC_API_KEY": "@anthropic-api-key",
    "ELEVENLABS_API_KEY": "@elevenlabs-api-key"
  }
}
```

### Supabase Configuration

**Database:**
- Instance: Small (free tier for MVP)
- Region: London (eu-west-2)
- Backup: Daily automated backups
- Connection pooling: Enabled (max 15 connections)

**Storage:**
- Bucket: `voice-recordings` (private)
- Max file size: 10MB per audio file
- Retention: 90 days (auto-delete old recordings)

**Edge Functions:**
- Runtime: Deno
- Region: London
- Scheduled functions:
  - `generate-daily-summary`: Daily at 11:59 PM
  - `generate-embeddings`: On message insert (trigger)
  - `send-notifications`: Hourly check for pending reminders

### Monitoring & Observability

**Sentry (Error Tracking):**
```typescript
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1, // 10% of transactions
});
```

**Vercel Analytics:**
- Enabled for Web Vitals tracking
- Custom events:
  - `session_started`
  - `message_sent`
  - `voice_used`
  - `session_completed`

**Supabase Logs:**
- Database slow query alerts (>100ms)
- Edge function error alerts
- Storage upload alerts

---

## Security & Compliance

### Authentication Security

- Email/password with strong password requirements
- Rate limiting on auth endpoints (5 attempts / 15 min)
- Email verification required
- Password reset via secure token
- Session expiry: 7 days
- Refresh token rotation enabled

### Data Security

- **Encryption at rest:** All database data encrypted (Supabase default)
- **Encryption in transit:** TLS 1.3 for all API calls
- **Row Level Security (RLS):** Enabled on all tables
- **API keys:** Stored in Vercel env vars (not in code)
- **Voice recordings:** Stored in private Supabase bucket
- **Sensitive data:** Business profile, goals never shared with third parties

### GDPR Compliance (EU Users)

- **Data portability:** Export all user data endpoint
- **Right to deletion:** Delete account = cascade delete all data
- **Consent tracking:** Onboarding consent checkbox
- **Privacy policy:** Clear data usage explanation
- **Data retention:** 90 days after account deletion

### AI Safety

- **System prompt guardrails:** No financial/legal advice disclaimers
- **Content filtering:** Flag inappropriate user messages
- **Moderation:** Log concerning conversations for human review
- **User reporting:** Report issue button in chat

---

## Performance Optimization

### Target Metrics

- **Page load:** <1.5 seconds (FCP)
- **Time to Interactive:** <2.5 seconds
- **API response (text):** <500ms (p95)
- **API response (voice):** <1 second (p95)
- **Database queries:** <100ms (p95)
- **RAG search:** <200ms (p95)

### Optimization Strategies

**Frontend:**
- Code splitting (dynamic imports)
- Image optimization (Next.js Image)
- Font optimization (local fonts, subset)
- Service worker caching (offline-first)
- Lazy load non-critical components

**Backend:**
- Edge runtime for API routes (lower latency)
- Database connection pooling
- Redis caching for frequently accessed data (future)
- Batch database operations where possible

**AI:**
- Streaming responses (perceived performance)
- Context caching (reuse system prompt)
- Model selection: GPT-4o-mini for summaries (cheaper/faster)
- Parallel requests (embeddings + response)

---

## Scalability Considerations

### Current Architecture Limits

**MVP (0-1000 users):**
- Supabase Free tier: OK
- Vercel Hobby plan: OK
- No major bottlenecks expected

**Growth Phase (1,000-10,000 users):**
- Upgrade Supabase to Pro ($25/mo)
- Upgrade Vercel to Pro ($20/mo)
- Implement Redis caching
- Monitor database query performance

**Scale Phase (10,000+ users):**
- Dedicated database instance
- CDN for voice files
- Horizontal scaling (multiple regions)
- Advanced caching strategies
- Queue system for background jobs (BullMQ)

### Database Scaling Strategy

**Vertical scaling (first):**
- Increase Supabase instance size
- Add read replicas for heavy queries

**Horizontal scaling (if needed):**
- Shard by user_id (each user's data isolated)
- Separate read/write databases
- Archive old conversations (>1 year) to cold storage

**Optimization tactics:**
- Aggressive indexing on hot queries
- Materialized views for analytics
- Partition large tables by date
- Regularly vacuum and analyze

---

## Testing Strategy

### Unit Tests (Vitest)

**Coverage targets:**
- Utility functions: 100%
- API route handlers: 80%
- React components: 70%

**Key areas:**
- Context assembly logic
- RAG search functionality
- Summary generation
- Prompt building

### Integration Tests

- Supabase database operations
- OpenAI/Claude API integration
- Voice API integration
- End-to-end user flows

### E2E Tests (Playwright)

**Critical user journeys:**
1. Onboarding flow (email signup → profile creation)
2. First quick check-in conversation
3. Booking a structured session
4. Voice conversation flow
5. Viewing conversation history

### Performance Tests

- Load testing with k6 (100+ concurrent users)
- Database query performance
- API response time under load
- Voice latency testing

---

## Development Workflow

### Local Development Setup

```bash
# Clone repo
git clone https://github.com/yourorg/coach-os.git
cd coach-os

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Fill in API keys (Supabase, OpenAI, ElevenLabs)

# Run database migrations
pnpm supabase db push

# Start development server
pnpm dev
```

### Git Workflow

- `main` branch: Production-ready code
- `develop` branch: Integration branch
- Feature branches: `feature/onboarding-flow`
- Hotfix branches: `hotfix/voice-bug-123`

**Commit conventions:**
- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Code refactoring
- `docs:` Documentation
- `test:` Tests
- `chore:` Build/config changes

### CI/CD Pipeline

**GitHub Actions:**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm test
      - run: pnpm build
  
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## Future Technical Enhancements

### Phase 2 (Post-MVP)

**Calendar Integration:**
- Google Calendar API for availability checking
- Auto-schedule sessions in free slots
- Bi-directional sync (create/update/delete)

**Advanced Caching:**
- Redis for context caching
- Reduce database queries by 70%
- Cache embeddings for frequent searches

**Real-time Features:**
- WebSocket for live conversation updates
- Collaborative sessions (future: team coaching)
- Live typing indicators

**Analytics Dashboard:**
- User engagement metrics
- Coaching effectiveness tracking
- Goal progress visualization
- Mood tracking over time

### Phase 3 (Scale)

**Multi-Model Strategy:**
- Route queries to optimal model (GPT-4o vs Claude)
- A/B testing coaching quality
- Cost optimization

**Advanced RAG:**
- Knowledge graphs for complex relationships
- Multi-vector search (semantic + keyword)
- Temporal relevance weighting

**Platform Features:**
- Public API for third-party integrations
- Webhooks for custom workflows
- SDK for developers

---

## Technical Risks & Mitigations

### Risk 1: AI Response Quality

**Risk:** Coach gives bad advice, users lose trust  
**Mitigation:**
- Extensive prompt testing with real scenarios
- System prompt with safety guardrails
- User feedback loop (rate every response)
- Human review of flagged conversations
- Continuous prompt refinement

### Risk 2: Cost Scaling

**Risk:** Token costs become unsustainable at scale  
**Mitigation:**
- Monitor token usage per user (set alerts)
- Implement aggressive context summarization
- Use cheaper models for summaries (GPT-4o-mini)
- Cache frequently accessed context
- Tiered pricing to match cost structure

### Risk 3: Latency Issues

**Risk:** Slow responses hurt user experience  
**Mitigation:**
- Edge runtime for API routes
- Streaming responses (perceived performance)
- Aggressive database indexing
- Context caching
- CDN for static assets
- Monitor p95 latency, set SLAs

### Risk 4: Data Privacy Breach

**Risk:** User business data exposed  
**Mitigation:**
- Row Level Security (RLS) on all tables
- Encrypted data at rest and in transit
- Regular security audits
- Bug bounty program
- Compliance with GDPR/SOC2
- Data breach response plan

### Risk 5: Vendor Lock-in

**Risk:** Dependence on OpenAI/Supabase  
**Mitigation:**
- Abstract AI provider behind interface
- Easy model swapping (OpenAI ↔ Claude)
- Database export scripts (Supabase → self-hosted Postgres)
- Voice API abstraction layer
- Multi-cloud strategy (future)

---

**Document Owner:** Paul  
**Last Updated:** November 11, 2025  
**Next Review:** After MVP launch
