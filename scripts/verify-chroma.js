#!/usr/bin/env node

/**
 * Verify ChromaDB Storage Script
 * 
 * This script verifies that ChromaDB is correctly storing and retrieving documents.
 * It tests the connection, lists collections, counts documents, and performs a test query.
 * 
 * Usage:
 *   node scripts/verify-chroma.js
 */

// Load environment variables from .env file
require('dotenv').config();

const path = require('path');
const { ChromaClient } = require('chromadb');
const { OpenAIEmbeddingFunction } = require('chromadb');

// Configuration
const COLLECTION_NAME = "wl8_documentation";

// ChromaDB connection options
const CHROMA_SERVER_URL = process.env.CHROMA_SERVER_URL || "memory"; // Use "memory" or a URL like "http://localhost:8000"

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
    console.log('Starting ChromaDB verification...');
    
    // Initialize ChromaDB client
    let client;
    if (CHROMA_SERVER_URL === "memory") {
      console.log('Initializing ChromaDB client in memory mode');
      client = new ChromaClient({ path: "memory" });
    } else {
      console.log(`Initializing ChromaDB client with server URL: ${CHROMA_SERVER_URL}`);
      client = new ChromaClient({ path: CHROMA_SERVER_URL });
    }
    
    // Initialize embedding function with OpenAI
    const embedder = new OpenAIEmbeddingFunction({
      openai_api_key: OPENAI_API_KEY,
      openai_model: "text-embedding-3-small"
    });
    
    // List all collections
    console.log('Listing all collections...');
    const collections = await client.listCollections();
    console.log(`Found ${collections.length} collections:`);
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
    // Check if our collection exists
    const hasCollection = collections.some(collection => collection.name === COLLECTION_NAME);
    if (!hasCollection) {
      console.log(`Collection ${COLLECTION_NAME} does not exist. Please run the import script first.`);
      process.exit(0);
    }
    
    // Get the collection
    console.log(`Getting collection: ${COLLECTION_NAME}`);
    const collection = await client.getCollection({
      name: COLLECTION_NAME,
      embeddingFunction: embedder
    });
    
    // Count items in collection
    const count = await collection.count();
    console.log(`Document count in collection: ${count}`);
    
    if (count === 0) {
      console.log('Collection is empty. Please run the import script first.');
      process.exit(0);
    }
    
    // Do a simple query to test retrieval
    console.log('Performing test query...');
    const result = await collection.query({
      queryTexts: ["How to create a simple moving average indicator"],
      nResults: 2
    });
    
    console.log(`Query returned ${result.documents[0].length} results`);
    
    // Display the first result
    if (result.documents[0].length > 0) {
      console.log('\nFirst result:');
      console.log(`Document: ${result.documents[0][0].substring(0, 200)}...`);
      console.log(`Metadata: ${JSON.stringify(result.metadatas[0][0], null, 2)}`);
    }
    
    console.log('\nChromaDB verification completed successfully!');
    
    // Provide information about persistence
    if (CHROMA_SERVER_URL === "memory") {
      console.log('\nNOTE: You are using in-memory mode, which means data will be lost when the process ends.');
      console.log('To use persistent storage, set the CHROMA_SERVER_URL environment variable to a ChromaDB server URL:');
      console.log('  1. Install and run a ChromaDB server: pip install chromadb && python -m chromadb.server');
      console.log('  2. Set the environment variable: export CHROMA_SERVER_URL=http://localhost:8000');
    } else {
      console.log(`\nYou are connected to a ChromaDB server at: ${CHROMA_SERVER_URL}`);
      console.log('Data should be persisted as long as the server is running.');
    }
    
  } catch (error) {
    console.error('Error verifying ChromaDB:', error);
    process.exit(1);
  }
}

// Run the script
main();
