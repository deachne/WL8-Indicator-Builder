import { NextRequest, NextResponse } from 'next/server';
import { getEnhancedSuggestedDocumentation } from '@/lib/enhanced-rag';
import { getSupabaseSuggestedDocumentation } from '@/lib/supabase-rag';

export const dynamic = 'force-dynamic';

// Define a server action for getting documentation suggestions
async function getSuggestions(query: string) {
  console.log('🔎 Getting suggestions for query:', query);
  
  try {
    // Try to use Supabase first
    console.log('🔄 Attempting to use Supabase for suggestions');
    const supabaseResult = await getSupabaseSuggestedDocumentation(query);
    
    if (supabaseResult.success && supabaseResult.suggestions && supabaseResult.suggestions.length > 0) {
      console.log('✅ Using Supabase suggestions');
      return {
        suggestions: supabaseResult.suggestions,
        usingSupabase: true
      };
    }
    
    // Fall back to enhanced RAG system if Supabase fails or returns no results
    console.log('🔄 Falling back to enhanced RAG system for suggestions');
    const result = await getEnhancedSuggestedDocumentation(query);
    
    if (!result.success) {
      console.error('❌ Enhanced RAG system returned error:', result.message);
      throw new Error(result.message);
    }
    
    console.log('✅ Using enhanced RAG suggestions');
    return {
      suggestions: result.suggestions,
      usingSupabase: false
    };
  } catch (error) {
    console.error('❌ Error getting suggestions:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    
    if (!query) {
      console.error('❌ Missing query parameter');
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }
    
    // Use the server action to get suggestions
    const result = await getSuggestions(query);
    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ Unhandled error in suggestions API route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
