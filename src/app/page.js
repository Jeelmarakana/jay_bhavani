'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { buildWhatsAppUrl, DEFAULT_WHATSAPP_URL } from '@/lib/config';
import { submitInquiry, openOwnerWhatsAppNotify } from '@/lib/inquiry';
import styles from './page.module.css';

const categories = [
  { name: 'Rings', slug: 'rings', image: '/images/categories/rings.jpg' },
  { name: 'Necklaces & Har', slug: 'necklaces', image: '/images/categories/necklaces.jpg' },
  { name: 'Earrings', slug: 'earrings', image: '/images/categories/earrings.jpg' },
  { name: 'Bangles & Bracelets', slug: 'bangles', image: '/images/categories/bangles.jpg' },
  { name: 'Mangalsutra', slug: 'mangalsutra', image: '/images/categories/mangalsutra.jpg' },
  { name: 'Bridal Sets', slug: 'bridal-sets', image: '/images/categories/bridal-sets.jpg' },
  { name: 'Silver Jewellery', slug: 'silver', image: '/images/categories/silver.jpg' },
];

const trustPoints = [
  '22K Gold Jewellery',
  'Transparent Pricing',
  'Custom Jewellery',
  'Trusted Craftsmanship',
  'Purity Check',
];

const reviews = [
  { name: 'Aarohi Patel', quote: 'The bridal set was exactly what we wanted. The design felt grand but still elegant and very personal.', rating: 5 },
  { name: 'Pratik Shah', quote: 'Their pricing transparency and quality gave us total confidence. We felt respected throughout the buying process.', rating: 5 },
  { name: 'Nisha Desai', quote: 'From quick WhatsApp replies to the final fitting, the experience was smooth and reassuring.', rating: 5 },
];

const gallery = [
  '/images/products/diamond-solitaire-ring.jpg',
  '/images/products/bridal-wedding-set.jpg',
  '/images/products/ruby-temple-studs.jpg',
  '/images/products/silver-peacock-earrings.jpg',
  '/images/products/gold-bangles-set.jpg',
  '/images/products/antique-kundan-necklace.jpg',
  '/images/products/gold-jhumka-earrings.jpg',
  '/images/products/gold-engagement-ring.jpg',
  '/images/products/gold-mangalsutra.jpg',
];

export default function Home() {
  const [rates, setRates] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [formData, setFormData] = useState({ name: '', phone: '', interestedIn: 'Rings', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: null, message: '' });

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch('/api/gold-rate');
        const data = await res.json();
        if (data.success) {
          setRates(data.rates);
        } else {
          setRates({ error: true });
        }
      } catch (err) {
        console.error('Error fetching rates:', err);
        setRates({ error: true });
      }
    };

    fetchRates();
    const interval = setInterval(fetchRates, 15000);
    return () => clearInterval(interval);
  }, []);

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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      setSubmitStatus({ success: false, message: 'Please fill in your name, mobile number and enquiry message.' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ success: null, message: '' });

    try {
      const { data } = await submitInquiry(formData);

      if (data.success) {
        setSubmitStatus({
          success: true,
          message: 'Thank you! Your enquiry has been sent. Our team at 9054049570 will contact you shortly.',
        });
        setFormData({ name: '', phone: '', interestedIn: 'Rings', message: '' });
        if (data.notifyUrl) openOwnerWhatsAppNotify(data.notifyUrl);
      } else {
        setSubmitStatus({ success: false, message: data.error || 'Failed to send enquiry.' });
      }
    } catch (error) {
      setSubmitStatus({ success: false, message: 'Something went wrong. Please try again or send us a WhatsApp message.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatRate = (value) => {
    if (value === undefined || value === null || Number.isNaN(value)) {
      return '—';
    }
    return `₹${Number(value).toLocaleString('en-IN')}`;
  };

  const rateDateLabel = rates && rates.timestamp ? new Date(rates.timestamp).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }) : 'Today';

  return (
    <div className={styles.homeContainer}>
      <section className={styles.hero} style={{ '--bg-image': "url('/images/hero-banner.jpg')" }}>
        <div className={`${styles.heroContent} container`} data-3d-parallax="32">
          <span className={styles.heroSubtitle}>Digital Showroom + WhatsApp Sales Machine</span>
          <h1 className={`${styles.heroTitle} serif-title`}>
            સોનાની સુંદરતા, વિશ્વાસ સાથે.
          </h1>
          <p className={styles.heroText}>
            22K Gold • Diamond • Bridal • Antique Jewellery — Kamrej, Surat માં તમારા પરિવાર માટે વિશ્વાસપાત્ર jewellery collection.
          </p>
          <div className={styles.heroBtns}>
            <Link href="#shop-by-category" className="gold-btn">Explore Collection</Link>
            <a href={DEFAULT_WHATSAPP_URL} className="outline-btn" target="_blank" rel="noreferrer">WhatsApp Us</a>
          </div>
        </div>
      </section>

      <section id="rates-section" className={styles.ratesSection} data-3d-reveal>
        <div className="container">
          <div className={styles.ratesCard}>
            <div className={styles.ratesHeader}>
              <span className={styles.pulseDot}></span>
              <h2 className="serif-title" style={{ fontSize: '1.2rem', letterSpacing: '0.05em' }}>Today&apos;s Gold Rate — Kamrej, Surat</h2>
            </div>
            <div className={styles.ratesGrid}>
              <div className={styles.rateBox}>
                <span className={styles.rateLabel}>24K Gold / 10g</span>
                <span className={styles.rateVal}>{rates && !rates.error ? formatRate(rates.gold24k) : 'Rates unavailable'}</span>
              </div>
              <div className={styles.rateBox}>
                <span className={styles.rateLabel}>22K Gold / 10g</span>
                <span className={styles.rateVal}>{rates && !rates.error ? formatRate(rates.gold22k) : 'Rates unavailable'}</span>
              </div>
              <div className={styles.rateBox}>
                <span className={styles.rateLabel}>18K Gold / 10g</span>
                <span className={styles.rateVal}>{rates && !rates.error ? formatRate(rates.gold18k) : 'Rates unavailable'}</span>
              </div>
              <div className={styles.rateBox}>
                <span className={styles.rateLabel}>Silver / 100g</span>
                <span className={styles.rateVal}>{rates && !rates.error ? formatRate((rates.silver || 0) * 10) : 'Rates unavailable'}</span>
              </div>
            </div>
            <p className={styles.ratesDisclaimer}>
              Updated: {rateDateLabel} • Rates are indicative and may vary at store.
            </p>
          </div>
        </div>
      </section>

      <section id="shop-by-category" className={styles.section} data-3d-reveal>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={`${styles.sectionTitle} serif-title`}>Shop by Category</h2>
            <div className={styles.titleDivider}></div>
          </div>
          <div className={`${styles.categoriesGrid} stagger-3d`}>
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/shop?category=${category.slug}`}
                className={`${styles.categoryCard} animate-3d-float`}
                data-3d-tilt
                style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.8) 20%, rgba(0,0,0,0.1) 80%), url('${category.image}')` }}
              >
                <span className={`${styles.categoryName} serif-title`}>{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.darkBg}`} data-3d-reveal>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={`${styles.sectionTitle} serif-title`}>Our Signature Collection</h2>
            <div className={styles.titleDivider}></div>
          </div>
          <div className="grid-4 stagger-3d">
            {featuredProducts.map((product) => (
              <div key={product.id} className="card" data-3d-tilt data-3d-lift>
                <div className={styles.productImgWrapper}>
                  <img src={product.image} alt={product.name} className={styles.productImg} />
                  <span className={styles.metalTag}>{product.metal}</span>
                </div>
                <div className={styles.productInfo}>
                  <span className={styles.productCategory}>{product.categoryName}</span>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <div className={styles.productFooter}>
                    <span className={styles.productWeight}>{product.weight}g | {product.purity}</span>
                    <Link href={`/product/${product.id}`} className={styles.viewLink}>View Details →</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="bridal" className={styles.bridalSection} data-3d-reveal>
        <div className="container">
          <div className={styles.bridalLayout}>
            <div className={styles.bridalContent}>
              <span className={styles.kicker}>Bridal Jewellery</span>
              <h2 className="serif-title" style={{ fontSize: '2.3rem', marginBottom: '1rem' }}>Bridal Jewellery, Made for Your Big Day</h2>
              <p>
                Traditional elegance meets modern craftsmanship. From red-carpet-worthy bridal sets to heirloom-worthy family pieces, every design is crafted with a balance of beauty, comfort, and lasting value.
              </p>
              <div className={styles.heroBtns}>
                <Link href="/shop?category=bridal-sets" className="gold-btn">Explore Bridal Collection</Link>
                <a href={buildWhatsAppUrl('Hi Jay Bhavani Ornaments, I would like to book a bridal consultation.')} className="outline-btn" target="_blank" rel="noreferrer">Book Bridal Consultation</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className={styles.section} data-3d-reveal>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={`${styles.sectionTitle} serif-title`}>Why Choose Jay Bhavani Ornaments?</h2>
            <div className={styles.titleDivider}></div>
          </div>
          <div className={`${styles.trustGrid} stagger-3d`}>
            {trustPoints.map((item) => (
              <div key={item} className={styles.trustCard} data-3d-depth>
                <span className={styles.checkmark}>✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.storySection} data-3d-reveal>
        <div className="container">
          <div className={styles.storyBox}>
            <div>
              <span className={styles.kicker}>Our Story</span>
              <h3 className="serif-title" style={{ fontSize: '2rem', marginBottom: '1rem' }}>A heritage of trust, detail and craftsmanship.</h3>
            </div>
            <p>
              Jay Bhavani Ornaments brings together family values, meticulous craftsmanship and a deep understanding of jewellery that is meant to be treasured. Serving families in Kamrej and across Surat, we focus on purity, personalised guidance and pieces that celebrate life&apos;s important moments.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.section} data-3d-reveal>
        <div className="container">
          <div className={styles.customCTA} data-3d-depth>
            <div>
              <span className={styles.kicker}>Custom Jewellery</span>
              <h3 className="serif-title" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Have a design in mind?</h3>
            </div>
            <a href={buildWhatsAppUrl('Hi Jay Bhavani Ornaments, I have a design in mind. Please share details.')} className="gold-btn" target="_blank" rel="noreferrer">Send Your Design on WhatsApp</a>
          </div>
        </div>
      </section>

      <section className={styles.section} data-3d-reveal>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={`${styles.sectionTitle} serif-title`}>What Our Customers Say</h2>
            <div className={styles.titleDivider}></div>
          </div>
          <div className={`${styles.reviewGrid} stagger-3d`}>
            {reviews.map((review) => (
              <div key={review.name} className={styles.reviewCard} data-3d-tilt="6">
                <div className={styles.stars}>★★★★★</div>
                <p>“{review.quote}”</p>
                <strong>{review.name}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} data-3d-reveal>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={`${styles.sectionTitle} serif-title`}>Follow Our Latest Designs</h2>
            <div className={styles.titleDivider}></div>
          </div>
          <div className={`${styles.instagramGrid} stagger-3d`}>
            {gallery.map((img, index) => (
              <img key={`${img}-${index}`} src={img} alt="Latest jewellery design at Jay Bhavani Ornaments" className={styles.instagramImage} loading="lazy" data-3d-depth />
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className={styles.section} data-3d-reveal>
        <div className="container">
          <div className={styles.visitCard}>
            <div className={styles.visitContent}>
              <span className={styles.kicker}>Visit Our Showroom</span>
              <h3 className="serif-title" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Visit Our Showroom</h3>
              <p>📍 Jay Bhavani Ornaments, Shop No. 103, Vastu Palace-B, Pasodra Patiya, Kamrej, Surat</p>
              <p>🕐 Mon–Sat: 11:00 AM – 8:30 PM</p>
              <div className={styles.heroBtns}>
                <a href="https://maps.google.com/?q=Shop No. 103, Vastu Palace-B, Pasodra Patiya, Kamrej, Surat" className="gold-btn" target="_blank" rel="noreferrer">Get Directions</a>
                <a href={buildWhatsAppUrl('Hi Jay Bhavani Ornaments, I would like to visit the showroom.')} className="outline-btn" target="_blank" rel="noreferrer">WhatsApp for Visit</a>
              </div>
            </div>
            <div className={styles.mapWrap}>
              <iframe
                title="Jay Bhavani Ornaments location"
                src="https://maps.google.com/maps?q=shop%20no.%20103%20vasto%20palace-b%20pasodra%20patiya%20kamrej%20surat&t=&z=15&ie=UTF8&iwloc=&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.finalCTASection} data-3d-reveal>
        <div className="container">
          <div className={styles.finalCTA}>
            <h3 className="serif-title" style={{ fontSize: '2.1rem', marginBottom: '1rem' }}>Your perfect ornament is waiting.</h3>
            <a href={buildWhatsAppUrl('Hi Jay Bhavani Ornaments, I am interested in your jewellery collection.')} className="gold-btn" target="_blank" rel="noreferrer">WhatsApp Us</a>
          </div>
        </div>
      </section>

      <section className={styles.section} data-3d-reveal>
        <div className="container">
          <div className={styles.enquiryGrid}>
            <div className={styles.enquiryInfo}>
              <span className={styles.kicker}>Quick Enquiry</span>
              <h3 className="serif-title" style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>Tell us what you are looking for</h3>
              <p>Choose a category, share your preferred design type, and our team will guide you with the right options and latest pricing.</p>
              <p className={styles.optionalText}>Login to save your enquiries and wishlist. Login is optional and never required for a quote.</p>
            </div>
            <div className={`${styles.enquiryFormWrap} glassmorphism`} data-3d-tilt>
              {submitStatus.message && (
                <div className={`${styles.statusMsg} ${submitStatus.success ? styles.successMsg : styles.errorMsg}`}>
                  {submitStatus.message}
                </div>
              )}

              <form onSubmit={handleFormSubmit}>
                <div className="grid-2" style={{ gap: '1rem', marginBottom: '0.8rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="form-control" placeholder="Your name" required />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Mobile / WhatsApp *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="form-control" placeholder="Mobile number" required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Interested In</label>
                  <select name="interestedIn" value={formData.interestedIn} onChange={handleInputChange} className="form-control">
                    <option>Rings</option>
                    <option>Necklaces & Har</option>
                    <option>Earrings</option>
                    <option>Bangles & Bracelets</option>
                    <option>Mangalsutra</option>
                    <option>Bridal Sets</option>
                    <option>Silver Jewellery</option>
                    <option>Custom Design</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea name="message" value={formData.message} onChange={handleInputChange} rows="4" className="form-control" placeholder="Tell us your preferred style, metal or occasion" required />
                </div>
                <button type="submit" className="gold-btn" style={{ width: '100%' }} disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Enquiry'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
