// Interface for chat messages
export interface Message {
  role: "user" | "assistant";
  content: string;
}

// Interface for Anthropic API response
interface AnthropicResponse {
  id: string;
  type: string;
  role: string;
  content: Array<{
    type: string;
    text: string;
  }>;
  model: string;
  stop_reason: string;
  stop_sequence: string | null;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

// Interface for suggested indicators
export interface SuggestedIndicator {
  name: string;
  type: string;
  description: string;
}

/**
 * Generate a response using Anthropic's Claude API
 */
export async function generateAnthropicResponse(
  query: string,
  chatHistory: Message[] = [],
  model: string = "claude-3-sonnet-20240229"
): Promise<{
  answer: string;
  suggestedIndicators?: SuggestedIndicator[];
  model: string;
}> {
  try {
    // Check if API key is available
    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
    if (!ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY environment variable is not set');
    }

    // Convert chat history to Anthropic format
    const messages = chatHistory.map(msg => ({
      role: msg.role === "assistant" ? "assistant" : "user",
      content: msg.content
    }));

    // Add the current query
    messages.push({
      role: "user",
      content: query
    });

    // System prompt to guide Claude's responses
    const systemPrompt = `You are a WL8 (Wealth-Lab 8) indicator development expert. 
You help users understand and build trading indicators for Wealth-Lab 8, a C# trading platform.

When users ask about indicators:
1. Explain the indicator concept clearly
2. Provide C# code examples when appropriate
3. If the user wants to build an indicator, help them understand the parameters and implementation details

DO NOT suggest related indicators or mention other indicators that might be useful. Focus only on the specific indicator the user is asking about.

Always use markdown formatting for code blocks with the appropriate language tag:
\`\`\`csharp
// C# code here
\`\`\``;

    // Call Anthropic API
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        system: systemPrompt,
        max_tokens: 1024,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Anthropic API error: ${response.status} - ${errorText}`);
    }

    const data: AnthropicResponse = await response.json();
    
    // Extract the response text
    const responseText = data.content[0].text;
    
    // Extract suggested indicators from the response
    const suggestedIndicators = extractSuggestedIndicatorsFromText(responseText);

    return {
      answer: responseText,
      suggestedIndicators: suggestedIndicators.length > 0 ? suggestedIndicators : undefined,
      model: data.model
    };
  } catch (error) {
    console.error("Error calling Anthropic API:", error);
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
