# Database Setup Guide for Coach OS

Complete guide for setting up your Supabase database with all required tables, indexes, and functions.

## 🎯 Quick Start

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your Coach OS project
3. Navigate to **SQL Editor**
4. Copy the contents of `supabase/schema-fixed.sql`
5. Paste into a new query
6. Click **Run** (or press Cmd/Ctrl + Enter)
7. Wait for success confirmation

That's it! All tables, indexes, policies, and functions will be created.

---

## 📊 Database Schema Overview

### Tables Created

#### User & Profile Tables
- **profiles** - User profile data (extends auth.users)
- **business_profiles** - Business context (company, role, industry)
- **goals** - User goals and priorities

#### Conversation Tables
- **conversations** - Coaching sessions/conversations
- **messages** - Individual chat messages
- **daily_summaries** - AI-generated daily recaps
- **weekly_summaries** - Weekly progress summaries

#### Coaching & Memory
- **coaching_sessions** - Structured coaching sessions
- **conversation_embeddings** - Vector embeddings for RAG (1536 dimensions)
- **action_items** - Tasks and follow-ups

#### Analytics
- **usage_events** - User activity tracking

### Key Features Enabled

✅ **UUID Extension** - For generating unique IDs
✅ **pgvector Extension** - For semantic search with embeddings
✅ **Row Level Security (RLS)** - Users can only access their own data
✅ **Automatic Triggers** - Auto-update timestamps, auto-create profiles
✅ **Vector Search Function** - Semantic similarity search
✅ **Auto-populate user_id** - Messages inherit user_id from conversation

---

## 🔧 What Was Fixed

The `schema-fixed.sql` includes several corrections from the original schema:

### 1. Conversations Table
**Added:** `updated_at` column
**Why:** Chat API updates conversation timestamp after each message

```sql
-- Before: No updated_at
-- After:
updated_at TIMESTAMPTZ DEFAULT NOW()
```

### 2. Messages Table Auto-population
**Added:** Trigger to auto-populate `user_id` from conversation
**Why:** Chat API doesn't include user_id when inserting messages

```sql
CREATE OR REPLACE FUNCTION set_message_user_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    SELECT user_id INTO NEW.user_id
    FROM conversations
    WHERE id = NEW.conversation_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 3. Conversation Embeddings
**Changed:** `content_snippet` → `content`
**Added:** `role` column
**Why:** Code stores full content and role for context

```sql
-- Before:
content_snippet TEXT NOT NULL,
-- metadata JSONB...

-- After:
content TEXT NOT NULL,
role TEXT,
metadata JSONB...
```

### 4. Vector Search Function
**Updated:** Returns `content` instead of `content_snippet`
**Why:** Matches the actual column name

---

## 🧪 Testing Your Database

After running the schema, test that everything works:

### 1. Check Tables Exist

```sql
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

Should show: `action_items`, `business_profiles`, `coaching_sessions`, `conversation_embeddings`, `conversations`, `daily_summaries`, `goals`, `messages`, `profiles`, `usage_events`, `weekly_summaries`

### 2. Check Extensions

```sql
SELECT * FROM pg_extension
WHERE extname IN ('uuid-ossp', 'vector');
```

Should show both extensions installed.

### 3. Test RLS Policies

```sql
SELECT tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename;
```

Should show policies for all tables.

### 4. Test Vector Function

```sql
SELECT proname, proargtypes
FROM pg_proc
WHERE proname = 'match_conversations';
```

Should return the vector search function.

### 5. Test Triggers

```sql
SELECT tgname, tgrelid::regclass
FROM pg_trigger
WHERE tgname LIKE '%user%' OR tgname LIKE '%updated_at%';
```

Should show:
- `on_auth_user_created` (creates profile on signup)
- `update_*_updated_at` (auto-updates timestamps)
- `set_message_user_id_trigger` (auto-populates user_id)

---

## 🔐 Row Level Security (RLS)

All tables have RLS enabled. Users can only access their own data.

### What This Means

**Without RLS:**
```javascript
// Would return ALL messages from ALL users
const { data } = await supabase.from('messages').select('*')
```

**With RLS:**
```javascript
// Only returns messages for the authenticated user
const { data } = await supabase.from('messages').select('*')
```

### Policy Summary

| Table | Policy |
|-------|--------|
| `profiles` | Users can view/update their own profile |
| `business_profiles` | Users can manage their own business profile |
| `goals` | Users can manage their own goals |
| `conversations` | Users can manage their own conversations |
| `messages` | Users can manage their own messages |
| `daily_summaries` | Users can manage their own summaries |
| `weekly_summaries` | Users can manage their own summaries |
| `coaching_sessions` | Users can manage their own sessions |
| `conversation_embeddings` | Users can manage their own embeddings |
| `action_items` | Users can manage their own action items |
| `usage_events` | Users can insert/view their own events |

---

## 🎓 Understanding the Schema

### How Messages Work

1. User sends message → Chat API receives it
2. API inserts message with only `conversation_id`, `role`, `content`
3. **Trigger fires** → Automatically looks up `user_id` from conversation
4. Message is saved with correct `user_id`
5. RLS ensures user can only see their own messages

### How Embeddings Work

1. Message is created
2. Background job generates embedding using OpenAI
3. Embedding stored in `conversation_embeddings` (1536 dimensions)
4. Later, when user asks a question:
   - Question is embedded
   - `match_conversations()` finds similar past conversations
   - Coach uses context from similar conversations

### How Summaries Work

**Daily:**
- End of day, system fetches all messages from that day
- GPT-4o-mini analyzes and generates summary
- Stored in `daily_summaries`

**Weekly:**
- End of week, system fetches all daily summaries
- GPT-4o-mini synthesizes weekly insights
- Checks progress on goals
- Stored in `weekly_summaries`

---

## 🚀 Next Steps After Setup

### 1. Verify Profile Creation

Sign up for a new account and check that profile was auto-created:

```sql
SELECT id, email, full_name, onboarding_completed
FROM profiles
LIMIT 5;
```

### 2. Test Onboarding Flow

1. Sign up at https://coach-os-agent.vercel.app/auth/signup
2. Complete onboarding (business profile + goals)
3. Check data:

```sql
-- Check business profile
SELECT * FROM business_profiles LIMIT 1;

-- Check goals
SELECT title, category, status FROM goals LIMIT 5;
```

### 3. Test Chat Functionality

1. Go to /chat
2. Start a conversation
3. Check conversation was created:

```sql
SELECT id, session_type, title, started_at
FROM conversations
ORDER BY created_at DESC
LIMIT 5;
```

4. Check messages:

```sql
SELECT role, LEFT(content, 50) as preview, created_at
FROM messages
ORDER BY created_at DESC
LIMIT 10;
```

### 4. Monitor Database Size

```sql
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 🐛 Troubleshooting

### Error: "permission denied for schema public"

**Cause:** Your database user doesn't have permissions.
**Fix:** Run as a superuser or grant permissions:

```sql
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
```

### Error: "extension 'vector' is not available"

**Cause:** pgvector extension not installed.
**Fix:** In Supabase dashboard:
1. Go to **Database** → **Extensions**
2. Search for "vector"
3. Enable the extension
4. Re-run the schema

### Error: "relation 'profiles' already exists"

**Cause:** Tables already created.
**Fix:** Either:
- Drop tables first (⚠️ **WARNING: Deletes all data!**)
- Or modify schema to use `CREATE TABLE IF NOT EXISTS` (already included)

### Error: "policy already exists"

**Cause:** Policies already created.
**Fix:** Run these first:

```sql
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
-- ... etc for other policies
```

Or use this to drop all policies:

```sql
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  LOOP
    EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.tablename);
  END LOOP;
END $$;
```

### Messages Not Showing user_id

**Cause:** Trigger not working or conversation doesn't exist.
**Fix:** Check trigger exists:

```sql
SELECT tgname FROM pg_trigger WHERE tgname = 'set_message_user_id_trigger';
```

If missing, re-run the trigger creation part of schema.

### Vector Search Not Working

**Cause:** Index not built or embeddings not created.
**Fix:**

1. Check embeddings exist:
```sql
SELECT COUNT(*) FROM conversation_embeddings;
```

2. If zero, embeddings haven't been generated yet. They're created async after messages.

3. Check index exists:
```sql
SELECT indexname FROM pg_indexes WHERE tablename = 'conversation_embeddings';
```

---

## 📈 Database Maintenance

### Weekly Tasks

**Check database size:**
```sql
SELECT pg_size_pretty(pg_database_size(current_database()));
```

**Check table sizes:**
```sql
SELECT
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
  pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS index_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Monthly Tasks

**Vacuum tables:**
```sql
VACUUM ANALYZE;
```

**Rebuild vector index if needed:**
```sql
REINDEX INDEX idx_embeddings_vector;
```

---

## 🔄 Schema Migrations

If you need to modify the schema later:

### Adding a Column

```sql
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC';
```

### Adding an Index

```sql
CREATE INDEX IF NOT EXISTS idx_messages_created_at
ON messages(created_at DESC);
```

### Changing a Column Type

```sql
ALTER TABLE business_profiles
ALTER COLUMN team_size TYPE BIGINT;
```

---

## 📚 References

- [Supabase Database Guide](https://supabase.com/docs/guides/database)
- [PostgreSQL Row Level Security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [pgvector Extension](https://github.com/pgvector/pgvector)
- [OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings)

---

## ✅ Setup Checklist

Before deploying to production:

- [ ] Run `schema-fixed.sql` in Supabase SQL Editor
- [ ] Verify all 11 tables exist
- [ ] Verify `uuid-ossp` and `vector` extensions enabled
- [ ] Test profile auto-creation (sign up new user)
- [ ] Test RLS (try accessing another user's data - should fail)
- [ ] Test message insertion (should auto-populate user_id)
- [ ] Test conversation creation and updates
- [ ] Verify triggers are active (check `pg_trigger`)
- [ ] Set up database backups (Supabase does this automatically)
- [ ] Monitor database size and performance

---

**Status:** ✅ **Ready for Production**
**Last Updated:** 2025-01-11
**Schema Version:** 1.1 (Fixed)
