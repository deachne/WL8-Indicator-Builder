#!/usr/bin/env node

/**
 * Run ChromaDB Client Script
 * 
 * This script initializes a ChromaDB client using the JavaScript SDK
 * and optionally imports documents.
 * 
 * Usage:
 *   node scripts/run-chroma.js [--import]
 */

// Load environment variables from .env file
require('dotenv').config();

const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

// Import ChromaDB client
const { ChromaClient } = require('chromadb');
const { OpenAIEmbeddingFunction } = require('chromadb');

// Configuration
const CHROMA_DIR = path.join(__dirname, '..', 'chroma-db');
const DOCS_DIR = path.join(__dirname, '..', 'docs');
const PROCESSED_DOCS_PATH = path.join(DOCS_DIR, 'processed-documents.json');

// Check if import flag is provided
const shouldImport = process.argv.includes('--import');

// Ensure ChromaDB directory exists
if (!fs.existsSync(CHROMA_DIR)) {
  fs.mkdirSync(CHROMA_DIR, { recursive: true });
  console.log(`Created ChromaDB directory: ${CHROMA_DIR}`);
}

// Initialize ChromaDB client
console.log('Initializing ChromaDB client in memory mode...');
let client;

try {
  client = new ChromaClient({ path: "memory" });
  console.log('ChromaDB client initialized in memory mode');
  console.log('Note: For production use, consider running a persistent ChromaDB server with Python:');
  console.log('  pip install chromadb');
  console.log('  python -m chromadb.server');
  console.log('Then set CHROMA_SERVER_URL=http://localhost:8000 in your .env file');
} catch (error) {
  console.error('Error initializing ChromaDB client:', error);
  console.error('Make sure you have installed the required packages:');
  console.error('npm install chromadb chromadb-default-embed');
  process.exit(1);
}

// Import documents if flag is provided
if (shouldImport) {
  console.log('Importing documents to ChromaDB...');
  
  // Check if processed documents exist
  if (!fs.existsSync(PROCESSED_DOCS_PATH)) {
    console.error(`Processed documents not found at ${PROCESSED_DOCS_PATH}. Run the import-docs.js script first.`);
    process.exit(1);
  }
  
  // Run the import script
  const importProcess = spawn('node', ['scripts/import-chroma.js'], {
    stdio: 'inherit',
    shell: true
  });
  
  importProcess.on('error', (error) => {
    console.error('Failed to run import script:', error);
    process.exit(1);
  });
  
  importProcess.on('exit', (code) => {
    if (code === 0) {
      console.log('Import completed successfully');
    } else {
      console.error(`Import failed with code ${code}`);
      process.exit(code);
    }
  });
} else {
  console.log('ChromaDB client is ready. Use --import flag to import documents.');
}

// Keep the script running to simulate a server
if (!shouldImport) {
  console.log('Press Ctrl+C to stop the ChromaDB client.');
  
  // List collections every 5 seconds to show the server is running
  const interval = setInterval(async () => {
    try {
      const collections = await client.listCollections();
      console.log(`[${new Date().toLocaleTimeString()}] Server running. Collections: ${collections.length}`);
    } catch (error) {
      console.error('Error listing collections:', error);
    }
  }, 5000);
  
  // Handle process termination
  process.on('SIGINT', () => {
    clearInterval(interval);
    console.log('Stopping ChromaDB client...');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    clearInterval(interval);
    console.log('Stopping ChromaDB client...');
    process.exit(0);
  });
}
