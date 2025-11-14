# Coach OS Memory System

The memory system provides long-term context for AI coaching sessions through three components:

## 1. Vector Embeddings (RAG - Retrieval Augmented Generation)

**Status**: ✅ Fully Automatic

Every message (user and assistant) is automatically embedded using OpenAI's `text-embedding-3-small` model and stored in the `conversation_embeddings` table. When a user sends a new message, the system:

1. Generates an embedding for the new message
2. Searches for semantically similar past messages (>70% similarity)
3. Adds relevant past conversations to the AI's context

**How it works**:
- Triggered automatically in `/api/chat` route
- Uses cosine similarity via PostgreSQL's `pgvector` extension
- Searches only within the user's own conversation history
- Returns top 5 most relevant past messages

**Database**:
- Table: `conversation_embeddings`
- Index: IVFFlat for fast vector search
- Function: `search_similar_messages()`

## 2. Daily Summaries

**Status**: ✅ Automated via Cron

At 2 AM UTC every day, the system generates AI summaries of each user's conversations from the previous day.

**What it captures**:
- 2-3 sentence overview of the day
- Key themes discussed
- All action items from conversations
- Conversation count

**Schedule**: Daily at 2 AM UTC
**Endpoint**: `/api/cron/daily-summary`
**Storage**: `daily_summaries` table

## 3. Weekly Summaries

**Status**: ✅ Automated via Cron

Every Sunday at 3 AM UTC, the system generates weekly rollup summaries from daily summaries.

**What it captures**:
- 3-4 sentence overview of the week
- Progress notes and recommendations
- Goals progress tracking
- Key decisions, challenges, and wins

**Schedule**: Weekly on Sunday at 3 AM UTC
**Endpoint**: `/api/cron/weekly-summary`
**Storage**: `weekly_summaries` table

## Setup Instructions

### 1. Environment Variables

Add to your `.env.local`:

```bash
# Required for OpenAI embeddings
OPENAI_API_KEY=sk-...

# Required for cron job security
CRON_SECRET=your-random-secret-here
```

### 2. Vercel Configuration

The cron jobs are configured in `vercel.json`:

```json
{
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

### 3. Add CRON_SECRET to Vercel

In your Vercel project settings:

1. Go to Settings → Environment Variables
2. Add `CRON_SECRET` with a random secret value
3. Make sure it's available in Production environment
4. Redeploy your application

### 4. Database Setup

The memory system requires these tables (already in schema):
- `conversation_embeddings` - Vector embeddings (1536 dimensions)
- `daily_summaries` - Daily conversation summaries
- `weekly_summaries` - Weekly rollup summaries

And this PostgreSQL extension:
- `vector` - For pgvector similarity search

## Manual Summary Generation

You can manually trigger summaries via the API:

```bash
# Generate daily summary
curl -X POST https://your-app.vercel.app/api/memory/generate-summary \
  -H "Content-Type: application/json" \
  -d '{"type": "daily", "date": "2025-01-13"}'

# Generate weekly summary
curl -X POST https://your-app.vercel.app/api/memory/generate-summary \
  -H "Content-Type: application/json" \
  -d '{"type": "weekly", "date": "2025-01-07"}'
```

## How AI Uses Memory

When a user sends a message, the AI receives:

1. **User Profile** - Name, email, business context
2. **Active Goals** - Top 5 goals by priority
3. **Recent Conversation History** - Last 20 messages
4. **Relevant Past Discussions** - Top 5 semantically similar messages from past conversations
5. **Recent Summaries** - Last 7 days of daily summaries and recent weekly summaries

This context is assembled in `lib/ai/context.ts` via `assembleUserContextWithRAG()`.

## Performance Notes

- **Embeddings**: Generated asynchronously, don't block responses
- **Vector Search**: Uses IVFFlat index with 100 lists for speed
- **Summaries**: Generated in background via cron, not during user sessions
- **Cost**: ~$0.0001 per embedding (1536 dimensions)

## Troubleshooting

**Embeddings not working?**
- Check OpenAI API key is set
- Verify `conversation_embeddings` table exists
- Check server logs for embedding generation errors

**Summaries not generating?**
- Verify `CRON_SECRET` is set in Vercel
- Check cron job logs in Vercel dashboard
- Ensure users had conversations on previous days

**Context not including memories?**
- Verify embeddings are being stored (check `conversation_embeddings` count)
- Check similarity threshold (currently 0.7 = 70%)
- Ensure vector index is created properly
