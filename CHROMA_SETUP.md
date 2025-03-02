# ChromaDB Setup Guide

This guide explains how to set up and use ChromaDB for persistent vector storage in the WL8 Indicator Builder project.

## What is ChromaDB?

ChromaDB is a vector database that stores document embeddings for efficient semantic search. It allows the RAG system to find relevant documentation based on the meaning of user queries, not just keyword matching.

## Setup Options

There are two ways to use ChromaDB in this project:

### Option 1: In-Memory Mode (Default)

This is the simplest option but data is lost when the application restarts.

```bash
# Run the ChromaDB client in memory mode
npm run chroma

# In a separate terminal, import documents
npm run import-chroma
```

### Option 2: Persistent Storage with Python Server (Recommended)

This option provides persistent storage that survives application restarts.

1. Install Python if you don't have it already
2. Install the ChromaDB Python package:

```bash
pip install chromadb
```

3. Run the ChromaDB server:

```bash
python -m chromadb.server
```

4. Create a `.env` file in the project root (or add to existing):

```
CHROMA_SERVER_URL=http://localhost:8000
```

5. Import documents to the server:

```bash
npm run import-chroma
```

## Verifying Your Setup

You can verify that ChromaDB is working correctly by running:

```bash
npm run verify-chroma
```

This will:
- Connect to ChromaDB (either in-memory or server)
- List all collections
- Count documents in the collection
- Perform a test query
- Show whether you're using persistent storage or in-memory mode

## Troubleshooting

### No documents found

If the verification script shows no documents, make sure you've imported the documentation:

```bash
npm run import-docs    # First import the docs from GitHub
npm run import-chroma  # Then import to ChromaDB
```

### Connection errors

If you're trying to connect to a ChromaDB server but getting connection errors:

1. Make sure the server is running (`python -m chromadb.server`)
2. Check that the URL in your `.env` file is correct
3. Ensure there are no firewall issues blocking the connection

### OpenAI API Key errors

ChromaDB uses OpenAI's embedding model to convert text to vectors. Make sure your OpenAI API key is set:

```
OPENAI_API_KEY=your-api-key-here
```

## How It Works

1. The RAG system first tries to use ChromaDB for document retrieval
2. If ChromaDB is not available or returns no results, it falls back to the in-memory implementation
3. This ensures the application works even if ChromaDB is not properly set up

## Next Steps

After setting up persistent storage with ChromaDB, consider:

1. Implementing re-ranking to improve retrieval quality
2. Adding code generation capabilities based on documentation context
3. Implementing AI model selection (OpenAI vs Anthropic)
