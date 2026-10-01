'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import styles from './Page3D.module.css';

export default function Page3D({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    const sections = document.querySelectorAll('[data-3d-reveal]');
    const cards = document.querySelectorAll('[data-3d-tilt]');
    const fadeElements = document.querySelectorAll('[data-fade-in]');
    const slideElements = document.querySelectorAll('[data-slide-up]');
    const scaleElements = document.querySelectorAll('[data-scale-up]');
    const parallaxElements = document.querySelectorAll('[data-parallax]');
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

    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const slideObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-slide-up');
            slideObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const scaleObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-scale-up');
            scaleObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const parallaxObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('parallax-active');
          } else {
            entry.target.classList.remove('parallax-active');
          }
        });
      },
      { threshold: 0, rootMargin: '0px 0px -100px 0px' }
    );

    sections.forEach((el) => revealObserver.observe(el));
    fadeElements.forEach((el) => fadeObserver.observe(el));
    slideElements.forEach((el) => slideObserver.observe(el));
    scaleElements.forEach((el) => scaleObserver.observe(el));
    parallaxElements.forEach((el) => parallaxObserver.observe(el));

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

    // Smooth scroll parallax effect
    const handleScroll = () => {
      const scrollY = window.scrollY;
      parallaxElements.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.5;
        const rect = el.getBoundingClientRect();
        const elementTop = rect.top + scrollY;
        const relativeY = (scrollY - elementTop) * speed;
        el.style.transform = `translateY(${relativeY}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      revealObserver.disconnect();
      fadeObserver.disconnect();
      slideObserver.disconnect();
      scaleObserver.disconnect();
      parallaxObserver.disconnect();
      cards.forEach((card) => {
        card.removeEventListener('mousemove', handleTilt);
        card.removeEventListener('mouseleave', resetTilt);
      });
      window.removeEventListener('scroll', handleScroll);
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
