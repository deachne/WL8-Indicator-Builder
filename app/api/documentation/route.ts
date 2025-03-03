import { NextResponse } from 'next/server';
import { getDocCategories } from '@/lib/server/documentation';

export async function GET() {
  try {
    const categories = getDocCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching documentation categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documentation categories' },
      { status: 500 }
    );
  }
}
