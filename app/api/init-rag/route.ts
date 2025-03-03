import { NextRequest, NextResponse } from 'next/server';
import { initializeEnhancedRagSystem } from '@/lib/enhanced-rag';
import { initializeSupabaseRagSystem } from '@/lib/supabase-rag';

export const dynamic = 'force-dynamic';

// Define a server action for initializing the RAG system
async function initializeRagSystem() {
  console.log('🔄 Initializing RAG system');
  
  try {
    // Try to initialize Supabase first
    console.log('🔄 Attempting to initialize Supabase RAG system');
    const supabaseResult = await initializeSupabaseRagSystem();
    
    if (supabaseResult.success) {
      console.log('✅ Supabase RAG system initialized successfully');
      return {
        message: 'Supabase RAG system initialized successfully',
        documentCount: supabaseResult.documentCount || 0,
        usingSupabase: true
      };
    }
    
    // Fall back to enhanced RAG system if Supabase fails
    console.log('🔄 Falling back to enhanced RAG system');
    const result = await initializeEnhancedRagSystem();
    
    if (!result.success) {
      console.error('❌ Enhanced RAG system initialization failed:', result.message);
      throw new Error(result.message);
    }
    
    console.log('✅ Enhanced RAG system initialized successfully');
    return {
      message: result.message,
      documentCount: result.documentCount || 0,
      usingSupabase: false
    };
  } catch (error) {
    console.error('❌ Error initializing RAG system:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Use the server action to initialize the RAG system
    const result = await initializeRagSystem();
    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ Unhandled error in init-rag API route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred while initializing the RAG system' },
      { status: 500 }
    );
  }
}
