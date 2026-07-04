import { NextResponse } from 'next/server';
import { addInquiry, getInquiries } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, productId, productName, message } = body;

    // Validation
    if (!name || !phone || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, Phone number, and Message are required.' },
        { status: 400 }
      );
    }

    const newInquiry = await addInquiry({
      name,
      email,
      phone,
      productId,
      productName,
      message
    });

    if (!newInquiry) {
      return NextResponse.json(
        { success: false, error: 'Failed to save inquiry to database.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, inquiry: newInquiry }, { status: 201 });
  } catch (error) {
    console.error('API Error in POST /api/inquiries:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const inquiries = await getInquiries();
    return NextResponse.json({ success: true, inquiries }, { status: 200 });
  } catch (error) {
    console.error('API Error in GET /api/inquiries:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
