#!/usr/bin/env node

/**
 * Run ChromaDB Server Script
 * 
 * This script starts a ChromaDB server and optionally imports documents.
 * 
 * Usage:
 *   node scripts/run-chroma.js [--import]
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

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

// Start ChromaDB server
console.log('Starting ChromaDB server...');

// Use npx to run chroma
const chromaProcess = spawn('npx', ['chromadb', 'start', '--path', CHROMA_DIR], {
  stdio: 'inherit',
  shell: true
});

// Handle ChromaDB server process
chromaProcess.on('error', (error) => {
  console.error('Failed to start ChromaDB server:', error);
  process.exit(1);
});

// Handle ChromaDB server exit
chromaProcess.on('exit', (code, signal) => {
  if (code) {
    console.log(`ChromaDB server exited with code ${code}`);
  } else if (signal) {
    console.log(`ChromaDB server was killed with signal ${signal}`);
  } else {
    console.log('ChromaDB server exited');
  }
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Stopping ChromaDB server...');
  chromaProcess.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Stopping ChromaDB server...');
  chromaProcess.kill('SIGTERM');
  process.exit(0);
});

// Import documents if flag is provided
if (shouldImport) {
  // Wait for ChromaDB server to start
  setTimeout(() => {
    console.log('Importing documents to ChromaDB...');
    
    // Check if processed documents exist
    if (!fs.existsSync(PROCESSED_DOCS_PATH)) {
      console.error(`Processed documents not found at ${PROCESSED_DOCS_PATH}. Run the import-docs.js script first.`);
      return;
    }
    
    // Run the import script
    const importProcess = spawn('node', ['scripts/import-chroma.js'], {
      stdio: 'inherit',
      shell: true
    });
    
    importProcess.on('error', (error) => {
      console.error('Failed to run import script:', error);
    });
    
    importProcess.on('exit', (code) => {
      if (code === 0) {
        console.log('Import completed successfully');
      } else {
        console.error(`Import failed with code ${code}`);
      }
    });
  }, 5000); // Wait 5 seconds for ChromaDB server to start
}

console.log('ChromaDB server is running. Press Ctrl+C to stop.');
