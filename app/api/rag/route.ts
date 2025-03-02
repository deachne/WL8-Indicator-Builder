import { NextRequest, NextResponse } from 'next/server';
import { queryEnhancedRagSystem } from '@/lib/enhanced-rag';
import { querySupabaseRagSystem } from '@/lib/supabase-rag';

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
    
    // Try to use Supabase first
    const supabaseResult = await querySupabaseRagSystem(query);
    
    if (supabaseResult.success && supabaseResult.answer) {
      return NextResponse.json({
        answer: supabaseResult.answer,
        sources: supabaseResult.sources,
        usingSupabase: true
      });
    }
    
    // Fall back to enhanced RAG system if Supabase fails or returns no results
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
      usingSupabase: false
    });
  } catch (error) {
    console.error('Error in RAG API route:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
