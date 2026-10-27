import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { SHOP_WHATSAPP } from './config.js';
import { pushOwnerWhatsAppNotification } from './whatsapp.js';

const originalApiKey = process.env.CALLMEBOT_API_KEY;
const originalFetch = globalThis.fetch;

afterEach(() => {
  if (originalApiKey === undefined) {
    delete process.env.CALLMEBOT_API_KEY;
  } else {
    process.env.CALLMEBOT_API_KEY = originalApiKey;
  }
  globalThis.fetch = originalFetch;
});

test('does not claim a notification was sent without a configured API key', async () => {
  delete process.env.CALLMEBOT_API_KEY;
  globalThis.fetch = async () => {
    assert.fail('Fetch must not run when the integration is not configured.');
  };

  const result = await pushOwnerWhatsAppNotification({
    name: 'Test Customer',
    phone: '9876543210',
    message: 'Is this item available?',
  });

  assert.deepEqual(result, { sent: false, reason: 'not_configured' });
});

test('sends the enquiry details to the configured shop WhatsApp number', async () => {
  process.env.CALLMEBOT_API_KEY = 'test-api-key';
  let requestUrl;
  globalThis.fetch = async (url) => {
    requestUrl = new URL(url);
    return new Response('Message queued', { status: 200 });
  };

  const result = await pushOwnerWhatsAppNotification({
    name: 'Test Customer',
    phone: '9876543210',
    email: 'customer@example.com',
    interestedIn: 'Rings',
    productName: 'Gold Ring',
    productId: 'ring-1',
    message: 'Is this item available?',
  });

  assert.equal(result.sent, true);
  assert.equal(requestUrl.searchParams.get('phone'), SHOP_WHATSAPP);
  assert.equal(requestUrl.searchParams.get('apikey'), 'test-api-key');
  assert.match(requestUrl.searchParams.get('text'), /Test Customer/);
  assert.match(requestUrl.searchParams.get('text'), /9876543210/);
  assert.match(requestUrl.searchParams.get('text'), /customer@example\.com/);
  assert.match(requestUrl.searchParams.get('text'), /Gold Ring/);
  assert.match(requestUrl.searchParams.get('text'), /Is this item available\?/);
});

test('reports a provider rejection without claiming the notification was sent', async () => {
  process.env.CALLMEBOT_API_KEY = 'test-api-key';
  globalThis.fetch = async () => new Response('Rejected', { status: 403 });

  const result = await pushOwnerWhatsAppNotification({
    name: 'Test Customer',
    phone: '9876543210',
    message: 'Please call me.',
  });

  assert.deepEqual(result, { sent: false, reason: 'provider_rejected', status: 403 });
});

test('reports provider network errors without losing the saved enquiry flow', async () => {
  process.env.CALLMEBOT_API_KEY = 'test-api-key';
  globalThis.fetch = async () => {
    throw new Error('Network unavailable');
  };

  const result = await pushOwnerWhatsAppNotification({
    name: 'Test Customer',
    phone: '9876543210',
    message: 'Please call me.',
  });

  assert.deepEqual(result, { sent: false, reason: 'request_failed' });
});
