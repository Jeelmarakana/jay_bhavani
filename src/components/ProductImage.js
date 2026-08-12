'use client';

import { useState } from 'react';
import styles from './ProductImage.module.css';

export default function ProductImage({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div className={`${styles.placeholder} ${className}`} aria-label={alt}>
        <span className={styles.placeholderIcon}>✦</span>
        <span className={styles.placeholderText}>{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
