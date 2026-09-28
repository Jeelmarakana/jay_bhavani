import { NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  createAdminSessionToken,
  hasAdminConfiguration,
  isValidAdminSession,
  verifyAdminCredentials,
} from '@/lib/admin-auth';

const cookieOptions = {
  httpOnly: true,
  maxAge: ADMIN_SESSION_MAX_AGE,
  path: '/',
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production',
};

export async function GET(request) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  return NextResponse.json({ authenticated: isValidAdminSession(token) });
}

export async function POST(request) {
  if (!hasAdminConfiguration()) {
    return NextResponse.json(
      { success: false, error: 'Admin login is not configured on the server.' },
      { status: 503 },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request.' }, { status: 400 });
  }

  const username = typeof body?.username === 'string' ? body.username : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  if (!verifyAdminCredentials(username, password)) {
    return NextResponse.json(
      { success: false, error: 'Invalid admin username or password.' },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ success: true, message: 'Admin login successful.' });
  response.cookies.set(ADMIN_SESSION_COOKIE, createAdminSessionToken(), cookieOptions);
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, '', { ...cookieOptions, maxAge: 0 });
  return response;
}