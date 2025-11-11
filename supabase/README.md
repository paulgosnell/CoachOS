# Coach OS Database Setup

## Quick Start

### 1. Apply the Schema to Supabase

Go to your Supabase project dashboard:
1. Navigate to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `schema.sql`
4. Click **Run** to execute

This will create all tables, indexes, RLS policies, and functions.

### 2. Verify Tables Created

After running the schema, verify in **Table Editor** that you see:
- profiles
- business_profiles
- goals
- conversations
- messages
- daily_summaries
- weekly_summaries
- coaching_sessions
- conversation_embeddings
- action_items
- usage_events
- waitlist (already exists from landing page)

### 3. Test RLS Policies

RLS (Row Level Security) is enabled on all tables. Users can only access their own data.

## Schema Overview

### Core Tables
- **profiles** - User profile data (extends auth.users)
- **business_profiles** - Business context for each user
- **goals** - User goals and priorities

### Conversations
- **conversations** - Groups messages into sessions
- **messages** - Individual chat messages
- **conversation_embeddings** - Vector embeddings for RAG

### Memory System
- **daily_summaries** - AI-generated daily recaps
- **weekly_summaries** - Weekly rollups
- **action_items** - Tasks and commitments

### Coaching
- **coaching_sessions** - Structured GROW framework sessions

## Important Functions

### `match_conversations()`
Used for semantic search (RAG):
```sql
SELECT * FROM match_conversations(
  query_embedding := '[...]'::vector,
  match_threshold := 0.7,
  match_count := 5,
  filter_user_id := auth.uid()
);
```

### `handle_new_user()`
Automatically creates a profile when a user signs up.

## Security

All tables have Row Level Security (RLS) enabled. Users can only:
- View their own data
- Insert their own data
- Update their own data
- Delete their own data

Service role key bypasses RLS (use carefully in backend functions only).
