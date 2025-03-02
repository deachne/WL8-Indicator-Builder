import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "langchain/document";
import fs from 'fs';
import path from 'path';

// Configuration
const COLLECTION_NAME = "wl8_documentation";
const CHROMA_DIR = path.join(process.cwd(), 'chroma-db');
const DOCS_DIR = path.join(process.cwd(), 'docs');
const PROCESSED_DOCS_PATH = path.join(DOCS_DIR, 'processed-documents.json');

// Environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// ChromaDB client for vector storage
let vectorStore: Chroma | null = null;

/**
 * Initialize the ChromaDB client
 */
export async function initializeChromaDB() {
  try {
    console.log('Initializing ChromaDB client...');
    
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }
    
    // Initialize OpenAI embeddings
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: OPENAI_API_KEY,
      modelName: "text-embedding-3-small", // Using the latest embedding model
    });
    
    // Ensure ChromaDB directory exists
    if (!fs.existsSync(CHROMA_DIR)) {
      fs.mkdirSync(CHROMA_DIR, { recursive: true });
      console.log(`Created ChromaDB directory: ${CHROMA_DIR}`);
    }
    
    // Initialize ChromaDB client
    vectorStore = await Chroma.fromExistingCollection(
      embeddings,
      { 
        collectionName: COLLECTION_NAME,
        url: "http://localhost:8000", // Default ChromaDB server URL
        collectionMetadata: {
          "hnsw:space": "cosine",
        },
      }
    ).catch(async () => {
      console.log(`Collection ${COLLECTION_NAME} does not exist, creating new collection`);
      return await createEmptyCollection(embeddings);
    });
    
    return { 
      success: true, 
      message: 'ChromaDB client initialized successfully',
      vectorStore
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
 * Create an empty ChromaDB collection
 */
async function createEmptyCollection(embeddings: OpenAIEmbeddings): Promise<Chroma> {
  console.log('Creating new ChromaDB collection...');
  
  // Create a new ChromaDB collection
  const vectorStore = await Chroma.fromDocuments(
    [new Document({ pageContent: "Initialization document", metadata: { source: "init" } })],
    embeddings,
    { 
      collectionName: COLLECTION_NAME,
      url: "http://localhost:8000", // Default ChromaDB server URL
      collectionMetadata: {
        "hnsw:space": "cosine",
      },
    }
  );
  
  console.log(`Created new ChromaDB collection: ${COLLECTION_NAME}`);
  
  return vectorStore;
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
    
    // Initialize ChromaDB client
    const result = await initializeChromaDB();
    if (!result.success || !result.vectorStore) {
      throw new Error('Failed to initialize ChromaDB client');
    }
    
    // Convert processed documents to LangChain documents
    const documents = processedDocs.map((doc: any) => 
      new Document({
        pageContent: doc.pageContent,
        metadata: doc.metadata
      })
    );
    
    // Split documents into batches to avoid memory issues
    const batchSize = 100;
    const batches = [];
    for (let i = 0; i < documents.length; i += batchSize) {
      batches.push(documents.slice(i, i + batchSize));
    }
    
    // Add documents to ChromaDB in batches
    let totalAdded = 0;
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`Adding batch ${i + 1}/${batches.length} (${batch.length} documents)...`);
      
      await result.vectorStore.addDocuments(batch);
      
      totalAdded += batch.length;
      console.log(`Progress: ${Math.round((totalAdded / documents.length) * 100)}% (${totalAdded}/${documents.length})`);
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
    if (!vectorStore) {
      const result = await initializeChromaDB();
      if (!result.success || !result.vectorStore) {
        throw new Error('Failed to initialize ChromaDB client');
      }
      vectorStore = result.vectorStore;
    }
    
    // Set default options
    const k = options.k || 5;
    const filter = options.filter || {};
    
    // Perform similarity search
    const results = await vectorStore.similaritySearch(query, k, filter);
    
    return {
      success: true,
      results
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
 * Create a retriever from the ChromaDB vector store
 */
export async function getChromaRetriever(options: { k?: number; filter?: any } = {}) {
  try {
    // Initialize ChromaDB client if not already initialized
    if (!vectorStore) {
      const result = await initializeChromaDB();
      if (!result.success || !result.vectorStore) {
        throw new Error('Failed to initialize ChromaDB client');
      }
      vectorStore = result.vectorStore;
    }
    
    // Set default options
    const k = options.k || 5;
    const filter = options.filter || {};
    
    // Create retriever
    const retriever = vectorStore.asRetriever({
      k,
      filter
    });
    
    return {
      success: true,
      retriever
    };
  } catch (error) {
    console.error('Error creating ChromaDB retriever:', error);
    return {
      success: false,
      message: `Error creating ChromaDB retriever: ${error}`,
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
    if (!vectorStore) {
      const result = await initializeChromaDB();
      if (!result.success || !result.vectorStore) {
        throw new Error('Failed to initialize ChromaDB client');
      }
      vectorStore = result.vectorStore;
    }
    
    // Get collection info
    const collection = await vectorStore.collection;
    if (!collection) {
      throw new Error('ChromaDB collection is undefined');
    }
    const count = await collection.count();
    
    return {
      success: true,
      collectionName: COLLECTION_NAME,
      documentCount: count,
      directory: CHROMA_DIR
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
