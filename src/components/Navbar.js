'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getClientSession, clearClientSession, getAdminSession } from '@/lib/auth';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [clientUser, setClientUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [toast, setToast] = useState({ show: false, success: true, message: '' });
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const msg = sessionStorage.getItem('logout_toast');
      if (msg) {
        setToast({ show: true, success: true, message: msg });
        sessionStorage.removeItem('logout_toast');
        const timer = setTimeout(() => {
          setToast({ show: false, success: true, message: '' });
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

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

  useEffect(() => {
    const session = getClientSession();
    setClientUser(session);
    const adminSession = getAdminSession();
    setIsAdmin(Boolean(adminSession?.username));
  }, [pathname]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    clearClientSession();
    setClientUser(null);
    closeMenu();
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('logout_toast', 'Logged out successfully.');
    }
    window.location.href = '/';
  };

  const handleLogoClick = (e) => {
    closeMenu();
    if (pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const baseLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop Catalog', path: '/shop' },
  ];
  const navLinks = isAdmin ? [...baseLinks, { name: 'Admin Dashboard', path: '/admin' }] : baseLinks;

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className={`${styles.container} container`}>
          <Link href="/" className={styles.logo} onClick={handleLogoClick}>
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

            {clientUser ? (
              <>
                <span className={styles.navLink} style={{ cursor: 'default', opacity: 0.9 }}>
                  Hi {clientUser.name}
                </span>
                <button className="outline-btn" type="button" onClick={handleLogout} style={{ padding: '0.45rem 1rem', fontSize: '0.72rem' }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className={styles.navLink}>
                  Login
                </Link>
                <Link href="/auth/register" className={styles.navLink}>
                  Register
                </Link>
              </>
            )}

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

              {clientUser ? (
                <>
                  <span className={styles.mobileNavLink} style={{ cursor: 'default', opacity: 0.9 }}>
                    Hi {clientUser.name}
                  </span>
                  <button className="outline-btn" type="button" onClick={handleLogout} style={{ width: '100%', marginTop: '1rem', textAlign: 'center' }}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className={styles.mobileNavLink} onClick={closeMenu}>
                    Login
                  </Link>
                  <Link href="/auth/register" className={styles.mobileNavLink} onClick={closeMenu}>
                    Register
                  </Link>
                </>
              )}

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

      {toast.show && (
        <div className={`${styles.toast} ${toast.success ? styles.success : styles.error}`}>
          <div className={styles.toastIcon}>
            <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <span className={styles.toastMessage}>{toast.message}</span>
        </div>
      )}
    </>
  );
}
