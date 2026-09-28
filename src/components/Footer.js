import Link from 'next/link';
import { DEFAULT_WHATSAPP_URL, INSTAGRAM_URL, SHOP_PHONE_DISPLAY, SHOP_WHATSAPP } from '@/lib/config';
import ThemeToggle from './ThemeToggle';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.container} container`}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoText}>JAY BHAVANI</span>
              <span className={styles.logoSubtext}>ORNAMENTS</span>
            </Link>
            <p className={styles.description}>
              Digital Showroom + WhatsApp Sales Machine — premium 22K gold, bridal and antique jewellery in Kamrej, Surat.
            </p>
            <div className={styles.social}>
              <a href={DEFAULT_WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">WhatsApp</a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram">Instagram</a>
              <a href="https://maps.google.com/?q=Shop No. 103, Vastu Palace-B, Pasodra Patiya, Kamrej, Surat" target="_blank" rel="noopener noreferrer" aria-label="Google Maps">Maps</a>
            </div>
          </div>

          <div className={styles.links}>
            <h3 className={styles.title}>Categories</h3>
            <ul className={styles.list}>
              <li><Link href="/shop?category=rings">Rings</Link></li>
              <li><Link href="/shop?category=necklaces">Necklaces & Har</Link></li>
              <li><Link href="/shop?category=earrings">Earrings</Link></li>
              <li><Link href="/shop?category=bangles">Bangles & Bracelets</Link></li>
              <li><Link href="/shop?category=bridal-sets">Bridal Sets</Link></li>
            </ul>
          </div>

          <div className={styles.links}>
            <h3 className={styles.title}>Quick Links</h3>
            <ul className={styles.list}>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/shop">Collections</Link></li>
              <li><Link href="/#rates-section">Gold Rates</Link></li>
              <li><Link href="/#about">About Us</Link></li>
              <li><Link href="/#contact">Contact</Link></li>
              <li><Link href="/wishlist">My Wishlist</Link></li>
            </ul>
          </div>

          <div className={styles.contact}>
            <h3 className={styles.title}>Our Boutique</h3>
            <p className={styles.contactItem}>
              <strong>Address:</strong> Jay Bhavani Ornaments, Shop No. 103, Vastu Palace-B, Pasodra Patiya, Kamrej, Surat.{' '}
              <a href="https://maps.google.com/?q=Shop No. 103, Vastu Palace-B, Pasodra Patiya, Kamrej, Surat" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold)', textDecoration: 'underline' }}>Map</a>
            </p>
            <p className={styles.contactItem}>
              <strong>Phone:</strong>{' '}
              <a href={`tel:+${SHOP_WHATSAPP}`}>{SHOP_PHONE_DISPLAY}</a> ·{' '}
              <a href={DEFAULT_WHATSAPP_URL} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold)', textDecoration: 'underline' }}>WhatsApp</a>
            </p>
            <p className={styles.contactItem}>
              <strong>Email:</strong> info@jaybhavani_ornaments.com
            </p>
            <p className={styles.contactItem}>
              <strong>Hours:</strong> Mon – Sat: 11:00 AM – 8:30 PM
            </p>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Jay Bhavani Ornaments. All rights reserved.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <ThemeToggle showLabel={true} />
            <div className={styles.policies}>
              <Link href="/#contact">Privacy & Policies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
