import { SHOP_WHATSAPP, buildWhatsAppUrl } from './config';

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

export function getOwnerNotifyUrl(inquiry) {
  return buildWhatsAppUrl(buildInquiryNotifyMessage(inquiry));
}

/** Server-side push via CallMeBot when CALLMEBOT_API_KEY is configured */
export async function pushOwnerWhatsAppNotification(inquiry) {
  const apiKey = process.env.CALLMEBOT_API_KEY;
  if (!apiKey) return { sent: false, reason: 'no_api_key' };

  const text = buildInquiryNotifyMessage(inquiry);
  const url =
    `https://api.callmebot.com/whatsapp.php?phone=${SHOP_WHATSAPP}` +
    `&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(apiKey)}`;

  try {
    const res = await fetch(url, { method: 'GET', cache: 'no-store' });
    return { sent: res.ok, status: res.status };
  } catch (error) {
    console.error('CallMeBot notification failed:', error);
    return { sent: false, reason: 'fetch_error' };
  }
}
