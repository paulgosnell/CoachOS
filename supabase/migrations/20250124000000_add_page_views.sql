-- Page views tracking table
CREATE TABLE IF NOT EXISTS page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL,
  referrer text,
  user_agent text,
  country text,
  city text,
  device_type text,
  session_id text,
  user_id uuid REFERENCES auth.users,
  is_internal boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Index for efficient queries
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views (path);
CREATE INDEX IF NOT EXISTS idx_page_views_is_internal ON page_views (is_internal) WHERE is_internal = false;

-- RLS policy
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Allow insert from authenticated and anonymous users
CREATE POLICY "Allow inserts" ON page_views FOR INSERT WITH CHECK (true);

-- Allow service role full access for analytics queries
CREATE POLICY "Service role access" ON page_views FOR ALL USING (auth.role() = 'service_role');
