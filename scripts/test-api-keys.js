#!/usr/bin/env node

/**
 * Test script to verify API connections to OpenAI and Anthropic
 * 
 * Usage:
 *   node scripts/test-api-keys.js
 */

require('dotenv').config();
const { OpenAI } = require('openai');
const fetch = require('node-fetch');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

console.log(`${colors.bright}${colors.blue}=== API Connection Test ====${colors.reset}\n`);

// Test OpenAI API
async function testOpenAI() {
  console.log(`${colors.cyan}Testing OpenAI API connection...${colors.reset}`);
  
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  
  if (!OPENAI_API_KEY) {
    console.log(`${colors.red}❌ OPENAI_API_KEY is not set in .env file${colors.reset}`);
    return false;
  }
  
  try {
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY
    });
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Say 'OpenAI connection successful' in 10 words or less." }
      ],
      max_tokens: 20
    });
    
    console.log(`${colors.green}✅ OpenAI API connection successful${colors.reset}`);
    console.log(`${colors.dim}Response: "${response.choices[0].message.content}"${colors.reset}`);
    console.log(`${colors.dim}Model: ${response.model}${colors.reset}`);
    return true;
  } catch (error) {
    console.log(`${colors.red}❌ OpenAI API connection failed: ${error.message}${colors.reset}`);
    if (error.response) {
      console.log(`${colors.dim}Status: ${error.response.status}${colors.reset}`);
      console.log(`${colors.dim}Data: ${JSON.stringify(error.response.data)}${colors.reset}`);
    }
    return false;
  }
}

// Test Anthropic API
async function testAnthropic() {
  console.log(`\n${colors.cyan}Testing Anthropic API connection...${colors.reset}`);
  
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  
  if (!ANTHROPIC_API_KEY) {
    console.log(`${colors.red}❌ ANTHROPIC_API_KEY is not set in .env file${colors.reset}`);
    return false;
  }
  
  if (ANTHROPIC_API_KEY.trim() === '') {
    console.log(`${colors.red}❌ ANTHROPIC_API_KEY is empty in .env file${colors.reset}`);
    return false;
  }
  
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-sonnet-20240229",
        messages: [
          {
            role: "user",
            content: "Say 'Claude connection successful' in 10 words or less."
          }
        ],
        max_tokens: 20
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    
    console.log(`${colors.green}✅ Anthropic API connection successful${colors.reset}`);
    console.log(`${colors.dim}Response: "${data.content[0].text}"${colors.reset}`);
    console.log(`${colors.dim}Model: ${data.model}${colors.reset}`);
    return true;
  } catch (error) {
    console.log(`${colors.red}❌ Anthropic API connection failed: ${error.message}${colors.reset}`);
    return false;
  }
}

// Run tests
async function runTests() {
  const openaiSuccess = await testOpenAI();
  const anthropicSuccess = await testAnthropic();
  
  console.log(`\n${colors.bright}${colors.blue}=== Test Results ====${colors.reset}`);
  console.log(`OpenAI API: ${openaiSuccess ? colors.green + '✅ Connected' : colors.red + '❌ Failed'}${colors.reset}`);
  console.log(`Anthropic API: ${anthropicSuccess ? colors.green + '✅ Connected' : colors.red + '❌ Failed'}${colors.reset}`);
  
  if (!anthropicSuccess) {
    console.log(`\n${colors.yellow}To set up Anthropic API:${colors.reset}`);
    console.log(`1. Get an API key from https://console.anthropic.com/`);
    console.log(`2. Add it to your .env file as ANTHROPIC_API_KEY=your-key-here`);
    console.log(`3. See ANTHROPIC_SETUP.md for detailed instructions`);
  }
  
  if (!openaiSuccess) {
    console.log(`\n${colors.yellow}To set up OpenAI API:${colors.reset}`);
    console.log(`1. Get an API key from https://platform.openai.com/api-keys`);
    console.log(`2. Add it to your .env file as OPENAI_API_KEY=your-key-here`);
  }
}

runTests().catch(error => {
  console.error(`${colors.red}Unhandled error: ${error.message}${colors.reset}`);
  process.exit(1);
});
