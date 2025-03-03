// Test script to directly test the RAG API
const fetch = require('node-fetch');
require('dotenv').config();

// Test queries
const testQueries = [
  "Can you clear the editor?",
  "Can we have a conversation about building indicators?",
  "Create an RSI indicator",
  "What's your role as an AI?",
  "Can you look up framework back testing?"
];

// Test the RAG API with a query
async function testRagApi(query) {
  console.log(`🔍 Testing RAG API with query: "${query}"`);
  
  try {
    const response = await fetch('http://localhost:3005/api/rag', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
    
    console.log('📥 Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log('✅ Query successful');
    console.log('📝 Response action type:', data.action?.type || 'none');
    console.log('📝 Response answer (first 150 chars):', data.answer.substring(0, 150) + '...');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing RAG API:', error.message);
    return false;
  }
}

// Run tests for all queries
async function runTests() {
  console.log('🚀 Starting RAG API tests...');
  
  let successCount = 0;
  
  for (const query of testQueries) {
    const success = await testRagApi(query);
    if (success) successCount++;
    console.log('-----------------------------------');
  }
  
  console.log(`\n📊 Test Results: ${successCount}/${testQueries.length} queries successful`);
  
  if (successCount < testQueries.length) {
    console.log('\n⚠️ Some queries failed. Check the logs for details.');
  } else {
    console.log('\n🎉 All queries successful!');
  }
}

runTests().catch(console.error);
