'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getWishlist } from '@/lib/wishlist';
import styles from './Navbar.module.css';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Collections', path: '/shop' },
  { name: 'Bridal', path: '/shop?category=bridal-sets' },
  { name: 'Gold Rates', hash: 'rates-section' },
  { name: 'About Us', hash: 'about' },
  { name: 'Contact', hash: 'contact' },
];

const WHATSAPP_URL = 'https://wa.me/919898426635?text=Hi%20Jay%20Bhavani%20Ornaments%2C%20I%20would%20like%20to%20enquire%20about%20your%20collection.';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateCount = () => setWishlistCount(getWishlist().length);
    updateCount();
    window.addEventListener('wishlist-updated', updateCount);
    return () => window.removeEventListener('wishlist-updated', updateCount);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  const handleLogoClick = (event) => {
    closeMenu();
    if (pathname === '/') {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getHashHref = (hash) => (pathname === '/' ? `#${hash}` : `/#${hash}`);

  const isActive = (link) => {
    if (link.hash) return pathname === '/';
    if (link.path === '/shop' && pathname.startsWith('/shop')) return true;
    if (link.path === '/wishlist' && pathname === '/wishlist') return true;
    return pathname === link.path;
  };

  const renderLink = (link, mobile = false) => {
    const active = isActive(link);
    const className = mobile
      ? `${styles.mobileNavLink} ${active ? styles.mobileActive : ''}`
      : `${styles.navLink} ${active ? styles.active : ''}`;

    if (link.hash) {
      return (
        <a key={link.hash} href={getHashHref(link.hash)} className={className} onClick={closeMenu}>
          {link.name}
        </a>
      );
    }

    return (
      <Link key={link.path} href={link.path} className={className} onClick={closeMenu}>
        {link.name}
      </Link>
    );
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`${styles.container} container`}>
        <Link href="/" className={styles.logo} onClick={handleLogoClick}>
          <span className={styles.logoText}>JAY BHAVANI</span>
          <span className={styles.logoSubtext}>ORNAMENTS</span>
        </Link>

        <nav className={styles.desktopNav}>
          {navLinks.map((link) => renderLink(link))}

          <Link href="/wishlist" className={styles.wishlistLink} aria-label="My Wishlist">
            <span className={styles.wishlistIcon}>♡</span>
            {wishlistCount > 0 && <span className={styles.wishlistBadge}>{wishlistCount}</span>}
            <span className={styles.wishlistLabel}>Wishlist</span>
          </Link>

          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="gold-btn" style={{ padding: '0.55rem 1.3rem', fontSize: '0.78rem' }}>
            WhatsApp
          </a>
        </nav>

        <button className={`${styles.hamburger} ${isOpen ? styles.hamburgerActive : ''}`} onClick={toggleMenu} aria-label="Toggle Menu">
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </button>

        <div className={`${styles.mobileDrawer} ${isOpen ? styles.drawerOpen : ''}`}>
          <nav className={styles.mobileNav}>
            {navLinks.map((link) => renderLink(link, true))}

            <Link href="/wishlist" className={styles.mobileNavLink} onClick={closeMenu}>
              ♡ Wishlist {wishlistCount > 0 ? `(${wishlistCount})` : ''}
            </Link>

            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="gold-btn" style={{ width: '100%', marginTop: '0.8rem', textAlign: 'center' }} onClick={closeMenu}>
              WhatsApp
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
