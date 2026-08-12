'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductImage from '@/components/ProductImage';
import WishlistButton from '@/components/WishlistButton';
import { getWishlist, getWishlistShareText } from '@/lib/wishlist';
import styles from './page.module.css';

export default function WishlistPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getWishlist());

    const handleUpdate = (event) => {
      setItems(event.detail || getWishlist());
    };

    window.addEventListener('wishlist-updated', handleUpdate);
    return () => window.removeEventListener('wishlist-updated', handleUpdate);
  }, []);

  const shareUrl = items.length
    ? `https://wa.me/919898426635?text=${encodeURIComponent(getWishlistShareText(items))}`
    : '#';

  return (
    <div className="container" style={{ padding: '3rem 2rem 5rem' }}>
      <div className={styles.header}>
        <span className={styles.kicker}>My Shortlist</span>
        <h1 className="serif-title" style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>My Wishlist</h1>
        <p className={styles.desc}>
          Save designs you love and share your shortlist on WhatsApp before your showroom visit.
          No login required — saved in your browser.
        </p>
      </div>

      {items.length === 0 ? (
        <div className={styles.empty}>
          <p>Your wishlist is empty. Browse our collection and tap ♡ on any design.</p>
          <Link href="/shop" className="gold-btn">Explore Collection</Link>
        </div>
      ) : (
        <>
          <div className={styles.actions}>
            <p><strong>{items.length}</strong> design{items.length !== 1 ? 's' : ''} saved</p>
            <a href={shareUrl} target="_blank" rel="noreferrer" className="gold-btn">
              Share on WhatsApp
            </a>
          </div>

          <div className={styles.grid}>
            {items.map((item) => (
              <div key={item.id} className={`${styles.card} card`}>
                <div className={styles.imgWrap}>
                  <ProductImage src={item.image} alt={`${item.name} - Jay Bhavani Ornaments`} className={styles.img} />
                  <WishlistButton product={item} className={styles.wishBtn} />
                </div>
                <div className={styles.details}>
                  <span className={styles.category}>{item.categoryName}</span>
                  <h3>{item.name}</h3>
                  <p>{item.weight}g · {item.purity}</p>
                  <Link href={`/product/${item.id}`} className={styles.viewLink}>View Details →</Link>
                </div>
              </div>
            ))}
          </div>

          <p className={styles.loginNote}>
            <Link href="/auth/login">Login</Link> to save your wishlist permanently across devices — optional, never required.
          </p>
        </>
      )}
    </div>
  );
}
