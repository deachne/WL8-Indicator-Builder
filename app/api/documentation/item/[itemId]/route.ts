import { NextResponse } from 'next/server';
import { getDocItem } from '@/lib/server/documentation';

export async function GET(
  request: Request,
  { params }: { params: { itemId: string } }
) {
  try {
    const itemId = params.itemId;
    const item = getDocItem(itemId);

    if (!item) {
      return NextResponse.json(
        { error: 'Documentation item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ item });
  } catch (error) {
    console.error('Error fetching documentation item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documentation item' },
      { status: 500 }
    );
  }
}
