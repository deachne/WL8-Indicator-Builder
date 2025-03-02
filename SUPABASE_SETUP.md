# Supabase Vector Storage Setup Guide

This guide explains how to set up and use Supabase for persistent vector storage in the WL8 Indicator Builder project.

## What is Supabase?

Supabase is an open-source Firebase alternative that provides a PostgreSQL database with built-in authentication, storage, and realtime subscriptions. For this project, we're using Supabase with the pgvector extension to store document embeddings for efficient semantic search.

## Why Supabase for Vector Storage?

Supabase offers several advantages over ChromaDB:

1. **PostgreSQL with pgvector**: Battle-tested database technology with vector search capabilities
2. **Managed service**: No server maintenance required
3. **JavaScript SDK**: Easy integration with Next.js
4. **Additional features**: Authentication, storage, and realtime subscriptions if needed later
5. **Free tier**: Generous free tier for getting started
6. **Scalability**: Can scale as your application grows

## Setup Instructions

### 1. Create a Supabase Account and Project

1. Go to [supabase.com](https://supabase.com/) and sign up for an account
2. Create a new project
3. Note your project URL and API keys (you'll need these later)

### 2. Enable pgvector Extension

1. In your Supabase project, go to the SQL Editor
2. Run the following SQL command:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### 3. Create Database Schema

You need to create the database schema manually using the SQL Editor in Supabase:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Create a new query
4. Copy and paste the contents of the `scripts/create-supabase-schema.sql` file
5. Execute the SQL script

The SQL script will:
- Enable the pgvector extension
- Create the documentation table for storing embeddings
- Create the match_documents function for similarity search

**Important**: You must create the schema manually before running the import script. The import script will check if the schema exists but cannot create it automatically.

### 4. Configure Environment Variables

Create or update your `.env` file with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_api_key
```

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL (e.g., https://abcdefghijklm.supabase.co)
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (from Project Settings > API)
- `OPENAI_API_KEY`: Your OpenAI API key (for generating embeddings)

### 5. Import Documents

Import your documentation into Supabase:

```bash
npm run import-supabase
```

This script:
- Processes documentation from the docs directory
- Generates embeddings using OpenAI
- Stores the documents and embeddings in Supabase

### 6. Verify Setup

Verify that Supabase is working correctly:

```bash
npm run verify-supabase
```

This script:
- Connects to Supabase
- Counts documents in the collection
- Performs a test query
- Shows whether you're using Supabase correctly

## How It Works

1. The RAG system first tries to use Supabase for document retrieval
2. If Supabase is not available or returns no results, it falls back to the in-memory implementation
3. This ensures the application works even if Supabase is not properly set up

## Troubleshooting

### Connection errors

If you're having trouble connecting to Supabase:

1. Check that your environment variables are set correctly
2. Verify that your Supabase project is active
3. Ensure your IP address is not blocked by Supabase

### OpenAI API Key errors

Supabase uses OpenAI's embedding model to convert text to vectors. Make sure your OpenAI API key is set:

```
OPENAI_API_KEY=your_api_key_here
```

### No documents found

If the verification script shows no documents, make sure you've imported the documentation:

```bash
npm run import-docs    # First import the docs from GitHub
npm run import-supabase  # Then import to Supabase
```

## Migrating from ChromaDB

If you were previously using ChromaDB, the Supabase implementation provides a drop-in replacement. The API routes have been updated to use Supabase first and fall back to the in-memory implementation if needed.

You can continue to use the ChromaDB scripts if needed, but they are no longer required for the application to function.
