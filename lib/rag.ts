import { DocItem, searchDocs } from './documentation';
import { generateIndicatorTemplate, IndicatorParams } from './indicator-templates';

// Mock implementation of RAG system for demonstration purposes
// In a real implementation, this would use ChromaDB or another vector database

/**
 * Initialize the RAG system
 */
export async function initializeRagSystem() {
  try {
    console.log('Initializing mock RAG system');
    return { success: true, message: 'Mock RAG system initialized successfully' };
  } catch (error) {
    console.error('Error initializing RAG system:', error);
    return { success: false, message: `Error initializing RAG system: ${error}` };
  }
}

// Interface for RAG response with action
interface RagResponse {
  success: boolean;
  answer: string;
  sources: any[];
  message?: string;
  action?: {
    type: string; // "replace" | "modify" | "clear" | "none"
    code?: string;
    template?: string;
    params?: Record<string, any>;
  };
}

/**
 * Query the RAG system with a user question
 */
export async function queryRagSystem(question: string): Promise<RagResponse> {
  try {
    // Use the existing search function to find relevant documents
    const searchResults = await searchDocs(question);
    
    // Get the top 3 most relevant results
    const relevantDocs = searchResults.slice(0, 3);
    
    // Generate a mock AI response based on the relevant documents
    const response = generateMockResponse(question, relevantDocs);
    
    // Format sources for the response
    const sources = relevantDocs.map(doc => ({
      id: doc.id,
      title: doc.title,
      category: doc.category,
      url: `/documentation/${doc.category}/${doc.id}`,
    }));
    
    return {
      success: true,
      answer: response.answer,
      sources: sources,
      action: response.action
    };
  } catch (error) {
    console.error('Error querying RAG system:', error);
    return { 
      success: false, 
      message: `Error querying RAG system: ${error}`,
      answer: "I'm sorry, I encountered an error while trying to answer your question. Please try again later.",
      sources: [],
    };
  }
}

/**
 * Generate a mock response based on the question and relevant documents
 */
function generateMockResponse(question: string, relevantDocs: DocItem[]): RagResponse {
  // Default response with no action
  const defaultResponse: RagResponse = {
    success: true,
    answer: "",
    sources: [],
    action: { type: "none" }
  };
  
  if (relevantDocs.length === 0) {
    defaultResponse.answer = "I couldn't find specific information about that in the WL8 documentation. Could you try rephrasing your question or asking about a different topic? I'm an expert in building WL8 indicators and can help you implement various technical analysis strategies.";
    return defaultResponse;
  }
  
  // Extract content from the most relevant document
  const mainDoc = relevantDocs[0];
  
  // Detect intent from the question
  const isCodeDeletionRequest = question.toLowerCase().includes("delete") || 
                               question.toLowerCase().includes("clear") || 
                               question.toLowerCase().includes("reset") ||
                               question.toLowerCase().includes("remove") ||
                               question.toLowerCase().includes("empty") ||
                               question.toLowerCase().includes("erase");
  
  const isIndicatorBuildRequest = question.toLowerCase().includes("build") || 
                                 question.toLowerCase().includes("create") || 
                                 question.toLowerCase().includes("implement") || 
                                 question.toLowerCase().includes("develop") ||
                                 question.toLowerCase().includes("code") ||
                                 question.toLowerCase().includes("indicator") ||
                                 question.toLowerCase().includes("strategy") ||
                                 question.toLowerCase().includes("trading") ||
                                 question.toLowerCase().includes("technical") ||
                                 question.toLowerCase().includes("analysis");
  
  // Detect conversation requests
  const isConversationRequest = question.toLowerCase().includes("conversation") ||
                               question.toLowerCase().includes("talk") ||
                               question.toLowerCase().includes("chat") ||
                               question.toLowerCase().includes("discuss") ||
                               question.toLowerCase().includes("help me") ||
                               question.toLowerCase().includes("can you help") ||
                               question.toLowerCase().includes("can we") ||
                               question.toLowerCase().includes("let's");
  
  // Detect specific indicator types
  const isSMACrossoverRequest = question.toLowerCase().includes("sma crossover") || 
                               question.toLowerCase().includes("moving average crossover") ||
                               question.toLowerCase().includes("simple moving average crossover");
  
  const isRSIRequest = question.toLowerCase().includes("rsi") || 
                      question.toLowerCase().includes("relative strength index");
  
  const isMACDRequest = question.toLowerCase().includes("macd") || 
                       question.toLowerCase().includes("moving average convergence divergence");
  
  const isBollingerRequest = question.toLowerCase().includes("bollinger") || 
                            question.toLowerCase().includes("bollinger bands");
  
  // Extract parameters from the question
  const params: IndicatorParams = {};
  
  // Extract periods
  const periodMatch = question.match(/period (\d+)/i) || question.match(/(\d+) period/i);
  if (periodMatch) {
    params.period = parseInt(periodMatch[1]);
  }
  
  // Extract SMA periods
  const smaPeriodMatch = question.match(/sma (\d+)/i) || question.match(/period (\d+)/i);
  if (smaPeriodMatch) {
    params.fast = parseInt(smaPeriodMatch[1]);
    params.slow = params.fast * 2; // Default slow period to double the fast period
  }
  
  // Extract fast/slow periods
  const fastSlowMatch = question.match(/(\d+)[^\d]+(\d+)/);
  if (fastSlowMatch) {
    params.fast = parseInt(fastSlowMatch[1]);
    params.slow = parseInt(fastSlowMatch[2]);
  }
  
  // Create a response that references the documentation
  let response = "";
  let action: any = { type: "none" };
  
  // Handle code deletion + indicator creation
  if (isCodeDeletionRequest && isIndicatorBuildRequest) {
    let indicatorType = "custom";
    let indicatorName = "indicator";
    
    if (isSMACrossoverRequest) {
      indicatorType = "sma";
      indicatorName = "SMA crossover";
    } else if (isRSIRequest) {
      indicatorType = "rsi";
      indicatorName = "RSI";
    } else if (isMACDRequest) {
      indicatorType = "macd";
      indicatorName = "MACD";
    } else if (isBollingerRequest) {
      indicatorType = "bollinger";
      indicatorName = "Bollinger Bands";
    }
    
    const code = generateIndicatorTemplate(indicatorType, params);
    
    response = `I'll clear the editor and create a ${indicatorName} indicator for you. `;
    
    if (indicatorType === "sma") {
      const fastPeriod = params.fast || 10;
      const slowPeriod = params.slow || 20;
      response += `This indicator compares a fast ${fastPeriod}-period SMA with a slower ${slowPeriod}-period SMA.`;
    } else if (indicatorType === "rsi") {
      const period = params.period || 14;
      response += `This RSI indicator uses a ${period}-period lookback window.`;
    } else if (indicatorType === "macd") {
      const fastPeriod = params.fast || 12;
      const slowPeriod = params.slow || 26;
      const signalPeriod = params.signal || 9;
      response += `This MACD indicator uses ${fastPeriod}/${slowPeriod}/${signalPeriod} periods.`;
    } else if (indicatorType === "bollinger") {
      const period = params.period || 20;
      const stdDev = params.stdDev || 2;
      response += `This Bollinger Bands indicator uses a ${period}-period SMA with ${stdDev} standard deviations.`;
    }
    
    response += `\n\nHere's the implementation:\n\n\`\`\`csharp\n${code}\n\`\`\`\n\n`;
    response += `I've cleared the editor and applied this code for you. You can now customize it further if needed.`;
    
    action = {
      type: "replace",
      code: code,
      template: indicatorType,
      params: params
    };
  } 
  // Handle just code deletion
  else if (isCodeDeletionRequest) {
    response = "I'll clear the editor for you. Let me know what kind of indicator you'd like to create next.";
    action = {
      type: "clear"
    };
  }
  // Handle just indicator creation
  else if (isIndicatorBuildRequest) {
    let indicatorType = "custom";
    let indicatorName = "indicator";
    
    if (isSMACrossoverRequest) {
      indicatorType = "sma";
      indicatorName = "SMA crossover";
    } else if (isRSIRequest) {
      indicatorType = "rsi";
      indicatorName = "RSI";
    } else if (isMACDRequest) {
      indicatorType = "macd";
      indicatorName = "MACD";
    } else if (isBollingerRequest) {
      indicatorType = "bollinger";
      indicatorName = "Bollinger Bands";
    }
    
    // Extract code blocks from the content
    const codeBlockMatch = mainDoc.content.match(/```(\w*)\n([\s\S]*?)```/);
    let code = "";
    
    if (codeBlockMatch) {
      const [_, language, extractedCode] = codeBlockMatch;
      code = extractedCode;
    } else {
      code = generateIndicatorTemplate(indicatorType, params);
    }
    
    response = `As a WL8 indicator development expert, I can help you build a ${indicatorName} indicator. `;
    
    if (indicatorType === "sma") {
      const fastPeriod = params.fast || 10;
      const slowPeriod = params.slow || 20;
      response += `This indicator compares a fast ${fastPeriod}-period SMA with a slower ${slowPeriod}-period SMA.`;
    } else if (indicatorType === "rsi") {
      const period = params.period || 14;
      response += `This RSI indicator uses a ${period}-period lookback window.`;
    } else if (indicatorType === "macd") {
      const fastPeriod = params.fast || 12;
      const slowPeriod = params.slow || 26;
      const signalPeriod = params.signal || 9;
      response += `This MACD indicator uses ${fastPeriod}/${slowPeriod}/${signalPeriod} periods.`;
    } else if (indicatorType === "bollinger") {
      const period = params.period || 20;
      const stdDev = params.stdDev || 2;
      response += `This Bollinger Bands indicator uses a ${period}-period SMA with ${stdDev} standard deviations.`;
    }
    
    response += `\n\nHere's the implementation:\n\n\`\`\`csharp\n${code}\n\`\`\`\n\n`;
    response += `You can apply this code to the editor by clicking the "Apply Code to Editor" button below.`;
    
    action = {
      type: "replace",
      code: code,
      template: indicatorType,
      params: params
    };
  }
  // Handle conversation requests
  else if (isConversationRequest) {
    response = `I'd be happy to have a conversation about WL8 indicator development! As a WL8 indicator development expert, I can help you with:\n\n`;
    response += `- Creating custom indicators for technical analysis\n`;
    response += `- Implementing trading strategies\n`;
    response += `- Understanding the WL8 API and framework\n`;
    response += `- Optimizing your indicators for better performance\n\n`;
    
    response += `What specific aspect of indicator development would you like to discuss? For example, I can help you create indicators like:\n\n`;
    response += `- Moving Average Crossovers\n`;
    response += `- RSI (Relative Strength Index)\n`;
    response += `- MACD (Moving Average Convergence Divergence)\n`;
    response += `- Bollinger Bands\n`;
    response += `- Custom indicators based on your trading ideas\n\n`;
    
    response += `Just let me know what you're interested in, and I'll provide guidance and code examples.`;
  }
  // Handle regular documentation queries
  else {
    response = `Based on the WL8 documentation, I can provide the following information about "${question}":\n\n`;
    response += `${mainDoc.content.substring(0, 300)}...\n\n`;
    
    // Extract code blocks from the content
    const codeBlockMatch = mainDoc.content.match(/```(\w*)\n([\s\S]*?)```/);
    if (codeBlockMatch) {
      const [_, language, code] = codeBlockMatch;
      response += `Here's a relevant code example:\n\n\`\`\`${language || 'csharp'}\n${code}\n\`\`\`\n\n`;
    }
    
    response += `This information comes from the "${mainDoc.title}" section of the documentation. You can find more details in the full documentation.\n\n`;
    
    // Add references to other relevant documents
    if (relevantDocs.length > 1) {
      response += `You might also want to check out "${relevantDocs[1].title}" for related information.`;
    }
  }
  
  // Add best practices for indicator development if it's a build request
  if (isIndicatorBuildRequest) {
    response += `\n\nWhen developing WL8 indicators, remember these best practices:\n`;
    response += `- Use descriptive parameter names and provide default values\n`;
    response += `- Add proper documentation comments to explain your indicator's purpose\n`;
    response += `- Implement proper error handling for edge cases\n`;
    response += `- Optimize calculations for performance when possible\n`;
    response += `- Test your indicator with different symbols and timeframes\n`;
  }
  
  return {
    success: true,
    answer: response,
    sources: [],
    action: action
  };
}

/**
 * Get suggestions for related documentation based on a query
 */
export async function getSuggestedDocumentation(query: string) {
  try {
    // Use the existing search function to find relevant documents
    const searchResults = await searchDocs(query);
    
    // Format the top 5 results as suggestions
    const suggestions = searchResults.slice(0, 5).map((doc, i) => ({
      id: doc.id,
      title: doc.title,
      category: doc.category,
      url: `/documentation/${doc.category}/${doc.id}`,
      score: 1 - (i * 0.1), // Mock relevance score
    }));
    
    return { success: true, suggestions };
  } catch (error) {
    console.error('Error getting suggested documentation:', error);
    return { success: false, message: `Error getting suggested documentation: ${error}`, suggestions: [] };
  }
}
