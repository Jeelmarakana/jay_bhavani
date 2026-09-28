import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

export const ADMIN_SESSION_COOKIE = 'jay_bhavani_admin_session';
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8;

export function hasAdminConfiguration() {
  return Boolean(
    process.env.ADMIN_USERNAME &&
      process.env.ADMIN_PASSWORD &&
      process.env.ADMIN_SESSION_SECRET &&
      Buffer.byteLength(process.env.ADMIN_SESSION_SECRET) >= 32,
  );
}

function safeEqual(left, right) {
  const leftHash = createHash('sha256').update(left).digest();
  const rightHash = createHash('sha256').update(right).digest();
  return timingSafeEqual(leftHash, rightHash);
}

export function verifyAdminCredentials(username, password) {
  if (!hasAdminConfiguration()) return false;

  return (
    safeEqual(username, process.env.ADMIN_USERNAME) &&
    safeEqual(password, process.env.ADMIN_PASSWORD)
  );
}

export function createAdminSessionToken() {
  const payload = Buffer.from(
    JSON.stringify({ username: process.env.ADMIN_USERNAME, expiresAt: Date.now() + ADMIN_SESSION_MAX_AGE * 1000 }),
  ).toString('base64url');
  const signature = createHmac('sha256', process.env.ADMIN_SESSION_SECRET)
    .update(payload)
    .digest('base64url');

  return `${payload}.${signature}`;
}

export function isValidAdminSession(token) {
  if (!token || !hasAdminConfiguration()) return false;

  const [payload, signature, extra] = token.split('.');
  if (!payload || !signature || extra) return false;

  const expectedSignature = createHmac('sha256', process.env.ADMIN_SESSION_SECRET)
    .update(payload)
    .digest();

  let suppliedSignature;
  try {
    suppliedSignature = Buffer.from(signature, 'base64url');
  } catch {
    return false;
  }

  if (
    suppliedSignature.length !== expectedSignature.length ||
    !timingSafeEqual(suppliedSignature, expectedSignature)
  ) {
    return false;
  }

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return session.username === process.env.ADMIN_USERNAME && session.expiresAt > Date.now();
  } catch {
    return false;
  }
}