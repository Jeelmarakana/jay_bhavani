import { NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, isValidAdminSession } from '@/lib/admin-auth';
import { getOwnerNotifyUrl, pushOwnerWhatsAppNotification } from '@/lib/whatsapp';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, productId, productName, interestedIn, message } = body;

    if (!name || !phone || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, Phone number, and Message are required.' },
        { status: 400 }
      );
    }

    // Try to save inquiry, fallback to WhatsApp notification if database fails
    let newInquiry = null;
    try {
      const { addInquiry } = await import('@/lib/db');
      newInquiry = await addInquiry({
        name,
        email,
        phone,
        productId,
        productName,
        interestedIn,
        message,
      });
    } catch (dbError) {
      console.error('Database error for inquiry, proceeding with WhatsApp only:', dbError);
    }

    const inquiryData = newInquiry || {
      id: Date.now().toString(),
      name,
      email,
      phone,
      productId,
      productName,
      interestedIn,
      message,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    const notifyUrl = getOwnerNotifyUrl(inquiryData);
    await pushOwnerWhatsAppNotification(inquiryData);

    return NextResponse.json(
      { success: true, inquiry: inquiryData, notifyUrl },
      { status: 201 }
    );
  } catch (error) {
    console.error('API Error in POST /api/inquiries:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!isValidAdminSession(token)) {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    let inquiries = [];
    try {
      const { getInquiries } = await import('@/lib/db');
      inquiries = await getInquiries();
    } catch (dbError) {
      console.error('Database error for inquiries, returning empty array:', dbError);
      inquiries = [];
    }
    return NextResponse.json({ success: true, inquiries }, { status: 200 });
  } catch (error) {
    console.error('API Error in GET /api/inquiries:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
