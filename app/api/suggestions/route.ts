import { NextRequest, NextResponse } from 'next/server';
import { getEnhancedSuggestedDocumentation } from '@/lib/enhanced-rag';
import { getSupabaseSuggestedDocumentation } from '@/lib/supabase-rag';

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
    
    // Try to use Supabase first
    const supabaseResult = await getSupabaseSuggestedDocumentation(query);
    
    if (supabaseResult.success && supabaseResult.suggestions && supabaseResult.suggestions.length > 0) {
      return NextResponse.json({
        suggestions: supabaseResult.suggestions,
        usingSupabase: true
      });
    }
    
    // Fall back to enhanced RAG system if Supabase fails or returns no results
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
      usingSupabase: false
    });
  } catch (error) {
    console.error('Error in suggestions API route:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
