import { SuggestedIndicator } from './anthropic-client';
import { Message as AnthropicMessage } from './anthropic-client';
import OpenAI from 'openai';

// OpenAI message type that includes system role
interface OpenAIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

/**
 * Generate a response using OpenAI API
 */
export async function generateOpenAIResponse(
  query: string,
  chatHistory: AnthropicMessage[] = [],
  model: string = "gpt-4o"
): Promise<{
  answer: string;
  suggestedIndicators?: SuggestedIndicator[];
  model: string;
}> {
  try {
    // Check if API key is available
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });

    // Convert chat history to OpenAI format
    const messages: OpenAIMessage[] = chatHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // System prompt to guide the model's responses
    messages.unshift({
      role: "system",
      content: `You are a WL8 (Wealth-Lab 8) indicator development expert. 
You help users understand and build trading indicators for Wealth-Lab 8, a C# trading platform.

When users ask about indicators:
1. Explain the indicator concept clearly
2. Provide C# code examples when appropriate
3. If the user wants to build an indicator, help them understand the parameters and implementation details

DO NOT suggest related indicators or mention other indicators that might be useful. Focus only on the specific indicator the user is asking about.

Always use markdown formatting for code blocks with the appropriate language tag:
\`\`\`csharp
// C# code here
\`\`\``
    });

    // Add the current query
    messages.push({
      role: "user",
      content: query
    });

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: model,
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 1024,
    });

    // Extract the response text
    const responseText = response.choices[0].message.content || "";
    
    // Extract suggested indicators from the response
    const suggestedIndicators = extractSuggestedIndicatorsFromText(responseText);

    return {
      answer: responseText,
      suggestedIndicators: suggestedIndicators.length > 0 ? suggestedIndicators : undefined,
      model: response.model
    };
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw error;
  }
}

/**
 * Extract suggested indicators from text
 */
function extractSuggestedIndicatorsFromText(text: string): SuggestedIndicator[] {
  // Common indicators to look for
  const commonIndicators: SuggestedIndicator[] = [
    {name: "SMA Crossover", type: "trend", description: "Simple Moving Average crossover strategy"},
    {name: "RSI", type: "momentum", description: "Relative Strength Index for overbought/oversold conditions"},
    {name: "MACD", type: "trend", description: "Moving Average Convergence Divergence for trend strength"},
    {name: "Bollinger Bands", type: "volatility", description: "Measures price volatility with standard deviation"},
    {name: "Stochastic", type: "momentum", description: "Compares closing price to price range over time"},
    {name: "ATR", type: "volatility", description: "Average True Range measures volatility"},
    {name: "OBV", type: "volume", description: "On-Balance Volume tracks buying/selling pressure"},
    {name: "Ichimoku Cloud", type: "trend", description: "Multiple component indicator for trend direction and support/resistance"},
    {name: "Parabolic SAR", type: "trend", description: "Stop and Reverse indicator for trend following"},
    {name: "ADX", type: "trend", description: "Average Directional Index measures trend strength"}
  ];
  
  // Look for indicators mentioned in the text
  const mentionedIndicators = commonIndicators.filter(indicator => 
    text.toLowerCase().includes(indicator.name.toLowerCase())
  );
  
  // Also try to extract indicators mentioned in brackets like [RSI (Relative Strength Index)]
  const bracketPattern = /\[(.*?)\]/g;
  let match;
  const extractedIndicators: SuggestedIndicator[] = [];
  
  while ((match = bracketPattern.exec(text)) !== null) {
    const indicatorText = match[1];
    // Check if this is already in our list
    const existingIndicator = mentionedIndicators.find(ind => 
      indicatorText.toLowerCase().includes(ind.name.toLowerCase())
    );
    
    if (!existingIndicator) {
      // Try to determine the type based on keywords
      let type = "custom";
      if (indicatorText.toLowerCase().includes("moving average") || 
          indicatorText.toLowerCase().includes("trend") ||
          indicatorText.toLowerCase().includes("direction")) {
        type = "trend";
      } else if (indicatorText.toLowerCase().includes("momentum") || 
                indicatorText.toLowerCase().includes("strength") ||
                indicatorText.toLowerCase().includes("overbought")) {
        type = "momentum";
      } else if (indicatorText.toLowerCase().includes("volatility") || 
                indicatorText.toLowerCase().includes("band") ||
                indicatorText.toLowerCase().includes("deviation")) {
        type = "volatility";
      } else if (indicatorText.toLowerCase().includes("volume")) {
        type = "volume";
      }
      
      // Extract the short name (before any parentheses)
      const nameMatch = indicatorText.match(/(.*?)(\s*\(|$)/);
      const name = nameMatch ? nameMatch[1].trim() : indicatorText;
      
      // Extract description (anything in parentheses)
      const descMatch = indicatorText.match(/\((.*?)\)/);
      const description = descMatch ? descMatch[1].trim() : "";
      
      extractedIndicators.push({
        name,
        type,
        description: description || `${name} indicator for technical analysis`
      });
    }
  }
  
  // Combine both lists and remove duplicates
  const allIndicators = [...mentionedIndicators, ...extractedIndicators];
  const uniqueIndicators: SuggestedIndicator[] = [];
  
  allIndicators.forEach(indicator => {
    if (!uniqueIndicators.some(ui => ui.name.toLowerCase() === indicator.name.toLowerCase())) {
      uniqueIndicators.push(indicator);
    }
  });
  
  return uniqueIndicators;
}
