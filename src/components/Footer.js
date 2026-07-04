import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.container} container`}>
        <div className={styles.grid}>
          {/* Brand Info */}
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoText}>JAY BHAVANI</span>
              <span className={styles.logoSubtext}>O R N A M E N T S</span>
            </Link>
            <p className={styles.description}>
              Crafting stories of elegance and heritage through our premium gold and diamond jewellery collections. Experience the legacy of trust and craftsmanship.
            </p>
          </div>

          {/* Jewellery Categories */}
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

          {/* Quick Links */}
          <div className={styles.links}>
            <h3 className={styles.title}>Quick Links</h3>
            <ul className={styles.list}>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/shop">Shop Catalog</Link></li>
              <li><Link href="/admin">Admin Dashboard</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className={styles.contact}>
            <h3 className={styles.title}>Our Boutique</h3>
            <p className={styles.contactItem}>
              <strong>Address:</strong> Jay Bhavani Ornaments, Shop No. 103, Vastu Palace-B, Pasodra Patiya, Kamrej, Surat. <a href="https://maps.google.com/?q=Shop No. 103, Vastu Palace-B, Pasodra Patiya, Kamrej, Surat" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-gold)', textDecoration: 'underline' }}>Map</a>
            </p>
            <p className={styles.contactItem}>
              <strong>Phone:</strong> <a href="tel:+919898426635">📞 98984 26635</a> · <a href="https://wa.me/919898426635" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-gold)', textDecoration: 'underline' }}>WhatsApp</a>
            </p>
            <p className={styles.contactItem}>
              <strong>Email:</strong> info@jaybhavaniornaments.com
            </p>
            <p className={styles.contactItem}>
              <strong>Hours:</strong> Mon - Sat: 11:00 AM - 8:30 PM
            </p>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} Jay Bhavani Ornaments. All Rights Reserved. Designed for elegance.
          </p>
        </div>
      </div>
    </footer>
  );
}
