'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getWishlist } from '@/lib/wishlist';
import { getClientSession, clearClientSession } from '@/lib/auth';
import { DEFAULT_WHATSAPP_URL } from '@/lib/config';
import ThemeToggle from './ThemeToggle';
import styles from './Navbar.module.css';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Collections', path: '/shop' },
  { name: 'Bridal', path: '/shop?category=bridal-sets' },
  { name: 'Gold Rates', hash: 'rates-section' },
  { name: 'About Us', hash: 'about' },
  { name: 'Contact', hash: 'contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [clientUser, setClientUser] = useState(null);
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
    const updateAuth = () => {
      setClientUser(getClientSession());
    };
    updateAuth();
    window.addEventListener('client-auth-updated', updateAuth);
    window.addEventListener('storage', updateAuth);
    return () => {
      window.removeEventListener('client-auth-updated', updateAuth);
      window.removeEventListener('storage', updateAuth);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    clearClientSession();
    setClientUser(null);
    window.dispatchEvent(new Event('client-auth-updated'));
    closeMenu();
  };

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
        {/* Logo - Left */}
        <Link href="/" className={styles.logo} onClick={handleLogoClick}>
          <span className={styles.logoText}>JAY BHAVANI</span>
          <span className={styles.logoSubtext}>ORNAMENTS</span>
        </Link>

        {/* Navigation Links - Center */}
        <nav className={styles.desktopNav}>
          {navLinks.map((link) => renderLink(link))}
        </nav>

        {/* Right Actions */}
        <div className={styles.rightActions}>
          <Link href="/wishlist" className={styles.wishlistLink} aria-label="My Wishlist">
            <span className={styles.wishlistIcon}>♡</span>
            {wishlistCount > 0 && <span className={styles.wishlistBadge}>{wishlistCount}</span>}
            <span className={styles.wishlistLabel}>Wishlist</span>
          </Link>

          {/* Theme Toggle Button */}
          <ThemeToggle showLabel={false} />

          {/* Auth State */}
          {clientUser ? (
            <div className={styles.authGroup}>
              <span className={styles.userBadge} title={clientUser.email || clientUser.name}>
                <span>👤</span>
                <span className={styles.userName}>{clientUser.name}</span>
              </span>
              <button onClick={handleLogout} className={styles.logoutBtn} title="Log Out">
                Logout
              </button>
            </div>
          ) : (
            <Link href="/auth/login" className={styles.authLink}>
              Login
            </Link>
          )}

          <a
            href={DEFAULT_WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="gold-btn"
            style={{ padding: '0.55rem 1.3rem', fontSize: '0.78rem' }}
          >
            WhatsApp
          </a>
        </div>

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

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem 0' }}>
              <ThemeToggle showLabel={true} />
            </div>

            <div className={styles.mobileAuthGroup}>
              {clientUser ? (
                <>
                  <div className={styles.userBadge} style={{ alignSelf: 'flex-start' }}>
                    <span>👤</span>
                    <span>{clientUser.name}</span>
                  </div>
                  <button onClick={handleLogout} className={styles.logoutBtn} style={{ width: '100%', padding: '0.6rem' }}>
                    Logout
                  </button>
                </>
              ) : (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link href="/auth/login" className={styles.authLink} style={{ flex: 1, textAlign: 'center' }} onClick={closeMenu}>
                    Login
                  </Link>
                  <Link href="/auth/register" className={styles.authLink} style={{ flex: 1, textAlign: 'center' }} onClick={closeMenu}>
                    Register
                  </Link>
                </div>
              )}
            </div>

            <a
              href={DEFAULT_WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="gold-btn"
              style={{ width: '100%', marginTop: '0.8rem', textAlign: 'center' }}
              onClick={closeMenu}
            >
              WhatsApp
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
