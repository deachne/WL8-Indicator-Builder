# RAG System Improvements

This document outlines the improvements made to the RAG (Retrieval-Augmented Generation) system in the WL8 Indicator Builder project.

## 1. Supabase Vector Storage

The RAG system has been migrated from ChromaDB to Supabase for vector storage:

- **PostgreSQL with pgvector**: Battle-tested database technology with vector search capabilities
- **Managed service**: No server maintenance required
- **JavaScript SDK**: Easy integration with Next.js
- **Additional features**: Authentication, storage, and realtime subscriptions if needed later

### Configuration

You can configure Supabase by setting the following environment variables in your `.env` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_api_key
```

See the `SUPABASE_SETUP.md` file for detailed setup instructions.

## 2. Legacy ChromaDB Support

The previous ChromaDB implementation is still available but is no longer the primary vector storage solution. The scripts and code for ChromaDB are maintained for backward compatibility.

## 3. Re-ranking Implementation

A hybrid re-ranking system has been implemented to improve retrieval quality:

- **Vector Similarity**: Uses the original ChromaDB vector similarity scores
- **Keyword Matching**: Adds keyword-based matching for better precision
- **Boosting Factors**: Applies boosts for title matches and code examples
- **Query Classification**: Detects code-related queries to prioritize code examples

### How Re-ranking Works

1. The system retrieves more initial results from ChromaDB (10 instead of 5)
2. The re-ranker scores each document based on:
   - Vector similarity (70% weight by default)
   - Keyword matching (30% weight by default)
   - Title match boost (1.5x by default)
   - Code example boost for code-related queries (1.2x by default)
3. The results are re-sorted based on the new scores
4. The top 5 results are returned

### Benefits

- **Improved Relevance**: Better matching of documents to user queries
- **Code Example Priority**: Code examples are prioritized for code-related queries
- **Title Matching**: Documents with titles matching the query are boosted
- **Hybrid Approach**: Combines the strengths of semantic and keyword search

## 4. Verification Tools

Verification scripts have been added to test both Supabase and ChromaDB storage:

```bash
npm run verify-supabase
```

This script:
- Connects to Supabase
- Counts documents in the collection
- Performs a test query
- Shows whether you're using Supabase correctly

```bash
npm run verify-chroma
```

This script:
- Connects to ChromaDB (either in-memory or server)
- Lists all collections
- Counts documents in the collection
- Performs a test query
- Shows whether you're using persistent storage or in-memory mode

## 5. Integration with API Routes

The Supabase implementation and re-ranking system have been integrated with all API routes:

- `/api/rag`: Uses Supabase with re-ranking for the main RAG system
- `/api/suggestions`: Uses Supabase with re-ranking for document suggestions
- `/api/init-rag`: Initializes the Supabase RAG system

## 6. Documentation

New documentation files have been added:

- `SUPABASE_SETUP.md`: Guide for setting up Supabase with pgvector
- `CHROMA_SETUP.md`: Guide for setting up ChromaDB with persistent storage (legacy)
- `RAG_IMPROVEMENTS.md` (this file): Overview of the RAG system improvements

## Next Steps

With these improvements in place, the next steps could include:

1. **Code Generation**: Implement code generation capabilities based on documentation context
2. **AI Model Selection**: Add support for choosing between different AI models (OpenAI, Anthropic)
3. **User Authentication**: Implement user authentication for saving and sharing indicators
4. **Community Features**: Add community features to the Q&A platform
5. **Advanced Filtering**: Implement advanced filtering capabilities using Supabase's PostgreSQL features

## Technical Details

The Supabase implementation is in `lib/supabase-rag.ts` and includes:

- `initializeSupabaseRagSystem()`: Initializes the Supabase RAG system
- `importDocumentsToSupabase()`: Imports documents to Supabase
- `querySupabaseRagSystem()`: Queries the Supabase RAG system
- `getSupabaseSuggestedDocumentation()`: Gets suggested documentation from Supabase

The re-ranking implementation is in `lib/reranker.ts` and includes:

- `rerank()`: The main re-ranking function
- `calculateKeywordScore()`: Calculates keyword match scores
- `isCodeRelatedQuery()`: Detects if a query is code-related

## Testing the Improvements

To test the improved RAG system:

1. Start the application: `npm run dev`
2. Navigate to the Q&A page
3. Ask a question about WL8 indicators or strategies
4. Observe the improved relevance of the results

For a direct comparison, you can try the same query with and without re-ranking by temporarily commenting out the re-ranking code in `app/api/rag/route.ts`.

## Migration from ChromaDB to Supabase

The migration from ChromaDB to Supabase provides several benefits:

1. **Simplified Infrastructure**: No need to run a separate ChromaDB server
2. **Improved Reliability**: PostgreSQL is a battle-tested database technology
3. **Scalability**: Supabase can scale to handle larger document collections
4. **Additional Features**: Supabase provides authentication, storage, and realtime subscriptions

The migration was implemented as a drop-in replacement, with the API routes updated to use Supabase first and fall back to the in-memory implementation if needed.
