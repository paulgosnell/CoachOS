-- Token Usage Tracking
-- Tracks token usage and costs for OpenAI API calls (chat and voice)

CREATE TABLE IF NOT EXISTS token_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,

  -- Session info
  session_type TEXT NOT NULL, -- 'chat' or 'voice'
  model TEXT NOT NULL, -- e.g., 'gpt-4o', 'gpt-4o-realtime-preview-2024-12-17'

  -- Token counts
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  input_audio_tokens INTEGER DEFAULT 0, -- For voice only
  output_audio_tokens INTEGER DEFAULT 0, -- For voice only
  total_tokens INTEGER DEFAULT 0,

  -- Cost tracking (in USD)
  input_cost DECIMAL(10, 6) DEFAULT 0,
  output_cost DECIMAL(10, 6) DEFAULT 0,
  total_cost DECIMAL(10, 6) DEFAULT 0,

  -- Metadata
  metadata JSONB DEFAULT '{}'::JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_token_usage_user ON token_usage(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_token_usage_conversation ON token_usage(conversation_id);
CREATE INDEX IF NOT EXISTS idx_token_usage_session_type ON token_usage(session_type);
CREATE INDEX IF NOT EXISTS idx_token_usage_created_at ON token_usage(created_at DESC);

-- Enable RLS
ALTER TABLE token_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own token usage"
  ON token_usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert token usage"
  ON token_usage FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all token usage"
  ON token_usage FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Function to calculate total cost
CREATE OR REPLACE FUNCTION calculate_token_cost(
  p_model TEXT,
  p_input_tokens INTEGER,
  p_output_tokens INTEGER,
  p_input_audio_tokens INTEGER DEFAULT 0,
  p_output_audio_tokens INTEGER DEFAULT 0
) RETURNS JSONB AS $$
DECLARE
  v_input_cost DECIMAL(10, 6) := 0;
  v_output_cost DECIMAL(10, 6) := 0;
  v_total_cost DECIMAL(10, 6) := 0;
  v_input_text_rate DECIMAL(10, 6);
  v_output_text_rate DECIMAL(10, 6);
  v_input_audio_rate DECIMAL(10, 6);
  v_output_audio_rate DECIMAL(10, 6);
BEGIN
  -- Set pricing based on model (per 1M tokens, in USD)
  CASE
    WHEN p_model = 'gpt-4o' THEN
      v_input_text_rate := 2.50;
      v_output_text_rate := 10.00;
    WHEN p_model LIKE 'gpt-4o-realtime%' THEN
      v_input_text_rate := 5.00;
      v_output_text_rate := 20.00;
      v_input_audio_rate := 40.00;
      v_output_audio_rate := 80.00;
    WHEN p_model = 'gpt-4o-mini' THEN
      v_input_text_rate := 0.15;
      v_output_text_rate := 0.60;
    WHEN p_model = 'gpt-3.5-turbo' THEN
      v_input_text_rate := 0.50;
      v_output_text_rate := 1.50;
    ELSE
      -- Default to gpt-4o pricing
      v_input_text_rate := 2.50;
      v_output_text_rate := 10.00;
  END CASE;

  -- Calculate text token costs
  v_input_cost := (p_input_tokens::DECIMAL / 1000000) * v_input_text_rate;
  v_output_cost := (p_output_tokens::DECIMAL / 1000000) * v_output_text_rate;

  -- Add audio token costs if applicable
  IF p_input_audio_tokens > 0 THEN
    v_input_cost := v_input_cost + ((p_input_audio_tokens::DECIMAL / 1000000) * v_input_audio_rate);
  END IF;

  IF p_output_audio_tokens > 0 THEN
    v_output_cost := v_output_cost + ((p_output_audio_tokens::DECIMAL / 1000000) * v_output_audio_rate);
  END IF;

  v_total_cost := v_input_cost + v_output_cost;

  RETURN jsonb_build_object(
    'input_cost', v_input_cost,
    'output_cost', v_output_cost,
    'total_cost', v_total_cost
  );
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE token_usage IS 'Tracks token usage and costs for OpenAI API calls';
COMMENT ON FUNCTION calculate_token_cost IS 'Calculates cost based on model and token usage';
