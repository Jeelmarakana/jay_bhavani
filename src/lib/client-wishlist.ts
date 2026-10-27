import type { Product } from '../app/api.service';

export type WishlistProduct = Pick<
  Product,
  'id' | 'name' | 'image' | 'purity' | 'weight' | 'categoryName'
>;

const WISHLIST_KEY = 'jay_bhavani_wishlist';

export function getWishlist(): WishlistProduct[] {
  try {
    const stored = localStorage.getItem(WISHLIST_KEY);
    return stored ? (JSON.parse(stored) as WishlistProduct[]) : [];
  } catch (error) {
    console.error('Unable to read the saved wishlist.', error);
    return [];
  }
}

export function toggleWishlist(product: Product | WishlistProduct): void {
  const current = getWishlist();
  const exists = current.some((item) => item.id === product.id);
  const updated = exists
    ? current.filter((item) => item.id !== product.id)
    : [
        {
          id: product.id,
          name: product.name,
          image: product.image,
          purity: product.purity,
          weight: product.weight,
          categoryName: product.categoryName,
        },
        ...current,
      ];
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('wishlist-updated', { detail: updated }));
}

export function removeWishlistItem(id: string): void {
  const updated = getWishlist().filter((item) => item.id !== id);
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('wishlist-updated', { detail: updated }));
}

export function wishlistShareUrl(items: WishlistProduct[]): string {
  const text = items
    .map(
      (item, index) =>
        `${index + 1}. ${item.name} (${item.purity}, ${item.weight}g) — jaybhavaniornaments.com/product/${item.id}`,
    )
    .join('\n');
  return `https://wa.me/919054049570?text=${encodeURIComponent(`Hi Jay Bhavani Ornaments, here is my shortlisted jewellery:\n\n${text}\n\nPlease share current prices and availability.`)}`;
}
