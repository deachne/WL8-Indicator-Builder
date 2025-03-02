#!/usr/bin/env node

/**
 * Import Documents to ChromaDB Script
 * 
 * This script imports processed documents into ChromaDB using the JavaScript client.
 * It requires that the documents have been processed by the import-docs.js script.
 * 
 * Usage:
 *   node scripts/import-chroma.js
 */

// Load environment variables from .env file
require('dotenv').config();

const path = require('path');
const fs = require('fs');
const { ChromaClient } = require('chromadb');
const { OpenAIEmbeddingFunction } = require('chromadb');

// Configuration
const DOCS_DIR = path.join(__dirname, '..', 'docs');
const PROCESSED_DOCS_PATH = path.join(DOCS_DIR, 'processed-documents.json');
const COLLECTION_NAME = "wl8_documentation";

// Check for OpenAI API key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY environment variable is not set');
  console.error('Please set it before running this script:');
  console.error('export OPENAI_API_KEY=your_api_key_here');
  process.exit(1);
}

// Main function
async function main() {
  try {
    console.log('Starting import of documents to ChromaDB...');
    
    // Check if processed documents exist
    if (!fs.existsSync(PROCESSED_DOCS_PATH)) {
      console.error(`Processed documents not found at ${PROCESSED_DOCS_PATH}. Run the import-docs.js script first.`);
      process.exit(1);
    }
    
    // Read processed documents
    const processedDocsJson = fs.readFileSync(PROCESSED_DOCS_PATH, 'utf8');
    const processedDocs = JSON.parse(processedDocsJson);
    
    console.log(`Found ${processedDocs.length} processed documents to import`);
    
    // Initialize ChromaDB client
    console.log('Initializing ChromaDB client in memory mode...');
    const client = new ChromaClient({ path: "memory" });
    
    // Initialize embedding function with OpenAI
    const embedder = new OpenAIEmbeddingFunction({
      openai_api_key: OPENAI_API_KEY,
      openai_model: "text-embedding-3-small"
    });
    
    // Get or create collection
    console.log(`Getting or creating collection: ${COLLECTION_NAME}`);
    let collection;
    try {
      collection = await client.getCollection({
        name: COLLECTION_NAME,
        embeddingFunction: embedder
      });
      console.log(`Collection ${COLLECTION_NAME} exists, using existing collection`);
    } catch (error) {
      console.log(`Collection ${COLLECTION_NAME} does not exist, creating new collection`);
      collection = await client.createCollection({
        name: COLLECTION_NAME,
        embeddingFunction: embedder,
        metadata: { "hnsw:space": "cosine" }
      });
    }
    
    // Process documents in batches to avoid memory issues
    const batchSize = 100;
    const batches = [];
    for (let i = 0; i < processedDocs.length; i += batchSize) {
      batches.push(processedDocs.slice(i, i + batchSize));
    }
    
    console.log(`Processing ${batches.length} batches of documents (batch size: ${batchSize})`);
    
    // Add documents to ChromaDB in batches
    let totalAdded = 0;
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`Adding batch ${i + 1}/${batches.length} (${batch.length} documents)...`);
      
      // Prepare documents for ChromaDB
      const ids = batch.map((doc, index) => `${doc.metadata.id}-${doc.metadata.chunkIndex || index}`);
      const documents = batch.map(doc => doc.pageContent);
      const metadatas = batch.map(doc => doc.metadata);
      
      // Add documents to collection
      await collection.add({
        ids,
        documents,
        metadatas
      });
      
      totalAdded += batch.length;
      console.log(`Progress: ${Math.round((totalAdded / processedDocs.length) * 100)}% (${totalAdded}/${processedDocs.length})`);
    }
    
    console.log(`Successfully imported ${totalAdded} documents to ChromaDB`);
    
  } catch (error) {
    console.error('Error importing documents to ChromaDB:', error);
    process.exit(1);
  }
}

// Run the script
main();
