'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  const [rates, setRates] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: null, message: '' });

  // Fetch Gold Rates
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch('/api/gold-rate');
        const data = await res.json();
        if (data.success) {
          setRates(data.rates);
        }
      } catch (err) {
        console.error('Error fetching rates:', err);
      }
    };

    fetchRates();
    const interval = setInterval(fetchRates, 15000); // update every 15s to show dynamic tick
    return () => clearInterval(interval);
  }, []);

  // Fetch Featured Products
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('/api/products?featured=true');
        const data = await res.json();
        if (data.success) {
          setFeaturedProducts(data.products.slice(0, 4));
        }
      } catch (err) {
        console.error('Error fetching featured products:', err);
      }
    };
    fetchFeatured();
  }, []);

  // Handle Contact Form Submission
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      setSubmitStatus({ success: false, message: 'Please fill in all required fields.' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ success: null, message: '' });

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        setSubmitStatus({ success: true, message: 'Thank you! Your inquiry has been received. Our team will contact you shortly.' });
        setFormData({ name: '', phone: '', email: '', message: '' });
      } else {
        setSubmitStatus({ success: false, message: data.error || 'Failed to submit enquiry.' });
      }
    } catch (err) {
      setSubmitStatus({ success: false, message: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { name: 'Rings', slug: 'rings', image: '/images/products/gold-ring.jpg' },
    { name: 'Necklaces & Har', slug: 'necklaces', image: '/images/products/antique-necklace.jpg' },
    { name: 'Earrings', slug: 'earrings', image: '/images/products/royal-earrings.jpg' },
    { name: 'Bangles & Bracelets', slug: 'bangles', image: '/images/products/gold-bangles.jpg' },
    { name: 'Bridal Sets', slug: 'bridal-sets', image: '/images/products/bridal-set.jpg' },
  ];

  return (
    <div className={styles.homeContainer}>
      {/* Hero Section */}
      <section className={styles.hero} style={{ backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.2) 100%), url('/images/hero-banner.jpg')` }}>
        <div className={`${styles.heroContent} container animate-fade-in`}>
          <span className={styles.heroSubtitle}>Welcome to Jay Bhavani Ornaments</span>
          <h1 className={`${styles.heroTitle} serif-title`}>Crafting Pure Elegance</h1>
          <p className={styles.heroText}>
            Explore our curated collections of standard 22K Gold, brilliant Diamonds, and traditional Antique bridal jewellery set in unmatched craftsmanship.
          </p>
          <div className={styles.heroBtns}>
            <Link href="/shop" className="gold-btn">View Catalog</Link>
            <a href="#rates-section" className="outline-btn">Live Gold Rates</a>
          </div>
        </div>
      </section>

      {/* Gold Rates Live Ticker */}
      <section id="rates-section" className={styles.ratesSection}>
        <div className="container">
          <div className={styles.ratesCard}>
            <div className={styles.ratesHeader}>
              <span className={styles.pulseDot}></span>
              <h2 className="serif-title" style={{ fontSize: '1.2rem', letterSpacing: '0.05em' }}>Live Metal Estimator (Soni Bazar, Rajkot)</h2>
            </div>
            <div className={styles.ratesGrid}>
              <div className={styles.rateBox}>
                <span className={styles.rateLabel}>Gold 24K (Per 10g)</span>
                <span className={styles.rateVal}>{rates ? `₹${rates.gold24k.toLocaleString('en-IN')}` : 'Loading...'}</span>
              </div>
              <div className={styles.rateBox}>
                <span className={styles.rateLabel}>Gold 22K (Per 10g)</span>
                <span className={styles.rateVal}>{rates ? `₹${rates.gold22k.toLocaleString('en-IN')}` : 'Loading...'}</span>
              </div>
              <div className={styles.rateBox}>
                <span className={styles.rateLabel}>Gold 18K (Per 10g)</span>
                <span className={styles.rateVal}>{rates ? `₹${rates.gold18k.toLocaleString('en-IN')}` : 'Loading...'}</span>
              </div>
              <div className={styles.rateBox}>
                <span className={styles.rateLabel}>Silver (Per 100g)</span>
                <span className={styles.rateVal}>{rates ? `₹${(rates.silver * 10).toLocaleString('en-IN')}` : 'Loading...'}</span>
              </div>
            </div>
            <p className={styles.ratesDisclaimer}>*Rates fluctuate live. Use as approximate guides. Current time: {rates ? new Date(rates.timestamp).toLocaleTimeString() : '...'}</p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={`${styles.sectionTitle} serif-title`}>Shop By Category</h2>
            <div className={styles.titleDivider}></div>
          </div>
          <div className={styles.categoriesGrid}>
            {categories.map((cat) => (
              <Link 
                key={cat.slug} 
                href={`/shop?category=${cat.slug}`} 
                className={styles.categoryCard}
                style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0.1) 80%), url('${cat.image}')` }}
              >
                <span className={`${styles.categoryName} serif-title`}>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className={`${styles.section} ${styles.darkBg}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={`${styles.sectionTitle} serif-title`}>Signature Masterpieces</h2>
            <div className={styles.titleDivider}></div>
          </div>
          <div className="grid-4">
            {featuredProducts.map((product) => (
              <div key={product.id} className="card">
                <div className={styles.productImgWrapper}>
                  <img src={product.image} alt={product.name} className={styles.productImg} />
                  <span className={styles.metalTag}>{product.metal}</span>
                </div>
                <div className={styles.productInfo}>
                  <span className={styles.productCategory}>{product.categoryName}</span>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <div className={styles.productFooter}>
                    <span className={styles.productWeight}>{product.weight}g | {product.purity}</span>
                    <Link href={`/product/${product.id}`} className={styles.viewLink}>View Details &rarr;</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Heritage / Story */}
      <section className={styles.heritageSection} style={{ backgroundImage: `linear-gradient(to right, rgba(18,18,20,0.95), rgba(18,18,20,0.7)), url('/images/hero-banner.jpg')` }}>
        <div className="container">
          <div className={styles.heritageContent}>
            <h2 className="serif-title gold-text" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Our Heritage & Legacy</h2>
            <p>
              Located in the heart of Soni Bazar in Rajkot, **Jay Bhavani Ornaments** stands as an emblem of purity, trust, and intricate artistry. For decades, our master artisans have breathed life into precious metals, creating heirloom ornaments that stay passed down through generations.
            </p>
            <p style={{ marginTop: '1rem' }}>
              We specialize in custom bridal designs, antique Kundan masterpieces, and lightweight contemporary gold jewellery, ensuring that every customer experiences perfection in design and transparency in pricing.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Contact Inquiry */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.inquiryGrid}>
            <div className={styles.inquiryInfo}>
              <h2 className="serif-title" style={{ marginBottom: '1rem' }}>Visit Or Enquire</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Have questions about custom order designs, rates, or purity checks? Drop us a message, or request a design consultation with our specialists.
              </p>
              <div className={styles.infoBlock}>
                <h4>Boutique Location</h4>
                <p>Shop No. 103, Vastu Palace-B, Pasodra Patiya, Kamrej, Surat. <a href="https://maps.google.com/?q=Shop No. 103, Vastu Palace-B, Pasodra Patiya, Kamrej, Surat" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-gold)', textDecoration: 'underline' }}>Map</a></p>
              </div>
              <div className={styles.infoBlock}>
                <h4>Call / WhatsApp</h4>
                <p>
                  <a href="tel:+919898426635">📞 98984 26635</a> ·{' '}
                  <a href="https://wa.me/919898426635" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-gold)', textDecoration: 'underline' }}>WhatsApp</a>
                </p>
              </div>
              <div className={styles.infoBlock}>
                <h4>Email Support</h4>
                <p>info@jaybhavaniornaments.com</p>
              </div>
            </div>
            <div className={`${styles.inquiryFormWrapper} glassmorphism`}>
              <h3 className="serif-title" style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--accent-gold)' }}>Send Online Inquiry</h3>
              
              {submitStatus.message && (
                <div className={`${styles.statusMsg} ${submitStatus.success ? styles.successMsg : styles.errorMsg}`}>
                  {submitStatus.message}
                </div>
              )}

              <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    className="form-control" 
                    placeholder="Enter your name" 
                    required 
                  />
                </div>
                <div className="grid-2" style={{ gap: '1rem', marginBottom: '0' }}>
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleInputChange} 
                      className="form-control" 
                      placeholder="Your mobile number" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      className="form-control" 
                      placeholder="Optional" 
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Message / Inquiry *</label>
                  <textarea 
                    name="message" 
                    value={formData.message} 
                    onChange={handleInputChange} 
                    rows="4" 
                    className="form-control" 
                    placeholder="What style or item are you looking for?" 
                    required
                  ></textarea>
                </div>
                <button type="submit" className="gold-btn" style={{ width: '100%' }} disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Submit Inquiry'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
