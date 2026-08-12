'use client';

import { useEffect } from 'react';
import styles from './Page3D.module.css';

export default function Page3D({ children }) {
  useEffect(() => {
    const sections = document.querySelectorAll('[data-3d-reveal]');
    const cards = document.querySelectorAll('[data-3d-tilt]');

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    sections.forEach((el) => revealObserver.observe(el));

    const handleTilt = (event) => {
      const card = event.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty('--tilt-x', `${y * -10}deg`);
      card.style.setProperty('--tilt-y', `${x * 10}deg`);
    };

    const resetTilt = (event) => {
      const card = event.currentTarget;
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    };

    cards.forEach((card) => {
      card.addEventListener('mousemove', handleTilt);
      card.addEventListener('mouseleave', resetTilt);
    });

    return () => {
      revealObserver.disconnect();
      cards.forEach((card) => {
        card.removeEventListener('mousemove', handleTilt);
        card.removeEventListener('mouseleave', resetTilt);
      });
    };
  }, []);

  return (
    <div className={styles.scene}>
      <div className={styles.orbLayer} aria-hidden="true">
        <span className={styles.orb} />
        <span className={styles.orb} />
        <span className={styles.orb} />
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
