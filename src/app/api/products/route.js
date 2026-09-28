import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'all';
    const metal = searchParams.get('metal') || 'all';
    const purity = searchParams.get('purity') || 'all';
    const featured = searchParams.get('featured') || undefined;

    // Try to get products from database, fallback to empty array on error
    let products = [];
    try {
      const { getProducts } = await import('@/lib/db');
      products = await getProducts({ search, category, metal, purity, featured });
    } catch (dbError) {
      console.error('Database error, using empty products:', dbError);
      products = [];
    }

    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error) {
    console.error('API Error in /api/products:', error);
    return NextResponse.json({ success: true, products: [] }, { status: 200 });
  }
}
