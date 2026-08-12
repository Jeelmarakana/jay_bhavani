'use client';

import { useEffect, useState } from 'react';
import { isInWishlist, toggleWishlistItem } from '@/lib/wishlist';
import styles from './WishlistButton.module.css';

export default function WishlistButton({ product, className = '' }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (product?.id) {
      setActive(isInWishlist(product.id));
    }
  }, [product?.id]);

  useEffect(() => {
    const handleUpdate = () => {
      if (product?.id) {
        setActive(isInWishlist(product.id));
      }
    };

    window.addEventListener('wishlist-updated', handleUpdate);
    return () => window.removeEventListener('wishlist-updated', handleUpdate);
  }, [product?.id]);

  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!product) return;
    const result = toggleWishlistItem(product);
    setActive(result.added);
  };

  return (
    <button
      type="button"
      className={`${styles.btn} ${active ? styles.active : ''} ${className}`}
      onClick={handleClick}
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
      title={active ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {active ? '♥' : '♡'}
    </button>
  );
}
