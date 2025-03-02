import { ChromaClient } from 'chromadb';
import { OpenAIEmbeddingFunction } from 'chromadb';
import fs from 'fs';
import path from 'path';

// Configuration
const COLLECTION_NAME = "wl8_documentation";
const DOCS_DIR = path.join(process.cwd(), 'docs');
const PROCESSED_DOCS_PATH = path.join(DOCS_DIR, 'processed-documents.json');
const CHROMA_DB_DIR = path.join(process.cwd(), 'chroma-db');

// ChromaDB connection options
const CHROMA_SERVER_URL = process.env.CHROMA_SERVER_URL || "memory"; // Use "memory" or a URL like "http://localhost:8000"

// Environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// ChromaDB client for vector storage
let client: ChromaClient | null = null;
let collection: any = null;
let embedder: any = null;

/**
 * Initialize the ChromaDB client
 */
export async function initializeChromaDB() {
  try {
    console.log('Initializing ChromaDB client...');
    
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }
    
    // Initialize ChromaDB client
    if (CHROMA_SERVER_URL === "memory") {
      console.log('Initializing ChromaDB client in memory mode');
      client = new ChromaClient({ path: "memory" });
    } else {
      console.log(`Initializing ChromaDB client with server URL: ${CHROMA_SERVER_URL}`);
      client = new ChromaClient({ path: CHROMA_SERVER_URL });
    }
    
    // Initialize embedding function with OpenAI
    embedder = new OpenAIEmbeddingFunction({
      openai_api_key: OPENAI_API_KEY,
      openai_model: "text-embedding-3-small"
    });
    
    // Get or create collection
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
    
    return { 
      success: true, 
      message: 'ChromaDB client initialized successfully',
      collection
    };
  } catch (error) {
    console.error('Error initializing ChromaDB client:', error);
    return { 
      success: false, 
      message: `Error initializing ChromaDB client: ${error}`,
      error
    };
  }
}

/**
 * Import processed documents into ChromaDB
 */
export async function importDocumentsToChroma() {
  try {
    console.log('Importing documents to ChromaDB...');
    
    // Check if processed documents exist
    if (!fs.existsSync(PROCESSED_DOCS_PATH)) {
      throw new Error(`Processed documents not found at ${PROCESSED_DOCS_PATH}. Run the import-docs.js script first.`);
    }
    
    // Read processed documents
    const processedDocsJson = fs.readFileSync(PROCESSED_DOCS_PATH, 'utf8');
    const processedDocs = JSON.parse(processedDocsJson);
    
    console.log(`Found ${processedDocs.length} processed documents to import`);
    
    // Initialize ChromaDB client if not already initialized
    if (!client || !collection) {
      const result = await initializeChromaDB();
      if (!result.success || !result.collection) {
        throw new Error('Failed to initialize ChromaDB client');
      }
      collection = result.collection;
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
      const ids = batch.map((doc: any, index: number) => `${doc.metadata.id}-${doc.metadata.chunkIndex || index}`);
      const documents = batch.map((doc: any) => doc.pageContent);
      const metadatas = batch.map((doc: any) => doc.metadata);
      
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
    
    return {
      success: true,
      message: `Successfully imported ${totalAdded} documents to ChromaDB`,
      count: totalAdded
    };
  } catch (error) {
    console.error('Error importing documents to ChromaDB:', error);
    return {
      success: false,
      message: `Error importing documents to ChromaDB: ${error}`,
      error
    };
  }
}

/**
 * Query ChromaDB for relevant documents
 */
export async function queryChromaDB(query: string, options: { k?: number; filter?: any } = {}) {
  try {
    // Initialize ChromaDB client if not already initialized
    if (!client || !collection) {
      const result = await initializeChromaDB();
      if (!result.success || !result.collection) {
        throw new Error('Failed to initialize ChromaDB client');
      }
      collection = result.collection;
    }
    
    // Set default options
    const k = options.k || 5;
    const filter = options.filter || {};
    
    // Perform similarity search
    const results = await collection.query({
      queryTexts: [query],
      nResults: k,
      where: filter
    });
    
    // Format results to match the expected structure
    const formattedResults = results.documents[0].map((document: string, index: number) => {
      return {
        pageContent: document,
        metadata: results.metadatas[0][index]
      };
    });
    
    return {
      success: true,
      results: formattedResults
    };
  } catch (error) {
    console.error('Error querying ChromaDB:', error);
    return {
      success: false,
      message: `Error querying ChromaDB: ${error}`,
      error
    };
  }
}

/**
 * Get information about the ChromaDB collection
 */
export async function getChromaCollectionInfo() {
  try {
    // Initialize ChromaDB client if not already initialized
    if (!client || !collection) {
      const result = await initializeChromaDB();
      if (!result.success || !result.collection) {
        throw new Error('Failed to initialize ChromaDB client');
      }
      collection = result.collection;
    }
    
    // Get collection info
    const count = await collection.count();
    
    return {
      success: true,
      collectionName: COLLECTION_NAME,
      documentCount: count
    };
  } catch (error) {
    console.error('Error getting ChromaDB collection info:', error);
    return {
      success: false,
      message: `Error getting ChromaDB collection info: ${error}`,
      error
    };
  }
}
