import { DocCategory, DocItem, getDocCategories, searchDocs } from './documentation';

// Types for our enhanced RAG system
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

interface CodeBlock {
  language: string;
  content: string;
  context: string;
}

// In-memory storage for processed documents
let processedDocuments: Document[] = [];

/**
 * Initialize the enhanced RAG system
 */
export async function initializeEnhancedRagSystem() {
  try {
    console.log('Initializing enhanced RAG system');
    
    // Get documentation from the current implementation
    const docCategories = getDocCategories();
    
    // Process documents with code-aware chunking
    processedDocuments = await processDocumentation(docCategories);
    
    console.log(`Processed ${processedDocuments.length} documents for enhanced RAG system`);
    
    return { 
      success: true, 
      message: 'Enhanced RAG system initialized successfully',
      documentCount: processedDocuments.length
    };
  } catch (error) {
    console.error('Error initializing enhanced RAG system:', error);
    return { 
      success: false, 
      message: `Error initializing enhanced RAG system: ${error}`,
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
 * Query the enhanced RAG system with a user question
 */
export async function queryEnhancedRagSystem(question: string) {
  try {
    // Initialize if not already done
    if (processedDocuments.length === 0) {
      await initializeEnhancedRagSystem();
    }
    
    // Use the existing search function to find relevant documents
    const searchResults = searchDocs(question);
    
    // Get the top 5 most relevant results
    const relevantDocs = searchResults.slice(0, 5).map(doc => {
      // Extract code blocks from the document
      const { codeBlocks } = extractCodeBlocksAndText(doc.content);
      
      // Return the document with code blocks
      return {
        id: doc.id,
        title: doc.title,
        category: doc.category,
        content: doc.content,
        type: "text",
        url: `/documentation/${doc.category}/${doc.id}`,
        codeBlocks: codeBlocks.map((block, index) => ({
          id: `${doc.id}-code-${index}`,
          language: block.language,
          content: block.content,
          context: block.context,
        })),
      };
    });
    
    // Generate a response based on the relevant documents
    const answer = generateEnhancedResponse(question, relevantDocs);
    
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
      answer,
      sources,
    };
  } catch (error) {
    console.error('Error querying enhanced RAG system:', error);
    return { 
      success: false, 
      message: `Error querying enhanced RAG system: ${error}`,
      answer: "I'm sorry, I encountered an error while trying to answer your question. Please try again later.",
      sources: [],
    };
  }
}

/**
 * Generate an enhanced response based on the question and relevant documents
 */
function generateEnhancedResponse(question: string, relevantDocs: any[]): string {
  if (relevantDocs.length === 0) {
    return "I couldn't find specific information about that in the WL8 documentation. Could you try rephrasing your question or asking about a different topic?";
  }
  
  // Extract content from the most relevant document
  const mainDoc = relevantDocs[0];
  
  // Create a response that references the documentation
  let response = `Based on the WL8 documentation, I can provide the following information about "${question}":\n\n`;
  
  // Add content from the main document (truncated for readability)
  response += `${mainDoc.content.substring(0, 400)}...\n\n`;
  
  // Add code example if available
  if (mainDoc.codeBlocks && mainDoc.codeBlocks.length > 0) {
    const codeExample = mainDoc.codeBlocks[0];
    response += `Here's a relevant code example:\n\n\`\`\`${codeExample.language || 'csharp'}\n${codeExample.content}\n\`\`\`\n\n`;
  }
  
  response += `This information comes from the "${mainDoc.title}" section of the documentation. You can find more details in the full documentation.\n\n`;
  
  // Add references to other relevant documents
  if (relevantDocs.length > 1) {
    response += `You might also want to check out "${relevantDocs[1].title}" for related information.`;
  }
  
  return response;
}

/**
 * Get suggestions for related documentation based on a query
 */
export async function getEnhancedSuggestedDocumentation(query: string) {
  try {
    // Use the existing search function to find relevant documents
    const searchResults = searchDocs(query);
    
    // Format the top 5 results as suggestions
    const suggestions = searchResults.slice(0, 5).map((doc, i) => ({
      id: doc.id,
      title: doc.title,
      category: doc.category,
      url: `/documentation/${doc.category}/${doc.id}`,
      score: 1 - (i * 0.1), // Mock relevance score
      type: "text",
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
