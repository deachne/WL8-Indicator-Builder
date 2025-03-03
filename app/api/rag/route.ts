import { NextRequest, NextResponse } from 'next/server';
import { processRagQuery } from '@/lib/ai-client';
import { AIProvider } from '@/lib/ai-client';
import { Message } from '@/lib/anthropic-client';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  console.log('🔍 RAG API route called');
  
  // Store original API keys
  const originalOpenAIKey = process.env.OPENAI_API_KEY;
  const originalAnthropicKey = process.env.ANTHROPIC_API_KEY;
  
  try {
    // Log request headers for debugging
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });
    console.log('📝 Request headers:', headers);
    
    let body;
    try {
      body = await request.json();
      console.log('📥 Request body:', JSON.stringify(body, null, 2));
    } catch (parseError) {
      console.error('❌ Error parsing request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    const { query, chatHistory = [], preferredProvider = 'auto', openaiKey, anthropicKey } = body;
    
    if (!query || typeof query !== 'string') {
      console.error('❌ Invalid query parameter:', query);
      return NextResponse.json(
        { error: 'Query parameter is required and must be a string' },
        { status: 400 }
      );
    }
    
    // Check if at least one API key is provided
    if (!openaiKey && !anthropicKey) {
      console.error('❌ No API keys provided');
      return NextResponse.json(
        { error: 'At least one API key (OpenAI or Anthropic) is required' },
        { status: 400 }
      );
    }
    
    // Temporarily override environment variables with the provided API keys
    // Ensure keys are properly formatted (trim whitespace)
    
    if (openaiKey) {
      process.env.OPENAI_API_KEY = openaiKey.trim();
    }
    
    if (anthropicKey) {
      process.env.ANTHROPIC_API_KEY = anthropicKey.trim();
    }
    
    // Detect the type of request to determine the best model to use
    const userInput = query.toLowerCase();
    
    // Define task types
    const isCodeRequest = userInput.includes("code") || 
                         userInput.includes("editor") || 
                         userInput.includes("sma") ||
                         userInput.includes("implement") ||
                         userInput.includes("write") ||
                         userInput.includes("create a function");
                         
    const isConversation = userInput.includes("explain") || 
                          userInput.includes("how does") || 
                          userInput.includes("what is") ||
                          userInput.includes("tell me about") ||
                          userInput.includes("help me understand");
    
    // Choose the right model based on the request type
    const taskBasedProvider: AIProvider = isCodeRequest ? "openai" : (isConversation ? "anthropic" : "auto");
    
    // Use the user's preferred provider if specified, otherwise use the task-based provider
    const effectiveProvider = preferredProvider === 'auto' ? taskBasedProvider : preferredProvider;
    
    console.log(`🧠 Task detection: isCodeRequest=${isCodeRequest}, isConversation=${isConversation}`);
    console.log(`🧠 Selected provider: ${effectiveProvider} (user preference: ${preferredProvider})`);
    
    // Validate chat history if provided
    if (chatHistory && !Array.isArray(chatHistory)) {
      console.error('❌ Invalid chatHistory parameter:', chatHistory);
      return NextResponse.json(
        { error: 'chatHistory parameter must be an array' },
        { status: 400 }
      );
    }
    
    // Validate preferred provider if provided
    if (preferredProvider && !['auto', 'openai', 'anthropic'].includes(preferredProvider)) {
      console.error('❌ Invalid preferredProvider parameter:', preferredProvider);
      return NextResponse.json(
        { error: 'preferredProvider parameter must be "auto", "openai", or "anthropic"' },
        { status: 400 }
      );
    }
    
    // Process the query with our AI client
    console.log('🔄 Processing query with AI client');
    const result = await processRagQuery(
      query, 
      chatHistory as Message[], 
      effectiveProvider as AIProvider
    );
    
    console.log('📊 AI result:', {
      provider: result.provider,
      model: result.model,
      hasSuggestedIndicators: !!result.suggestedIndicators,
      suggestedIndicatorCount: result.suggestedIndicators?.length || 0,
      actionType: result.action?.type || 'none'
    });
    
    // Restore original environment variables
    if (originalOpenAIKey !== undefined) {
      process.env.OPENAI_API_KEY = originalOpenAIKey;
    }
    
    if (originalAnthropicKey !== undefined) {
      process.env.ANTHROPIC_API_KEY = originalAnthropicKey;
    }
    
    return NextResponse.json({
      answer: result.answer,
      sources: result.sources || [],
      suggestedIndicators: result.suggestedIndicators || [],
      action: result.action || { type: "none" },
      model: result.model,
      provider: result.provider
    });
  } catch (error) {
    console.error('❌ Unhandled error in RAG API route:', error);
    
    // Restore original environment variables in case of error
    if (originalOpenAIKey !== undefined) {
      process.env.OPENAI_API_KEY = originalOpenAIKey;
    }
    
    if (originalAnthropicKey !== undefined) {
      process.env.ANTHROPIC_API_KEY = originalAnthropicKey;
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
