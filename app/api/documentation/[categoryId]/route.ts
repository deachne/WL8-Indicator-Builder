import { NextResponse } from 'next/server';
import { getDocCategories } from '@/lib/server/documentation';

export async function GET(
  request: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const categoryId = params.categoryId;
    const categories = getDocCategories();
    const category = categories.find(cat => cat.id === categoryId);

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ category });
  } catch (error) {
    console.error('Error fetching documentation category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documentation category' },
      { status: 500 }
    );
  }
}
