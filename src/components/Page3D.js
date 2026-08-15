'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import styles from './Page3D.module.css';

const REVEAL_SELECTOR = '[data-3d-reveal]';
const TILT_SELECTOR = '[data-3d-tilt]';
const PARALLAX_SELECTOR = '[data-3d-parallax]';

export default function Page3D({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      document.querySelectorAll(REVEAL_SELECTOR).forEach((el) => el.classList.add('is-visible'));
      return undefined;
    }

    const tilted = new WeakSet();
    const parallaxItems = new Set();

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    const handleTilt = (event) => {
      const card = event.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      const strength = Number(card.dataset['3dTilt'] || card.getAttribute('data-3d-tilt')) || 10;
      card.style.setProperty('--tilt-x', `${y * -strength}deg`);
      card.style.setProperty('--tilt-y', `${x * strength}deg`);
      card.style.setProperty('--glare-x', `${(x + 0.5) * 100}%`);
      card.style.setProperty('--glare-y', `${(y + 0.5) * 100}%`);
      card.style.setProperty('--glare-opacity', '1');
    };

    const resetTilt = (event) => {
      const card = event.currentTarget;
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
      card.style.setProperty('--glare-opacity', '0');
    };

    const registerTilt = (card) => {
      if (tilted.has(card)) return;
      tilted.add(card);
      card.addEventListener('mousemove', handleTilt);
      card.addEventListener('mouseleave', resetTilt);
    };

    const updateParallax = () => {
      const viewportHeight = window.innerHeight || 1;
      parallaxItems.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > viewportHeight + 200) return;
        const speed = Number(el.getAttribute('data-3d-parallax')) || 20;
        const progress = (rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight;
        el.style.setProperty('--parallax-y', `${progress * -speed}px`);
        el.style.setProperty('--parallax-rotate', `${progress * -2}deg`);
      });
    };

    const scan = (root) => {
      root.querySelectorAll(REVEAL_SELECTOR).forEach((el) => {
        if (!el.classList.contains('is-visible')) revealObserver.observe(el);
      });
      root.querySelectorAll(TILT_SELECTOR).forEach(registerTilt);
      root.querySelectorAll(PARALLAX_SELECTOR).forEach((el) => parallaxItems.add(el));
      updateParallax();
    };

    scan(document);

    // Product grids and detail sections render after their fetch resolves.
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return;
          if (node.matches(REVEAL_SELECTOR)) revealObserver.observe(node);
          if (node.matches(TILT_SELECTOR)) registerTilt(node);
          if (node.matches(PARALLAX_SELECTOR)) parallaxItems.add(node);
          scan(node);
        });
      });
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        updateParallax();
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      revealObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      document.querySelectorAll(TILT_SELECTOR).forEach((card) => {
        card.removeEventListener('mousemove', handleTilt);
        card.removeEventListener('mouseleave', resetTilt);
      });
    };
  }, [pathname]);

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
