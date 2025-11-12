-- Admin Dashboard Schema Additions
-- Run this AFTER the main schema (schema-fixed.sql)

-- ============================================================================
-- ADMIN & FEEDBACK TABLES
-- ============================================================================

-- Add admin flag to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Create index for admin lookup
CREATE INDEX IF NOT EXISTS idx_profiles_admin ON profiles(is_admin) WHERE is_admin = TRUE;

-- Feedback submissions from users
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  type TEXT NOT NULL, -- bug, feature, improvement, general
  category TEXT, -- ai_quality, ui_ux, performance, other
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new', -- new, reviewed, in_progress, resolved, closed
  priority TEXT DEFAULT 'medium', -- low, medium, high, urgent
  admin_notes TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_user ON feedback(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_type ON feedback(type);

-- ============================================================================
-- SESSION ANALYTICS & TRACKING
-- ============================================================================

-- Add analytics fields to conversations table
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS framework_used TEXT; -- grow, clear, oskar, free_form
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS sentiment TEXT; -- positive, neutral, negative, mixed
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS success_rating INTEGER; -- 1-5 scale
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS value_score DECIMAL; -- AI-calculated value delivered
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS session_notes TEXT; -- Admin or AI notes
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS analyzed_at TIMESTAMPTZ; -- When AI analysis was done

-- Session analytics (AI-generated insights)
CREATE TABLE IF NOT EXISTS session_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL UNIQUE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

  -- AI Analysis
  sentiment TEXT, -- overall sentiment: positive, neutral, negative, mixed
  sentiment_score DECIMAL, -- -1 to 1
  key_topics TEXT[], -- Main topics discussed
  frameworks_detected TEXT[], -- Frameworks AI identified (GROW, SWOT, etc.)

  -- Engagement Metrics
  message_count INTEGER DEFAULT 0,
  user_message_count INTEGER DEFAULT 0,
  coach_message_count INTEGER DEFAULT 0,
  avg_response_length INTEGER, -- Average message length

  -- Quality Metrics
  clarity_score DECIMAL, -- How clear/actionable the coaching was (0-1)
  depth_score DECIMAL, -- How deep vs surface-level (0-1)
  action_items_count INTEGER DEFAULT 0, -- Number of action items identified
  questions_asked_count INTEGER DEFAULT 0, -- Coach questions asked

  -- Outcome Metrics
  breakthrough_detected BOOLEAN DEFAULT FALSE, -- Did user have breakthrough moment?
  value_delivered TEXT, -- What specific value was delivered
  next_steps TEXT[], -- What user should do next

  -- Meta
  analyzed_at TIMESTAMPTZ DEFAULT NOW(),
  analysis_version TEXT DEFAULT '1.0',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_session_analytics_user ON session_analytics(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_session_analytics_sentiment ON session_analytics(sentiment);
CREATE INDEX IF NOT EXISTS idx_session_analytics_conversation ON session_analytics(conversation_id);

-- ============================================================================
-- ADMIN ACTIVITY LOG
-- ============================================================================

-- Track admin actions for audit trail
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
  action TEXT NOT NULL, -- viewed_user, viewed_session, updated_feedback, etc.
  resource_type TEXT, -- user, session, feedback
  resource_id UUID,
  details JSONB DEFAULT '{}'::JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_activity_user ON admin_activity_log(admin_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_activity_action ON admin_activity_log(action, created_at DESC);

-- ============================================================================
-- RLS POLICIES FOR NEW TABLES
-- ============================================================================

-- Feedback: Users can create and view their own, admins can view all
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own feedback" ON feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own feedback" ON feedback
  FOR SELECT USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE
  ));

CREATE POLICY "Admins can update feedback" ON feedback
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE
  ));

-- Session analytics: Only admins and the user can view
ALTER TABLE session_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users and admins can view session analytics" ON session_analytics
  FOR SELECT USING (
    auth.uid() = user_id OR EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

CREATE POLICY "System can insert session analytics" ON session_analytics
  FOR INSERT WITH CHECK (TRUE); -- API routes insert these

-- Admin activity log: Only admins can view
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view activity log" ON admin_activity_log
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE
  ));

CREATE POLICY "System can insert activity log" ON admin_activity_log
  FOR INSERT WITH CHECK (TRUE);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update timestamps
DROP TRIGGER IF EXISTS update_feedback_updated_at ON feedback;
CREATE TRIGGER update_feedback_updated_at BEFORE UPDATE ON feedback
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_session_analytics_updated_at ON session_analytics;
CREATE TRIGGER update_session_analytics_updated_at BEFORE UPDATE ON session_analytics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- HELPER VIEWS FOR ADMIN DASHBOARD
-- ============================================================================

-- User summary view
CREATE OR REPLACE VIEW admin_user_summary AS
SELECT
  p.id,
  p.email,
  p.full_name,
  p.created_at,
  p.onboarding_completed,
  COUNT(DISTINCT c.id) as total_conversations,
  COUNT(DISTINCT m.id) as total_messages,
  MAX(c.started_at) as last_active,
  COALESCE(AVG(sa.sentiment_score), 0) as avg_sentiment,
  COUNT(DISTINCT CASE WHEN c.started_at > NOW() - INTERVAL '7 days' THEN c.id END) as conversations_last_7_days
FROM profiles p
LEFT JOIN conversations c ON c.user_id = p.id
LEFT JOIN messages m ON m.user_id = p.id
LEFT JOIN session_analytics sa ON sa.user_id = p.id
WHERE p.is_admin = FALSE
GROUP BY p.id, p.email, p.full_name, p.created_at, p.onboarding_completed;

-- Session summary view
CREATE OR REPLACE VIEW admin_session_summary AS
SELECT
  c.id,
  c.user_id,
  p.email as user_email,
  p.full_name as user_name,
  c.title,
  c.session_type,
  c.framework_used,
  c.started_at,
  c.ended_at,
  c.duration_seconds,
  c.sentiment,
  c.success_rating,
  c.value_score,
  COUNT(m.id) as message_count,
  sa.sentiment_score,
  sa.clarity_score,
  sa.depth_score,
  sa.action_items_count,
  sa.breakthrough_detected
FROM conversations c
LEFT JOIN profiles p ON p.id = c.user_id
LEFT JOIN messages m ON m.conversation_id = c.id
LEFT JOIN session_analytics sa ON sa.conversation_id = c.id
GROUP BY c.id, p.email, p.full_name, c.title, c.session_type, c.framework_used,
         c.started_at, c.ended_at, c.duration_seconds, c.sentiment, c.success_rating,
         c.value_score, sa.sentiment_score, sa.clarity_score, sa.depth_score,
         sa.action_items_count, sa.breakthrough_detected;

-- Framework effectiveness view
CREATE OR REPLACE VIEW admin_framework_effectiveness AS
SELECT
  framework_used,
  COUNT(*) as session_count,
  AVG(success_rating) as avg_success_rating,
  AVG(value_score) as avg_value_score,
  AVG(sa.sentiment_score) as avg_sentiment,
  AVG(sa.clarity_score) as avg_clarity,
  AVG(sa.depth_score) as avg_depth,
  AVG(duration_seconds) as avg_duration_seconds,
  COUNT(CASE WHEN sa.breakthrough_detected THEN 1 END) as breakthrough_count
FROM conversations c
LEFT JOIN session_analytics sa ON sa.conversation_id = c.id
WHERE framework_used IS NOT NULL
GROUP BY framework_used;

-- ============================================================================
-- INITIAL ADMIN USER (OPTIONAL - UPDATE WITH YOUR EMAIL)
-- ============================================================================

-- Uncomment and update with your email to make yourself admin
-- UPDATE profiles SET is_admin = TRUE WHERE email = 'your-email@example.com';
