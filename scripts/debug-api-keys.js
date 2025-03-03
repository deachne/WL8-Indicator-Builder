// Debug script to test API keys
const fetch = require('node-fetch');

async function testApiKeys() {
  try {
    // Get API keys from command line arguments
    const openaiKey = process.argv[2];
    const anthropicKey = process.argv[3];
    
    if (!openaiKey && !anthropicKey) {
      console.error('❌ Error: Please provide at least one API key');
      console.log('Usage: node debug-api-keys.js [openai_key] [anthropic_key]');
      process.exit(1);
    }
    
    console.log('🔑 Testing API keys...');
    
    // Test OpenAI key if provided
    if (openaiKey) {
      console.log('\n📝 Testing OpenAI API key...');
      try {
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
              { role: 'system', content: 'You are a helpful assistant.' },
              { role: 'user', content: 'Say "OpenAI connection successful" in 10 words or less.' }
            ],
            max_tokens: 20
          })
        });
        
        const openaiData = await openaiResponse.json();
        
        if (openaiResponse.ok) {
          console.log('✅ OpenAI API key is valid!');
          console.log(`📊 Response: "${openaiData.choices[0].message.content}"`);
          console.log(`📊 Model: ${openaiData.model}`);
        } else {
          console.error('❌ OpenAI API key is invalid!');
          console.error(`📊 Error: ${openaiData.error?.message || JSON.stringify(openaiData)}`);
        }
      } catch (error) {
        console.error('❌ Error testing OpenAI API key:', error.message);
      }
    }
    
    // Test Anthropic key if provided
    if (anthropicKey) {
      console.log('\n📝 Testing Anthropic API key...');
      try {
        const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': anthropicKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-sonnet-20240229',
            messages: [
              {
                role: 'user',
                content: 'Say "Claude connection successful" in 10 words or less.'
              }
            ],
            max_tokens: 20
          })
        });
        
        const anthropicData = await anthropicResponse.json();
        
        if (anthropicResponse.ok) {
          console.log('✅ Anthropic API key is valid!');
          console.log(`📊 Response: "${anthropicData.content[0].text}"`);
          console.log(`📊 Model: ${anthropicData.model}`);
        } else {
          console.error('❌ Anthropic API key is invalid!');
          console.error(`📊 Error: ${anthropicData.error?.message || JSON.stringify(anthropicData)}`);
        }
      } catch (error) {
        console.error('❌ Error testing Anthropic API key:', error.message);
      }
    }
    
    // Test the local API endpoint
    console.log('\n📝 Testing local API endpoint with the provided keys...');
    try {
      const localResponse = await fetch('http://localhost:3000/api/rag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: 'Test query to verify API keys are working',
          openaiKey: openaiKey || '',
          anthropicKey: anthropicKey || ''
        })
      });
      
      if (localResponse.ok) {
        const localData = await localResponse.json();
        console.log('✅ Local API endpoint test successful!');
        console.log(`📊 Provider used: ${localData.provider}`);
        console.log(`📊 Model used: ${localData.model}`);
      } else {
        const errorText = await localResponse.text();
        console.error('❌ Local API endpoint test failed!');
        console.error(`📊 Error: ${errorText}`);
      }
    } catch (error) {
      console.error('❌ Error testing local API endpoint:', error.message);
      console.log('⚠️ Make sure your Next.js development server is running on port 3000');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testApiKeys();
