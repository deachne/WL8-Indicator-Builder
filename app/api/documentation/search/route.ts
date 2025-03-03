import { NextResponse } from 'next/server';
import { searchDocs } from '@/lib/server/documentation';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }

    const results = searchDocs(query);
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error searching documentation:', error);
    return NextResponse.json(
      { error: 'Failed to search documentation' },
      { status: 500 }
    );
  }
}
