// Import from documentation.ts
import { DocCategory, DocItem, getDocCategories } from './documentation';
import { rerankChromaResults } from './reranker';

// Import from LangChain
import { Chroma } from '@langchain/community/vectorstores/chroma';
import { OpenAIEmbeddings } from '@langchain/openai';
import { Document } from '@langchain/core/documents';
import { MarkdownTextSplitter, RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

// Environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const COLLECTION_NAME = "wl8_documentation";

// ChromaDB client for vector storage
let vectorStore: Chroma | null = null;

/**
 * Initialize the ChromaDB RAG system
 */
export async function initializeChromaRagSystem() {
  try {
    console.log('Initializing ChromaDB RAG system');
    
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }
    
    // Initialize OpenAI embeddings
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: OPENAI_API_KEY,
      modelName: "text-embedding-3-small", // Using the latest embedding model
    });
    
    // Initialize ChromaDB client
    vectorStore = await Chroma.fromExistingCollection(
      embeddings,
      { collectionName: COLLECTION_NAME }
    ).catch(async () => {
      console.log(`Collection ${COLLECTION_NAME} does not exist, creating new collection`);
      return await createAndPopulateCollection(embeddings);
    });
    
    return { 
      success: true, 
      message: 'ChromaDB RAG system initialized successfully',
      vectorStore
    };
  } catch (error) {
    console.error('Error initializing ChromaDB RAG system:', error);
    return { 
      success: false, 
      message: `Error initializing ChromaDB RAG system: ${error}`,
      error
    };
  }
}

/**
 * Create and populate a new ChromaDB collection with documentation
 */
async function createAndPopulateCollection(embeddings: OpenAIEmbeddings): Promise<Chroma> {
  console.log('Creating and populating new ChromaDB collection');
  
  // Get documentation from the current mock implementation
  const docCategories = getDocCategories();
  
  // Process documents and create chunks
  const documents = await processDocumentation(docCategories);
  
  // Create a new ChromaDB collection with the processed documents
  const vectorStore = await Chroma.fromDocuments(
    documents,
    embeddings,
    { collectionName: COLLECTION_NAME }
  );
  
  console.log(`Created ChromaDB collection with ${documents.length} documents`);
  
  return vectorStore;
}

/**
 * Process documentation into chunks with code-aware splitting
 */
async function processDocumentation(docCategories: DocCategory[]): Promise<Document[]> {
  const documents: Document[] = [];
  
  // Create a markdown splitter with code block handling
  const markdownSplitter = new MarkdownTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  
  // Process each document category
  for (const category of docCategories) {
    for (const item of category.items) {
      // Process the document with code-aware chunking
      const chunks = await processDocumentWithCodeAwareness(item, category.id);
      documents.push(...chunks);
    }
  }
  
  return documents;
}

/**
 * Process a document with code-aware chunking
 */
async function processDocumentWithCodeAwareness(
  docItem: DocItem, 
  categoryId: string
): Promise<Document[]> {
  const documents: Document[] = [];
  
  // Extract code blocks and their context
  const { textChunks, codeBlocks } = extractCodeBlocksAndText(docItem.content);
  
  // Process regular text chunks
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  
  // Create document chunks from text (excluding code blocks)
  const textDocs = await textSplitter.createDocuments(
    textChunks,
    [
      {
        id: docItem.id,
        title: docItem.title,
        category: categoryId,
        type: "text",
        url: `/documentation/${categoryId}/${docItem.id}`,
      },
    ]
  );
  
  // Add text documents
  documents.push(...textDocs);
  
  // Add code blocks as separate documents with their context
  codeBlocks.forEach((codeBlock, index) => {
    documents.push(
      new Document({
        pageContent: codeBlock.content,
        metadata: {
          id: `${docItem.id}-code-${index}`,
          title: docItem.title,
          category: categoryId,
          type: "code",
          language: codeBlock.language,
          url: `/documentation/${categoryId}/${docItem.id}`,
          context: codeBlock.context,
        },
      })
    );
  });
  
  return documents;
}

/**
 * Extract code blocks and text from markdown content
 */
function extractCodeBlocksAndText(markdown: string): { 
  textChunks: string[]; 
  codeBlocks: Array<{ language: string; content: string; context: string }> 
} {
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
  const codeBlocks: Array<{ language: string; content: string; context: string }> = [];
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
 * Query the ChromaDB RAG system with a user question
 */
export async function queryChromaRagSystem(question: string) {
  try {
    if (!vectorStore) {
      await initializeChromaRagSystem();
      
      if (!vectorStore) {
        throw new Error('Failed to initialize ChromaDB RAG system');
      }
    }
    
    // Perform similarity search with ChromaDB
    const results = await vectorStore.similaritySearch(question, 10); // Get more results for re-ranking
    
    // Apply re-ranking to improve result quality
    const rerankedResults = rerankChromaResults(question, results, {
      keywordWeight: 0.3,
      vectorWeight: 0.7,
      titleBoost: 1.5,
      codeBoost: 1.2
    });
    
    // Take the top 5 results after re-ranking
    const topResults = rerankedResults.slice(0, 5);
    
    // Extract relevant documents
    const relevantDocs = topResults.map((doc: any) => ({
      id: doc.metadata.id as string,
      title: doc.metadata.title as string,
      category: doc.metadata.category as string,
      content: doc.pageContent,
      type: doc.metadata.type as string,
      url: doc.metadata.url as string,
      ...(doc.metadata.language ? { language: doc.metadata.language as string } : {}),
    }));
    
    // Generate a response based on the relevant documents
    const answer = generateEnhancedResponse(question, relevantDocs);
    
    // Format sources for the response
    const sources = relevantDocs.map((doc: any) => ({
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
    console.error('Error querying ChromaDB RAG system:', error);
    return { 
      success: false, 
      message: `Error querying ChromaDB RAG system: ${error}`,
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
  
  // Separate code and text documents
  const textDocs = relevantDocs.filter(doc => doc.type === "text");
  const codeDocs = relevantDocs.filter(doc => doc.type === "code");
  
  // Extract content from the most relevant document
  const mainDoc = textDocs.length > 0 ? textDocs[0] : relevantDocs[0];
  
  // Create a response that references the documentation
  let response = `Based on the WL8 documentation, I can provide the following information about "${question}":\n\n`;
  
  // Add content from the main document
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
  
  return response;
}

/**
 * Get suggestions for related documentation based on a query
 */
export async function getChromaSuggestedDocumentation(query: string) {
  try {
    if (!vectorStore) {
      await initializeChromaRagSystem();
      
      if (!vectorStore) {
        throw new Error('Failed to initialize ChromaDB RAG system');
      }
    }
    
    // Perform similarity search with ChromaDB
    const results = await vectorStore.similaritySearch(query, 5);
    
    // Format the results as suggestions
    const suggestions = results.map((doc: any, i: number) => ({
      id: doc.metadata.id as string,
      title: doc.metadata.title as string,
      category: doc.metadata.category as string,
      url: doc.metadata.url as string,
      score: 1 - (i * 0.1), // Mock relevance score
      type: doc.metadata.type as string,
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
