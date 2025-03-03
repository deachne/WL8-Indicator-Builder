// Test script to verify API connections
const { OpenAI } = require('openai');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Test OpenAI API connection
async function testOpenAI() {
  console.log('🔍 Testing OpenAI API connection...');
  
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY is not set in the environment variables');
    return false;
  }
  
  try {
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Test OpenAI connection" }
      ],
      max_tokens: 50
    });
    
    console.log('✅ OpenAI API connection successful');
    console.log('📝 Response:', response.choices[0].message.content);
    return true;
  } catch (error) {
    console.error('❌ OpenAI API connection failed:', error.message);
    return false;
  }
}

// Test Supabase connection
async function testSupabase() {
  console.log('🔍 Testing Supabase connection...');
  
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Supabase credentials are not set in the environment variables');
    return false;
  }
  
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    
    // Test a simple query
    const { data, error, count } = await supabase
      .from('documentation')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      throw error;
    }
    
    console.log('✅ Supabase connection successful');
    console.log(`📝 Found ${count} documents in the documentation table`);
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message);
    return false;
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting API connection tests...');
  
  const openaiSuccess = await testOpenAI();
  const supabaseSuccess = await testSupabase();
  
  console.log('\n📊 Test Results:');
  console.log(`OpenAI API: ${openaiSuccess ? '✅ Connected' : '❌ Failed'}`);
  console.log(`Supabase: ${supabaseSuccess ? '✅ Connected' : '❌ Failed'}`);
  
  if (!openaiSuccess || !supabaseSuccess) {
    console.log('\n⚠️ Some connections failed. Please check your environment variables and API keys.');
  } else {
    console.log('\n🎉 All connections successful!');
  }
}

runTests().catch(console.error);
