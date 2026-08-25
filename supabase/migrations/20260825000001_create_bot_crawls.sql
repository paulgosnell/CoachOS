-- Server-side crawler logging.
--
-- page_views is populated by client-side JS calling /api/track, so it can only
-- ever record visitors that execute JavaScript. AI crawlers (GPTBot, ClaudeBot,
-- PerplexityBot, OAI-SearchBot) do not, which meant the site had no visibility
-- at all into who was reading it for LLM answers. This table is written from
-- middleware, before any JS runs, so it sees them.

create table if not exists public.bot_crawls (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  -- Recorded because several sites in the portfolio share one Supabase
  -- project. Without the host their crawler traffic is commingled here and
  -- cannot be told apart.
  host text,
  path text not null,
  bot_name text not null,
  -- ai_assistant: live retrieval on behalf of a user asking a question now
  -- ai_training:  corpus crawling for model training or index building
  -- search:       conventional search engine indexing
  -- social:       link unfurling for previews
  bot_category text not null,
  user_agent text,
  country text,
  method text
);

create index if not exists bot_crawls_created_at_idx
  on public.bot_crawls (created_at desc);

create index if not exists bot_crawls_bot_name_idx
  on public.bot_crawls (bot_name, created_at desc);

create index if not exists bot_crawls_category_idx
  on public.bot_crawls (bot_category, created_at desc);

-- No public access. Writes come from middleware using the service role, which
-- bypasses RLS. Enabling RLS with no policy means anon and authenticated get
-- nothing, which is the intent.
alter table public.bot_crawls enable row level security;

create index if not exists bot_crawls_host_idx on public.bot_crawls (host, created_at desc);
