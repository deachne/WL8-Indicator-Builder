import { supabase } from './supabase-client';
import { DocCategory, DocItem, getDocCategories } from './documentation';
import { rerank } from './reranker';
import { OpenAIEmbeddings } from '@langchain/openai';
import { generateIndicatorTemplate, IndicatorParams } from './indicator-templates';

// Types for our Supabase RAG system
interface Document {
  id: string;
  title: string;
  category: string;
  content: string;
  type: string;
  url: string;
  language?: string;
  context?: string;
  score?: number;
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

interface CodeBlock {
  language: string;
  content: string;
  context: string;
}

// Configuration
const COLLECTION_NAME = "wl8_documentation";

// OpenAI embeddings client
let embeddings: OpenAIEmbeddings | null = null;

/**
 * Initialize the Supabase RAG system
 */
export async function initializeSupabaseRagSystem() {
  try {
    console.log('Initializing Supabase RAG system');
    
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }
    
    // Initialize OpenAI embeddings
    embeddings = new OpenAIEmbeddings({
      openAIApiKey: OPENAI_API_KEY,
      modelName: "text-embedding-3-small", // Using the latest embedding model
    });
    
    // Check if Supabase is properly configured
    const { data, error } = await supabase.from('documentation').select('id').limit(1);
    
    if (error) {
      console.log('Supabase table not found or connection error, attempting to create schema');
      
      // Create the table and function if they don't exist
      // Note: This would typically be done via migrations, but we're doing it here for simplicity
      const { error: createError } = await supabase.rpc('create_vector_schema');
      
      if (createError) {
        console.error('Error creating Supabase schema:', createError);
        throw new Error(`Failed to create Supabase schema: ${createError.message}`);
      }
      
      console.log('Supabase schema created successfully');
      
      // Check if we need to import documents
      const { count, error: countError } = await supabase
        .from('documentation')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        throw new Error(`Error checking document count: ${countError.message}`);
      }
      
      if (count === 0) {
        console.log('No documents found in Supabase, importing from documentation');
        await importDocumentsToSupabase();
      }
    } else {
      console.log('Supabase connection successful');
      
      // Check document count
      const { count, error: countError } = await supabase
        .from('documentation')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        throw new Error(`Error checking document count: ${countError.message}`);
      }
      
      console.log(`Found ${count} documents in Supabase`);
    }
    
    return { 
      success: true, 
      message: 'Supabase RAG system initialized successfully',
      documentCount: await getDocumentCount()
    };
  } catch (error) {
    console.error('Error initializing Supabase RAG system:', error);
    return { 
      success: false, 
      message: `Error initializing Supabase RAG system: ${error}`,
      error
    };
  }
}

/**
 * Get the count of documents in the Supabase collection
 */
async function getDocumentCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('documentation')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      throw error;
    }
    
    return count || 0;
  } catch (error) {
    console.error('Error getting document count:', error);
    return 0;
  }
}

/**
 * Import documents to Supabase
 */
export async function importDocumentsToSupabase() {
  try {
    console.log('Importing documents to Supabase...');
    
    if (!embeddings) {
      const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
      if (!OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY environment variable is not set');
      }
      
      embeddings = new OpenAIEmbeddings({
        openAIApiKey: OPENAI_API_KEY,
        modelName: "text-embedding-3-small",
      });
    }
    
    // Get documentation from the current implementation
    const docCategories = getDocCategories();
    
    // Process documents with code-aware chunking
    const processedDocuments = await processDocumentation(docCategories);
    
    console.log(`Processed ${processedDocuments.length} documents for import`);
    
    // Process documents in batches to avoid memory issues
    const batchSize = 50;
    const batches = [];
    for (let i = 0; i < processedDocuments.length; i += batchSize) {
      batches.push(processedDocuments.slice(i, i + batchSize));
    }
    
    console.log(`Processing ${batches.length} batches of documents (batch size: ${batchSize})`);
    
    // Add documents to Supabase in batches
    let totalAdded = 0;
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`Adding batch ${i + 1}/${batches.length} (${batch.length} documents)...`);
      
      // Process each document in the batch
      for (const doc of batch) {
        // Generate embedding for the document
        const embedding = await embeddings.embedQuery(doc.content);
        
        // Store in Supabase
        const { error } = await supabase.from('documentation').insert({
          content: doc.content,
          embedding,
          metadata: {
            id: doc.id,
            title: doc.title,
            category: doc.category,
            type: doc.type,
            url: doc.url,
            language: doc.language,
            context: doc.context
          }
        });
        
        if (error) {
          console.error('Error inserting document:', error);
          continue;
        }
        
        totalAdded++;
      }
      
      console.log(`Progress: ${Math.round((totalAdded / processedDocuments.length) * 100)}% (${totalAdded}/${processedDocuments.length})`);
    }
    
    console.log(`Successfully imported ${totalAdded} documents to Supabase`);
    
    return {
      success: true,
      message: `Successfully imported ${totalAdded} documents to Supabase`,
      count: totalAdded
    };
  } catch (error) {
    console.error('Error importing documents to Supabase:', error);
    return {
      success: false,
      message: `Error importing documents to Supabase: ${error}`,
      error
    };
  }
}

/**
 * Process documentation into chunks with code-aware splitting
 */
async function processDocumentation(docCategories: DocCategory[]): Promise<Document[]> {
  const documents: Document[] = [];
  
  // Process each document category
  for (const category of docCategories) {
    for (const item of category.items) {
      // Process the document with code-aware chunking
      const chunks = processDocumentWithCodeAwareness(item, category.id);
      documents.push(...chunks);
    }
  }
  
  return documents;
}

/**
 * Process a document with code-aware chunking
 */
function processDocumentWithCodeAwareness(
  docItem: DocItem, 
  categoryId: string
): Document[] {
  const documents: Document[] = [];
  
  // Extract code blocks and their context
  const { textChunks, codeBlocks } = extractCodeBlocksAndText(docItem.content);
  
  // Create document chunks from text (excluding code blocks)
  textChunks.forEach((chunk, index) => {
    // Skip empty chunks
    if (chunk.trim() === '') return;
    
    documents.push({
      id: `${docItem.id}-text-${index}`,
      title: docItem.title,
      category: categoryId,
      content: chunk,
      type: "text",
      url: `/documentation/${categoryId}/${docItem.id}`,
    });
  });
  
  // Add code blocks as separate documents with their context
  codeBlocks.forEach((codeBlock, index) => {
    documents.push({
      id: `${docItem.id}-code-${index}`,
      title: docItem.title,
      category: categoryId,
      content: codeBlock.content,
      type: "code",
      language: codeBlock.language,
      url: `/documentation/${categoryId}/${docItem.id}`,
      context: codeBlock.context,
    });
  });
  
  return documents;
}

/**
 * Extract code blocks and text from markdown content
 */
function extractCodeBlocksAndText(markdown: string): { 
  textChunks: string[]; 
  codeBlocks: CodeBlock[] 
} {
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
  const codeBlocks: CodeBlock[] = [];
  const textChunks: string[] = [];
  
  let lastIndex = 0;
  let match;
  
  // Extract code blocks and surrounding text
  while ((match = codeBlockRegex.exec(markdown)) !== null) {
    const [fullMatch, language, code] = match;
    const matchIndex = match.index;
    
    // Get text before this code block
    if (matchIndex > lastIndex) {
      const textBefore = markdown.substring(lastIndex, matchIndex);
      textChunks.push(textBefore);
    }
    
    // Get context (text before the code block, up to 500 chars)
    const contextStartIndex = Math.max(0, matchIndex - 500);
    const context = markdown.substring(contextStartIndex, matchIndex);
    
    // Add code block with its context
    codeBlocks.push({
      language: language || "text",
      content: code,
      context,
    });
    
    lastIndex = matchIndex + fullMatch.length;
  }
  
  // Add remaining text after the last code block
  if (lastIndex < markdown.length) {
    textChunks.push(markdown.substring(lastIndex));
  }
  
  return { textChunks, codeBlocks };
}

/**
 * Query the Supabase RAG system with a user question
 */
export async function querySupabaseRagSystem(question: string): Promise<RagResponse> {
  try {
    if (!embeddings) {
      const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
      if (!OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY environment variable is not set');
      }
      
      embeddings = new OpenAIEmbeddings({
        openAIApiKey: OPENAI_API_KEY,
        modelName: "text-embedding-3-small",
      });
    }
    
    // Generate embedding for the query
    const queryEmbedding = await embeddings.embedQuery(question);
    
    // Search for similar documents
    const { data: results, error } = await supabase.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: 0.5,
      match_count: 10 // Get more results for re-ranking
    });
    
    if (error) {
      throw new Error(`Error querying Supabase: ${error.message}`);
    }
    
    if (!results || results.length === 0) {
      return {
        success: true,
        answer: "I couldn't find specific information about that in the WL8 documentation. Could you try rephrasing your question or asking about a different topic?",
        sources: [],
      };
    }
    
    // Format results for re-ranking
    const formattedResults = results.map((result: any) => ({
      pageContent: result.content,
      metadata: result.metadata,
      score: result.similarity
    }));
    
    // Apply re-ranking to improve result quality
    const rerankedResults = rerank(question, formattedResults, {
      keywordWeight: 0.3,
      vectorWeight: 0.7,
      titleBoost: 1.5,
      codeBoost: 1.2
    });
    
    // Take the top 5 results after re-ranking
    const topResults = rerankedResults.slice(0, 5);
    
    // Extract relevant documents
    const relevantDocs = topResults.map(doc => ({
      id: doc.metadata.id as string,
      title: doc.metadata.title as string,
      category: doc.metadata.category as string,
      content: doc.pageContent,
      type: doc.metadata.type as string,
      url: doc.metadata.url as string,
      ...(doc.metadata.language ? { language: doc.metadata.language as string } : {}),
    }));
    
    // Generate a response based on the relevant documents
    const response = generateEnhancedResponse(question, relevantDocs);
    
    // Format sources for the response
    const sources = relevantDocs.map(doc => ({
      id: doc.id,
      title: doc.title,
      category: doc.category,
      url: doc.url,
      type: doc.type,
    }));
    
    return {
      success: true,
      answer: response.answer,
      sources,
      action: response.action
    };
  } catch (error) {
    console.error('Error querying Supabase RAG system:', error);
    return { 
      success: false, 
      message: `Error querying Supabase RAG system: ${error}`,
      answer: "I'm sorry, I encountered an error while trying to answer your question. Please try again later.",
      sources: [],
    };
  }
}

/**
 * Generate an enhanced response based on the question and relevant documents
 */
function generateEnhancedResponse(question: string, relevantDocs: any[]): RagResponse {
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
  
  // Separate code and text documents
  const textDocs = relevantDocs.filter(doc => doc.type === "text");
  const codeDocs = relevantDocs.filter(doc => doc.type === "code");
  
  // Extract content from the most relevant document
  const mainDoc = textDocs.length > 0 ? textDocs[0] : relevantDocs[0];
  
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
    
    const code = generateIndicatorTemplate(indicatorType, params);
    
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
    response += `${mainDoc.content.substring(0, 400)}...\n\n`;
    
    // Add code example if available
    if (codeDocs.length > 0) {
      const codeExample = codeDocs[0];
      response += `Here's a relevant code example:\n\n\`\`\`${codeExample.language || 'csharp'}\n${codeExample.content}\n\`\`\`\n\n`;
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
export async function getSupabaseSuggestedDocumentation(query: string) {
  try {
    if (!embeddings) {
      const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
      if (!OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY environment variable is not set');
      }
      
      embeddings = new OpenAIEmbeddings({
        openAIApiKey: OPENAI_API_KEY,
        modelName: "text-embedding-3-small",
      });
    }
    
    // Generate embedding for the query
    const queryEmbedding = await embeddings.embedQuery(query);
    
    // Search for similar documents
    const { data: results, error } = await supabase.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: 0.5,
      match_count: 5
    });
    
    if (error) {
      throw new Error(`Error querying Supabase: ${error.message}`);
    }
    
    if (!results || results.length === 0) {
      return { success: true, suggestions: [] };
    }
    
    // Format the results as suggestions
    const suggestions = results.map((result: any, i: number) => ({
      id: result.metadata.id as string,
      title: result.metadata.title as string,
      category: result.metadata.category as string,
      url: result.metadata.url as string,
      score: result.similarity,
      type: result.metadata.type as string,
    }));
    
    return { success: true, suggestions };
  } catch (error) {
    console.error('Error getting suggested documentation:', error);
    return { 
      success: false, 
      message: `Error getting suggested documentation: ${error}`, 
      suggestions: [] 
    };
  }
}
