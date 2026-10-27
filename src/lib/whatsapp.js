import { SHOP_WHATSAPP } from './config.js';

export function buildInquiryNotifyMessage(inquiry) {
  const lines = [
    '🔔 *New Website Enquiry*',
    '',
    `*Name:* ${inquiry.name}`,
    `*Phone:* ${inquiry.phone}`,
  ];

  if (inquiry.email) lines.push(`*Email:* ${inquiry.email}`);
  if (inquiry.interestedIn) lines.push(`*Interested in:* ${inquiry.interestedIn}`);
  if (inquiry.productName) lines.push(`*Product:* ${inquiry.productName}`);
  if (inquiry.productId) lines.push(`*Product ID:* ${inquiry.productId}`);
  lines.push('', `*Message:* ${inquiry.message}`);

  return lines.join('\n');
}

/** Server-side push via CallMeBot when CALLMEBOT_API_KEY is configured */
export async function pushOwnerWhatsAppNotification(inquiry) {
  const apiKey = process.env.CALLMEBOT_API_KEY?.trim();
  if (!apiKey || apiKey === 'replace_with_your_callmebot_api_key') {
    console.error(
      'WhatsApp enquiry notification was not sent: configure a real CALLMEBOT_API_KEY in .env.',
    );
    return { sent: false, reason: 'not_configured' };
  }

  const text = buildInquiryNotifyMessage(inquiry);
  const url =
    `https://api.callmebot.com/whatsapp.php?phone=${SHOP_WHATSAPP}` +
    `&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(apiKey)}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error(`WhatsApp notification provider rejected the request with HTTP ${res.status}.`);
      return { sent: false, reason: 'provider_rejected', status: res.status };
    }
    return { sent: true, status: res.status };
  } catch (error) {
    console.error('CallMeBot notification failed:', error);
    return {
      sent: false,
      reason:
        error instanceof Error && error.name === 'TimeoutError' ? 'timeout' : 'request_failed',
    };
  }
}
