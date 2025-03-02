#!/usr/bin/env node

/**
 * Import Documents to Supabase Script
 * 
 * This script imports processed documents into Supabase using the JavaScript client.
 * It requires that the documents have been processed by the import-docs.js script.
 * 
 * Usage:
 *   node scripts/import-supabase.js
 */

// Load environment variables from .env file
require('dotenv').config();

const path = require('path');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const { OpenAIEmbeddings } = require('@langchain/openai');

// Configuration
const DOCS_DIR = path.join(__dirname, '..', 'docs');
const PROCESSED_DOCS_PATH = path.join(DOCS_DIR, 'processed-documents.json');

// Check for environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate environment variables
if (!OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY environment variable is not set');
  console.error('Please set it before running this script:');
  console.error('export OPENAI_API_KEY=your_api_key_here');
  process.exit(1);
}

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Supabase environment variables are not set');
  console.error('Please set them before running this script:');
  console.error('export NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
  console.error('export SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Initialize OpenAI embeddings
const embeddings = new OpenAIEmbeddings({
  openAIApiKey: OPENAI_API_KEY,
  modelName: "text-embedding-3-small",
});

// Main function
async function main() {
  try {
    console.log('Starting import of documents to Supabase...');
    
    // Check if processed documents exist
    if (!fs.existsSync(PROCESSED_DOCS_PATH)) {
      console.error(`Processed documents not found at ${PROCESSED_DOCS_PATH}. Run the import-docs.js script first.`);
      process.exit(1);
    }
    
    // Read processed documents
    const processedDocsJson = fs.readFileSync(PROCESSED_DOCS_PATH, 'utf8');
    const processedDocs = JSON.parse(processedDocsJson);
    
    console.log(`Found ${processedDocs.length} processed documents to import`);
    
    // Check if Supabase is properly configured
    console.log('Checking Supabase connection...');
    
    try {
      // Check if the documentation table exists
      const { error: tableCheckError } = await supabase
        .from('documentation')
        .select('id')
        .limit(1);
      
      if (tableCheckError && tableCheckError.message.includes('relation "documentation" does not exist')) {
        console.log('Documentation table does not exist. Please create the schema manually.');
        console.log('Follow these steps:');
        console.log('1. Go to your Supabase project dashboard');
        console.log('2. Navigate to the SQL Editor');
        console.log('3. Copy and paste the contents of scripts/create-supabase-schema.sql');
        console.log('4. Execute the SQL script');
        console.log('5. Run this import script again');
        process.exit(1);
      } else if (tableCheckError) {
        console.error('Error checking documentation table:', tableCheckError);
        throw tableCheckError;
      } else {
        console.log('Documentation table exists, proceeding with import');
      }
    } catch (error) {
      console.error('Error setting up Supabase schema:', error);
      console.log('Continuing with import anyway...');
    }
    
    // Process documents in batches to avoid memory issues
    const batchSize = 50;
    const batches = [];
    for (let i = 0; i < processedDocs.length; i += batchSize) {
      batches.push(processedDocs.slice(i, i + batchSize));
    }
    
    console.log(`Processing ${batches.length} batches of documents (batch size: ${batchSize})`);
    
    // Add documents to Supabase in batches
    let totalAdded = 0;
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`Adding batch ${i + 1}/${batches.length} (${batch.length} documents)...`);
      
      // Process each document in the batch
      for (const doc of batch) {
        try {
          // Generate embedding for the document
          const embedding = await embeddings.embedQuery(doc.pageContent);
          
          // Store in Supabase
          const { error } = await supabase.from('documentation').insert({
            content: doc.pageContent,
            embedding,
            metadata: doc.metadata
          });
          
          if (error) {
            console.error('Error inserting document:', error);
            continue;
          }
          
          totalAdded++;
        } catch (error) {
          console.error('Error processing document:', error);
          continue;
        }
      }
      
      console.log(`Progress: ${Math.round((totalAdded / processedDocs.length) * 100)}% (${totalAdded}/${processedDocs.length})`);
    }
    
    console.log(`Successfully imported ${totalAdded} documents to Supabase`);
    
  } catch (error) {
    console.error('Error importing documents to Supabase:', error);
    process.exit(1);
  }
}

// Run the script
main();
