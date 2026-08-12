/** Central shop contact config */
export const SHOP_WHATSAPP = '919054049570';
export const SHOP_PHONE_DISPLAY = '90540 49570';

export const WHATSAPP_BASE = `https://wa.me/${SHOP_WHATSAPP}`;

export function buildWhatsAppUrl(text) {
  return `${WHATSAPP_BASE}?text=${encodeURIComponent(text)}`;
}

export const DEFAULT_WHATSAPP_MESSAGE =
  'Hi Jay Bhavani Ornaments, I would like to enquire about your collection.';

export const DEFAULT_WHATSAPP_URL = buildWhatsAppUrl(DEFAULT_WHATSAPP_MESSAGE);
