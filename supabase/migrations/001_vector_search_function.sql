-- Vector search function for finding similar messages
-- Uses cosine similarity to find semantically similar past conversations

CREATE OR REPLACE FUNCTION search_similar_messages(
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  user_id_filter uuid
)
RETURNS TABLE (
  message_id uuid,
  conversation_id uuid,
  content text,
  role text,
  created_at timestamptz,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ce.message_id,
    ce.conversation_id,
    ce.content,
    ce.role,
    m.created_at,
    1 - (ce.embedding <=> query_embedding) as similarity
  FROM conversation_embeddings ce
  INNER JOIN messages m ON m.id = ce.message_id
  WHERE ce.user_id = user_id_filter
    AND 1 - (ce.embedding <=> query_embedding) > match_threshold
  ORDER BY ce.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Create index for faster vector search
CREATE INDEX IF NOT EXISTS conversation_embeddings_embedding_idx
ON conversation_embeddings
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Add comment
COMMENT ON FUNCTION search_similar_messages IS 'Searches for semantically similar messages using vector embeddings';
