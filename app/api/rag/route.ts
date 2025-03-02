import { NextRequest, NextResponse } from 'next/server';
import { queryEnhancedRagSystem } from '@/lib/enhanced-rag';
import { queryChromaDB } from '@/lib/chroma-client';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;
    
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query parameter is required and must be a string' },
        { status: 400 }
      );
    }
    
    // Try to use ChromaDB first
    const chromaResult = await queryChromaDB(query, { k: 5 });
    
    if (chromaResult.success && chromaResult.results && chromaResult.results.length > 0) {
      // Generate a response based on the ChromaDB results
      const answer = generateResponseFromChromaResults(query, chromaResult.results);
      
      // Format sources for the response
      const sources = chromaResult.results.map(doc => ({
        id: doc.metadata.id || 'unknown',
        title: doc.metadata.title || 'Unknown Title',
        category: doc.metadata.category || 'unknown',
        url: doc.metadata.url || '#',
        type: doc.metadata.contentType || 'text',
      }));
      
      return NextResponse.json({
        answer,
        sources,
        usingChroma: true
      });
    }
    
    // Fall back to enhanced RAG system if ChromaDB fails or returns no results
    console.log('Falling back to enhanced RAG system');
    const result = await queryEnhancedRagSystem(query);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      answer: result.answer,
      sources: result.sources,
      usingChroma: false
    });
  } catch (error) {
    console.error('Error in RAG API route:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

/**
 * Generate a response based on ChromaDB results
 */
function generateResponseFromChromaResults(query: string, results: any[]): string {
  if (results.length === 0) {
    return "I couldn't find specific information about that in the WL8 documentation. Could you try rephrasing your question or asking about a different topic?";
  }
  
  // Separate code and text documents
  const textDocs = results.filter(doc => doc.metadata.contentType === 'text' || !doc.metadata.contentType);
  const codeDocs = results.filter(doc => doc.metadata.contentType === 'code');
  const mixedDocs = results.filter(doc => doc.metadata.contentType === 'mixed');
  
  // Extract content from the most relevant document
  const mainDoc = textDocs.length > 0 ? textDocs[0] : 
                 mixedDocs.length > 0 ? mixedDocs[0] : 
                 results[0];
  
  // Create a response that references the documentation
  let response = `Based on the WL8 documentation, I can provide the following information about "${query}":\n\n`;
  
  // Add content from the main document
  response += `${mainDoc.pageContent.substring(0, 400)}...\n\n`;
  
  // Add code example if available
  if (codeDocs.length > 0) {
    const codeExample = codeDocs[0];
    response += `Here's a relevant code example:\n\n\`\`\`${codeExample.metadata.language || 'csharp'}\n${codeExample.pageContent}\n\`\`\`\n\n`;
  } else if (mixedDocs.length > 0) {
    // Try to extract code from mixed document
    const codeMatch = mixedDocs[0].pageContent.match(/```(\w*)\n([\s\S]*?)```/);
    if (codeMatch) {
      response += `Here's a relevant code example:\n\n\`\`\`${codeMatch[1] || 'csharp'}\n${codeMatch[2]}\n\`\`\`\n\n`;
    }
  }
  
  response += `This information comes from the "${mainDoc.metadata.title || 'WL8 Documentation'}" section. You can find more details in the full documentation.\n\n`;
  
  // Add references to other relevant documents
  if (results.length > 1) {
    response += `You might also want to check out "${results[1].metadata.title || 'related documentation'}" for related information.`;
  }
  
  return response;
}
