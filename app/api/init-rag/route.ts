import { NextRequest, NextResponse } from 'next/server';
import { initializeEnhancedRagSystem } from '@/lib/enhanced-rag';
import { initializeChromaDB, getChromaCollectionInfo } from '@/lib/chroma-client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Try to initialize ChromaDB first
    const chromaResult = await initializeChromaDB();
    
    if (chromaResult.success) {
      // If ChromaDB initialization is successful, get collection info
      const collectionInfo = await getChromaCollectionInfo();
      
      if (collectionInfo.success) {
        return NextResponse.json({
          message: 'ChromaDB RAG system initialized successfully',
          documentCount: collectionInfo.documentCount || 0,
          collectionName: collectionInfo.collectionName,
          usingChroma: true
        });
      }
    }
    
    // Fall back to enhanced RAG system if ChromaDB fails
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
      usingChroma: false
    });
  } catch (error) {
    console.error('Error initializing RAG system:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while initializing the RAG system' },
      { status: 500 }
    );
  }
}
