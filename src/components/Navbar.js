'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop Catalog', path: '/shop' },
    { name: 'Admin Dashboard', path: '/admin' },
  ];

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`${styles.container} container`}>
        <Link href="/" className={styles.logo} onClick={closeMenu}>
          <span className={styles.logoText}>JAY BHAVANI</span>
          <span className={styles.logoSubtext}>O R N A M E N T S</span>
        </Link>

        {/* Desktop Menu */}
        <nav className={styles.desktopNav}>
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link 
                key={link.path} 
                href={link.path} 
                className={`${styles.navLink} ${isActive ? styles.active : ''}`}
              >
                {link.name}
              </Link>
            );
          })}
          <Link href="/shop" className="gold-btn" style={{ padding: '0.5rem 1.5rem', fontSize: '0.8rem' }}>
            Explore
          </Link>
        </nav>

        {/* Mobile Hamburger Button */}
        <button 
          className={`${styles.hamburger} ${isOpen ? styles.hamburgerActive : ''}`} 
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </button>

        {/* Mobile Navigation Drawer */}
        <div className={`${styles.mobileDrawer} ${isOpen ? styles.drawerOpen : ''}`}>
          <nav className={styles.mobileNav}>
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link 
                  key={link.path} 
                  href={link.path} 
                  className={`${styles.mobileNavLink} ${isActive ? styles.mobileActive : ''}`}
                  onClick={closeMenu}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link 
              href="/shop" 
              className="gold-btn" 
              onClick={closeMenu} 
              style={{ width: '100%', marginTop: '1rem', textAlign: 'center' }}
            >
              Explore
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
