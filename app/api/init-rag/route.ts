import { NextRequest, NextResponse } from 'next/server';
import { initializeEnhancedRagSystem } from '@/lib/enhanced-rag';
import { initializeSupabaseRagSystem } from '@/lib/supabase-rag';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Try to initialize Supabase first
    const supabaseResult = await initializeSupabaseRagSystem();
    
    if (supabaseResult.success) {
      return NextResponse.json({
        message: 'Supabase RAG system initialized successfully',
        documentCount: supabaseResult.documentCount || 0,
        usingSupabase: true
      });
    }
    
    // Fall back to enhanced RAG system if Supabase fails
    console.log('Falling back to enhanced RAG system');
    const result = await initializeEnhancedRagSystem();
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      message: result.message,
      documentCount: result.documentCount || 0,
      usingSupabase: false
    });
  } catch (error) {
    console.error('Error initializing RAG system:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while initializing the RAG system' },
      { status: 500 }
    );
  }
}
