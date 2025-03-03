import { Message, SuggestedIndicator, generateAnthropicResponse } from './anthropic-client';
import { generateOpenAIResponse } from './openai-client';

// Provider types
export type AIProvider = 'openai' | 'anthropic' | 'auto';

// Response interface
export interface AIResponse {
  answer: string;
  suggestedIndicators?: SuggestedIndicator[];
  sources?: any[];
  action?: {
    type: string;
    code?: string;
    template?: string;
    params?: Record<string, any>;
  };
  model: string;
  provider: AIProvider;
}

/**
 * Detect the intent of a query to determine the best model to use
 */
function detectQueryIntent(query: string): {
  isCodeRequest: boolean;
  isVagueRequest: boolean;
  isConceptualRequest: boolean;
  isConversationRequest: boolean;
} {
  const lowerQuery = query.toLowerCase();
  
  // Detect code-related requests
  const isCodeRequest = lowerQuery.includes("code") || 
                        lowerQuery.includes("editor") || 
                        lowerQuery.includes("implement") ||
                        lowerQuery.includes("write") ||
                        lowerQuery.includes("create a function") ||
                        lowerQuery.includes("programming");
  
  // Detect vague indicator requests
  const isVagueRequest = lowerQuery.includes("build an indicator") || 
                         lowerQuery.includes("create indicator") ||
                         lowerQuery.includes("what indicator") ||
                         lowerQuery.includes("suggest an indicator") ||
                         lowerQuery.includes("recommend an indicator");
  
  // Detect conceptual/educational requests
  const isConceptualRequest = lowerQuery.includes("explain") ||
                             lowerQuery.includes("what is") ||
                             lowerQuery.includes("how does") ||
                             lowerQuery.includes("concept") ||
                             lowerQuery.includes("theory") ||
                             lowerQuery.includes("understand");
  
  // Detect conversation requests
  const isConversationRequest = lowerQuery.includes("conversation") ||
                               lowerQuery.includes("talk") ||
                               lowerQuery.includes("chat") ||
                               lowerQuery.includes("discuss") ||
                               lowerQuery.includes("help me") ||
                               lowerQuery.includes("can you help") ||
                               lowerQuery.includes("can we") ||
                               lowerQuery.includes("let's");
  
  return {
    isCodeRequest,
    isVagueRequest,
    isConceptualRequest,
    isConversationRequest
  };
}

/**
 * Select the best model and provider based on the query intent
 */
function selectModelAndProvider(
  query: string, 
  preferredProvider: AIProvider = 'auto'
): { model: string; provider: AIProvider } {
  // If user has a preferred provider, use it unless it's 'auto'
  if (preferredProvider !== 'auto') {
    // For specific provider preferences, select the appropriate model
    if (preferredProvider === 'openai') {
      return { model: 'gpt-4o', provider: 'openai' };
    } else if (preferredProvider === 'anthropic') {
      return { model: 'claude-3-sonnet-20240229', provider: 'anthropic' };
    }
  }
  
  // Auto-select based on query intent
  const intent = detectQueryIntent(query);
  
  if (intent.isCodeRequest) {
    // Code generation is best with Claude 3.5 Sonnet
    return { model: 'claude-3-5-sonnet-20240620', provider: 'anthropic' };
  } else if (intent.isVagueRequest) {
    // Vague requests about indicators are good with Claude's reasoning
    return { model: 'claude-3-opus-20240229', provider: 'anthropic' };
  } else if (intent.isConceptualRequest) {
    // Conceptual explanations are good with Claude
    return { model: 'claude-3-sonnet-20240229', provider: 'anthropic' };
  } else if (intent.isConversationRequest) {
    // General conversation is good with Claude
    return { model: 'claude-3-sonnet-20240229', provider: 'anthropic' };
  }
  
  // Default to OpenAI's gpt-4o for general queries
  return { model: 'gpt-4o', provider: 'openai' };
}

/**
 * Generate a response using the appropriate AI model
 */
export async function generateAIResponse(
  query: string,
  chatHistory: Message[] = [],
  preferredProvider: AIProvider = 'auto'
): Promise<AIResponse> {
  try {
    // Select the appropriate model and provider
    const { model, provider } = selectModelAndProvider(query, preferredProvider);
    console.log(`🧠 Selected model: ${provider}/${model} based on query intent`);
    
    // Generate response using the selected provider
    if (provider === 'anthropic') {
      try {
        const response = await generateAnthropicResponse(query, chatHistory, model);
        return {
          ...response,
          sources: [],
          action: { type: "none" },
          provider: 'anthropic'
        };
      } catch (error) {
        console.error('❌ Error with Anthropic API, falling back to OpenAI:', error);
        // Fall back to OpenAI
        const fallbackResponse = await generateOpenAIResponse(query, chatHistory, 'gpt-4o');
        return {
          ...fallbackResponse,
          sources: [],
          action: { type: "none" },
          provider: 'openai'
        };
      }
    } else {
      try {
        const response = await generateOpenAIResponse(query, chatHistory, model);
        return {
          ...response,
          sources: [],
          action: { type: "none" },
          provider: 'openai'
        };
      } catch (error) {
        console.error('❌ Error with OpenAI API, falling back to Anthropic:', error);
        // Fall back to Anthropic
        const fallbackResponse = await generateAnthropicResponse(query, chatHistory, 'claude-3-sonnet-20240229');
        return {
          ...fallbackResponse,
          sources: [],
          action: { type: "none" },
          provider: 'anthropic'
        };
      }
    }
  } catch (error) {
    console.error('❌ Error generating AI response:', error);
    throw error;
  }
}

/**
 * Process a query with RAG (Retrieval Augmented Generation)
 * This combines the AI response with relevant documents from the knowledge base
 */
export async function processRagQuery(
  query: string,
  chatHistory: Message[] = [],
  preferredProvider: AIProvider = 'auto'
): Promise<AIResponse> {
  try {
    // Generate AI response
    const aiResponse = await generateAIResponse(query, chatHistory, preferredProvider);
    
    // TODO: In a future enhancement, we could integrate this with the Supabase RAG system
    // to retrieve relevant documents and enhance the response
    
    return aiResponse;
  } catch (error) {
    console.error('❌ Error processing RAG query:', error);
    throw error;
  }
}
