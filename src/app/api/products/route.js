import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'all';
    const metal = searchParams.get('metal') || 'all';
    const purity = searchParams.get('purity') || 'all';
    const featured = searchParams.get('featured') || undefined;

    const products = await getProducts({ search, category, metal, purity, featured });

    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error) {
    console.error('API Error in /api/products:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
