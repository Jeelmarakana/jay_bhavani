import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    let product = null;
    try {
      const { getProductById } = await import('@/lib/db');
      product = await getProductById(id);
    } catch (dbError) {
      console.error('Database error for product lookup:', dbError);
    }

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product }, { status: 200 });
  } catch (error) {
    console.error(`API Error in /api/products/${params?.id}:`, error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
