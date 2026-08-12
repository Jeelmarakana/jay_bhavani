const WISHLIST_KEY = 'jay_bhavani_wishlist';

export function getWishlist() {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(WISHLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveWishlist(items) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent('wishlist-updated', { detail: items }));
}

export function isInWishlist(productId) {
  return getWishlist().some((item) => item.id === productId);
}

export function toggleWishlistItem(product) {
  const list = getWishlist();
  const exists = list.some((item) => item.id === product.id);

  if (exists) {
    const updated = list.filter((item) => item.id !== product.id);
    saveWishlist(updated);
    return { added: false, list: updated };
  }

  const updated = [
    {
      id: product.id,
      name: product.name,
      image: product.image,
      purity: product.purity,
      weight: product.weight,
      categoryName: product.categoryName,
    },
    ...list,
  ];
  saveWishlist(updated);
  return { added: true, list: updated };
}

export function removeFromWishlist(productId) {
  const updated = getWishlist().filter((item) => item.id !== productId);
  saveWishlist(updated);
  return updated;
}

export function getWishlistShareText(items) {
  const lines = items.map(
    (item, index) =>
      `${index + 1}. ${item.name} (${item.purity}, ${item.weight}g) — jaybhavaniornaments.com/product/${item.id}`
  );
  return `Hi Jay Bhavani Ornaments, here is my shortlisted jewellery:\n\n${lines.join('\n')}\n\nPlease share current prices and availability.`;
}
