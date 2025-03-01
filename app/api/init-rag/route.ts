import { NextRequest, NextResponse } from 'next/server';
import { initializeRagSystem } from '@/lib/rag';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const result = await initializeRagSystem();
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      message: result.message,
    });
  } catch (error) {
    console.error('Error initializing RAG system:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while initializing the RAG system' },
      { status: 500 }
    );
  }
}
