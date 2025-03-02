import { NextRequest, NextResponse } from 'next/server';
import { getEnhancedSuggestedDocumentation } from '@/lib/enhanced-rag';
import { queryChromaDB } from '@/lib/chroma-client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }
    
    // Try to use ChromaDB first
    const chromaResult = await queryChromaDB(query, { k: 5 });
    
    if (chromaResult.success && chromaResult.results && chromaResult.results.length > 0) {
      // Format the results as suggestions
      const suggestions = chromaResult.results.map((doc, i) => ({
        id: doc.metadata.id || 'unknown',
        title: doc.metadata.title || 'Unknown Title',
        category: doc.metadata.category || 'unknown',
        url: doc.metadata.url || '#',
        score: 1 - (i * 0.1), // Mock relevance score
        type: doc.metadata.contentType || 'text',
      }));
      
      return NextResponse.json({
        suggestions,
        usingChroma: true
      });
    }
    
    // Fall back to enhanced RAG system if ChromaDB fails or returns no results
    console.log('Falling back to enhanced RAG system for suggestions');
    const result = await getEnhancedSuggestedDocumentation(query);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      suggestions: result.suggestions,
      usingChroma: false
    });
  } catch (error) {
    console.error('Error in suggestions API route:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
