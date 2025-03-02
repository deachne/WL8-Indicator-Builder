#!/usr/bin/env node

/**
 * Import Documents to ChromaDB Script
 * 
 * This script imports processed documents into ChromaDB.
 * It requires that the ChromaDB server is running and that
 * the documents have been processed by the import-docs.js script.
 * 
 * Usage:
 *   node scripts/import-chroma.js
 */

const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// Configuration
const DOCS_DIR = path.join(__dirname, '..', 'docs');
const PROCESSED_DOCS_PATH = path.join(DOCS_DIR, 'processed-documents.json');

// Main function
async function main() {
  try {
    console.log('Starting import of documents to ChromaDB...');
    
    // Check if processed documents exist
    if (!fs.existsSync(PROCESSED_DOCS_PATH)) {
      console.error(`Processed documents not found at ${PROCESSED_DOCS_PATH}. Run the import-docs.js script first.`);
      process.exit(1);
    }
    
    // Read processed documents to get count
    const processedDocsJson = fs.readFileSync(PROCESSED_DOCS_PATH, 'utf8');
    const processedDocs = JSON.parse(processedDocsJson);
    
    console.log(`Found ${processedDocs.length} processed documents to import`);
    
    // Run the TypeScript import function using ts-node
    console.log('Importing documents to ChromaDB...');
    
    // Create a temporary script to import documents
    const tempScriptPath = path.join(__dirname, 'temp-import.js');
    
    const scriptContent = `
    // This is a temporary script to import documents to ChromaDB
    const { importDocumentsToChroma } = require('../lib/chroma-client');
    
    async function runImport() {
      try {
        const result = await importDocumentsToChroma();
        if (result.success) {
          console.log(result.message);
          process.exit(0);
        } else {
          console.error(result.message);
          process.exit(1);
        }
      } catch (error) {
        console.error('Error importing documents:', error);
        process.exit(1);
      }
    }
    
    runImport();
    `;
    
    fs.writeFileSync(tempScriptPath, scriptContent);
    
    try {
      // Run the script with ts-node
      execSync(`npx ts-node ${tempScriptPath}`, { stdio: 'inherit' });
      console.log('Import completed successfully');
    } catch (error) {
      console.error('Error running import script:', error);
      process.exit(1);
    } finally {
      // Clean up temporary script
      fs.unlinkSync(tempScriptPath);
    }
    
  } catch (error) {
    console.error('Error importing documents to ChromaDB:', error);
    process.exit(1);
  }
}

// Run the script
main();
