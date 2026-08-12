/** Shared client helper for inquiry form submission + owner WhatsApp notify */
export async function submitInquiry(payload) {
  const res = await fetch('/api/inquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  return { ok: res.ok, data };
}

export function openOwnerWhatsAppNotify(notifyUrl) {
  if (!notifyUrl || typeof window === 'undefined') return;
  window.open(notifyUrl, '_blank', 'noopener,noreferrer');
}
