import { NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, isValidAdminSession } from '@/lib/admin-auth';
import { addInquiry, getInquiries } from '@/lib/db';
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

    const newInquiry = await addInquiry({
      name,
      email,
      phone,
      productId,
      productName,
      interestedIn,
      message,
    });

    if (!newInquiry) {
      return NextResponse.json(
        { success: false, error: 'Failed to save enquiry. Please WhatsApp us directly at 9054049570.' },
        { status: 500 }
      );
    }

    const notifyUrl = getOwnerNotifyUrl(newInquiry);
    await pushOwnerWhatsAppNotification(newInquiry);

    return NextResponse.json(
      { success: true, inquiry: newInquiry, notifyUrl },
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
    const inquiries = await getInquiries();
    return NextResponse.json({ success: true, inquiries }, { status: 200 });
  } catch (error) {
    console.error('API Error in GET /api/inquiries:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
