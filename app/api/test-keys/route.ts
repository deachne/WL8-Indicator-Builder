import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { provider, key } = body;
    
    // Ensure key is properly formatted (trim whitespace)
    if (key) {
      key = key.trim();
    }
    
    if (!provider || !key) {
      return NextResponse.json(
        { success: false, message: 'Provider and key are required' },
        { status: 400 }
      );
    }
    
    // Test the API key based on the provider
    if (provider === 'openai') {
      return await testOpenAIKey(key);
    } else if (provider === 'anthropic') {
      return await testAnthropicKey(key);
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid provider. Must be "openai" or "anthropic"' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error testing API key:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

async function testOpenAIKey(key: string) {
  try {
    const openai = new OpenAI({
      apiKey: key,
    });
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Say "OpenAI connection successful" in 10 words or less.' }
      ],
      max_tokens: 20,
    });
    
    return NextResponse.json({
      success: true,
      message: `Connection successful: "${response.choices[0].message.content}"`,
      model: response.model,
    });
  } catch (error) {
    console.error('Error testing OpenAI key:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to connect to OpenAI API',
    });
  }
}

async function testAnthropicKey(key: string) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        messages: [
          {
            role: 'user',
            content: 'Say "Claude connection successful" in 10 words or less.',
          },
        ],
        max_tokens: 20,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      message: `Connection successful: "${data.content[0].text}"`,
      model: data.model,
    });
  } catch (error) {
    console.error('Error testing Anthropic key:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to connect to Anthropic API',
    });
  }
}
