#!/usr/bin/env node

/**
 * Verify Supabase Setup Script
 * 
 * This script verifies that Supabase is properly set up for vector storage
 * and performs a test query to ensure everything is working correctly.
 * 
 * Usage:
 *   node scripts/verify-supabase.js
 */

// Load environment variables from .env file
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');
const { OpenAIEmbeddings } = require('@langchain/openai');

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
    console.log('Verifying Supabase setup...');
    
    // Check connection to Supabase
    console.log('Checking connection to Supabase...');
    const { data: connectionData, error: connectionError } = await supabase.from('documentation').select('id').limit(1);
    
    if (connectionError) {
      console.error('Error connecting to Supabase:', connectionError);
      
      // Check if the error is because the table doesn't exist
      if (connectionError.message.includes('relation') && connectionError.message.includes('does not exist')) {
        console.error('The documentation table does not exist. Please create the schema manually.');
        console.error('Follow these steps:');
        console.error('1. Go to your Supabase project dashboard');
        console.error('2. Navigate to the SQL Editor');
        console.error('3. Copy and paste the contents of scripts/create-supabase-schema.sql');
        console.error('4. Execute the SQL script');
        console.error('5. Run the import-supabase.js script to import documents');
      }
      
      process.exit(1);
    }
    
    console.log('✅ Successfully connected to Supabase');
    
    // Check document count
    console.log('Checking document count...');
    const { count, error: countError } = await supabase.from('documentation').select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Error checking document count:', countError);
      process.exit(1);
    }
    
    console.log(`✅ Found ${count} documents in the documentation table`);
    
    if (count === 0) {
      console.warn('⚠️ No documents found. Please run the import-supabase.js script to import documents.');
      process.exit(0);
    }
    
    // Perform a test query
    console.log('Performing a test query...');
    const testQuery = 'How do I create an indicator in WL8?';
    
    // Generate embedding for the query
    const queryEmbedding = await embeddings.embedQuery(testQuery);
    
    // Search for similar documents
    const { data: results, error: queryError } = await supabase.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: 0.5,
      match_count: 3
    });
    
    if (queryError) {
      console.error('Error performing test query:', queryError);
      
      // Check if the error is because the function doesn't exist
      if (queryError.message.includes('function') && queryError.message.includes('does not exist')) {
        console.error('The match_documents function does not exist. Please create the schema manually.');
        console.error('Follow these steps:');
        console.error('1. Go to your Supabase project dashboard');
        console.error('2. Navigate to the SQL Editor');
        console.error('3. Copy and paste the contents of scripts/create-supabase-schema.sql');
        console.error('4. Execute the SQL script');
        console.error('5. Run the import-supabase.js script to import documents');
      }
      
      process.exit(1);
    }
    
    console.log(`✅ Test query successful, found ${results.length} matching documents`);
    
    // Display the top result
    if (results.length > 0) {
      const topResult = results[0];
      console.log('\nTop result:');
      console.log(`Title: ${topResult.metadata.title}`);
      console.log(`Similarity: ${topResult.similarity.toFixed(4)}`);
      console.log(`Content: ${topResult.content.substring(0, 200)}...`);
    }
    
    console.log('\n✅ Supabase vector storage is working correctly!');
    
  } catch (error) {
    console.error('Error verifying Supabase setup:', error);
    process.exit(1);
  }
}

// Run the script
main();
