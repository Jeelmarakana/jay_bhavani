import { HttpErrorResponse } from '@angular/common/http';

export const CATEGORY_LIST = [
  { name: 'Rings', slug: 'rings', image: '/images/products/solitaires-4k.jpg', fallback: '💍' },
  {
    name: 'Necklaces',
    slug: 'necklaces',
    image: '/images/products/necklaces-4k.jpg',
    fallback: '📿',
  },
  { name: 'Earrings', slug: 'earrings', image: '/images/products/rings-4k.jpg', fallback: '✨' },
  {
    name: 'Bangles & Bracelets',
    slug: 'bangles',
    image: '/images/products/bangles-4k.jpg',
    fallback: '⚪',
  },
  {
    name: 'Mangalsutras',
    slug: 'mangalsutra',
    image: '/images/products/mangalsutras-4k.jpg',
    fallback: '🔗',
  },
  {
    name: 'Bridal Sets',
    slug: 'bridal-sets',
    image: '/images/products/bridal-sets-4k.jpg',
    fallback: '👑',
  },
  {
    name: 'Silver Jewellery',
    slug: 'silver',
    image: '/images/products/silver-jewellery-4k.jpg',
    fallback: '🥈',
  },
  {
    name: 'Temple Jewellery',
    slug: 'temple',
    image: '/images/products/temple-jewellery-4k.jpg',
    fallback: '🏛️',
  },
  {
    name: 'Kundan Jewellery',
    slug: 'kundan',
    image: '/images/products/kundan-jewellery-4k.jpg',
    fallback: '💎',
  },
  {
    name: 'Pendant Sets',
    slug: 'pendants',
    image: '/images/products/pendant-sets-4k.jpg',
    fallback: '📿',
  },
  { name: 'Chains', slug: 'chains', image: '/images/products/chains-4k.jpg', fallback: '⛓️' },
  {
    name: 'Anklets (Payal)',
    slug: 'anklets',
    image: '/images/products/anklets-4k.jpg',
    fallback: '🦶',
  },
  {
    name: 'Nose Pins',
    slug: 'nose-pins',
    image: '/images/products/nose-pins-4k.jpg',
    fallback: '💎',
  },
  { name: 'Brooches', slug: 'brooches', image: '/images/products/brooches-4k.jpg', fallback: '🌸' },
  {
    name: 'Kamarband (Waist Belt)',
    slug: 'kamarband',
    image: '/images/products/kamarband-4k.jpg',
    fallback: '🎀',
  },
  {
    name: 'Hair Accessories',
    slug: 'hair-accessories',
    image: '/images/products/hair-accessories-4k.jpg',
    fallback: '👑',
  },
  {
    name: "Men's Jewellery",
    slug: 'mens-jewellery',
    image: '/images/products/mens-jewellery-4k.jpg',
    fallback: '🤵',
  },
  {
    name: 'Gold Coins',
    slug: 'gold-coins',
    image: '/images/products/gold-coins-4k.jpg',
    fallback: '🪙',
  },
  {
    name: 'Religious Items',
    slug: 'religious',
    image: '/images/products/religious-items-4k.jpg',
    fallback: '🙏',
  },
  { name: 'Lockets', slug: 'lockets', image: '/images/products/lockets-4k.jpg', fallback: '🔒' },
  {
    name: 'Solitaires',
    slug: 'solitaires',
    image: '/images/products/solitaires-4k.jpg',
    fallback: '💎',
  },
  {
    name: 'Antique Jewellery',
    slug: 'antique',
    image: '/images/products/antique-jewellery-4k.jpg',
    fallback: '🏺',
  },
];

export function errorMessage(error: unknown, fallback: string): string {
  return error instanceof HttpErrorResponse ? error.error?.error || fallback : fallback;
}
