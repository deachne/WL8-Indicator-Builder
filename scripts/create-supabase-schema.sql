-- Enable the pgvector extension if not already enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- Create a table for documentation embeddings
CREATE TABLE IF NOT EXISTS documentation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  embedding VECTOR(1536),  -- For OpenAI embeddings; adjust dimension as needed
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create a search function for similarity search
CREATE OR REPLACE FUNCTION match_documents (
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    documentation.id,
    documentation.content,
    documentation.metadata,
    1 - (documentation.embedding <=> query_embedding) AS similarity
  FROM documentation
  WHERE 1 - (documentation.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;

-- Create a function to create the schema (used by the application)
CREATE OR REPLACE FUNCTION create_vector_schema()
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  -- Enable the pgvector extension
  CREATE EXTENSION IF NOT EXISTS vector;
  
  -- Create the documentation table if it doesn't exist
  CREATE TABLE IF NOT EXISTS documentation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    embedding VECTOR(1536),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  
  -- Create the match_documents function
  CREATE OR REPLACE FUNCTION match_documents (
    query_embedding VECTOR(1536),
    match_threshold FLOAT,
    match_count INT
  )
  RETURNS TABLE (
    id UUID,
    content TEXT,
    metadata JSONB,
    similarity FLOAT
  )
  LANGUAGE plpgsql
  AS $$
  BEGIN
    RETURN QUERY
    SELECT
      documentation.id,
      documentation.content,
      documentation.metadata,
      1 - (documentation.embedding <=> query_embedding) AS similarity
    FROM documentation
    WHERE 1 - (documentation.embedding <=> query_embedding) > match_threshold
    ORDER BY similarity DESC
    LIMIT match_count;
  END;
  $$;
  
  RETURN TRUE;
END;
$$;
