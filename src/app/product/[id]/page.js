'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { submitInquiry, openOwnerWhatsAppNotify } from '@/lib/inquiry';
import { SHOP_PHONE_DISPLAY } from '@/lib/config';
import styles from './page.module.css';

export default function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Inquiry Form state
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: null, message: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product details
        const prodRes = await fetch(`/api/products/${id}`);
        const prodData = await prodRes.json();
        
        if (!prodData.success) {
          setError(prodData.error || 'Product not found');
          setLoading(false);
          return;
        }
        setProduct(prodData.product);

        // Fetch daily rates
        const rateRes = await fetch('/api/gold-rate');
        const rateData = await rateRes.json();
        if (rateData.success) {
          setRates(rateData.rates);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching detail data:', err);
        setError('Failed to load product details.');
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // Initializing inquiry message once product is loaded
  useEffect(() => {
    if (product) {
      setFormData((prev) => ({
        ...prev,
        message: `Hello, I am interested in inquiring about "${product.name}" (Product ID: ${product.id}, Weight: ${product.weight}g). Please provide availability details.`,
      }));
    }
  }, [product]);

  // Calculate detailed approximate price breakdown
  const calculatePrice = () => {
    if (!product || !rates) return null;

    let ratePerGram = 0;
    let baseMetalValue = 0;
    let diamondCharges = 0;

    if (product.metal.toLowerCase().includes('gold')) {
      if (product.purity === '22K') ratePerGram = rates.gold22k;
      else if (product.purity === '18K') ratePerGram = rates.gold18k;
      else ratePerGram = rates.gold24k;
      
      baseMetalValue = product.weight * ratePerGram;
    } else if (product.metal.toLowerCase().includes('silver')) {
      ratePerGram = rates.silver;
      baseMetalValue = product.weight * ratePerGram;
    } else if (product.metal.toLowerCase().includes('diamond')) {
      // 18k gold is used as base for diamond settings
      ratePerGram = rates.gold18k;
      baseMetalValue = product.weight * ratePerGram;
      // Flat mock diamond value component based on weight
      diamondCharges = product.weight * 12000; 
    } else {
      // Fallback
      ratePerGram = rates.gold22k;
      baseMetalValue = product.weight * ratePerGram;
    }

    const makingChargesValue = baseMetalValue * (product.makingCharges / 100);
    const subtotal = baseMetalValue + makingChargesValue + diamondCharges;
    const gstValue = subtotal * 0.03; // 3% GST
    const totalEstimated = subtotal + gstValue;

    return {
      ratePerGram: Math.round(ratePerGram),
      metalValue: Math.round(baseMetalValue),
      diamondValue: Math.round(diamondCharges),
      makingCharges: Math.round(makingChargesValue),
      gst: Math.round(gstValue),
      total: Math.round(totalEstimated)
    };
  };

  const priceBreakdown = calculatePrice();

  // Submit Inquiry Form
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
      const { data } = await submitInquiry({
        ...formData,
        productId: product.id,
        productName: product.name,
      });

      if (data.success) {
        setSubmitStatus({
          success: true,
          message: `Thank you! Your product enquiry has been sent. We will get back to you shortly or call you at ${SHOP_PHONE_DISPLAY}.`,
        });
        setFormData({
          name: '',
          phone: '',
          email: '',
          message: `Hello, I am interested in inquiring about "${product.name}" (Product ID: ${product.id}, Weight: ${product.weight}g).`,
        });
        if (data.notifyUrl) openOwnerWhatsAppNotify(data.notifyUrl);
      } else {
        setSubmitStatus({ success: false, message: data.error || 'Failed to submit enquiry.' });
      }
    } catch (err) {
      setSubmitStatus({ success: false, message: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-loader" suppressHydrationWarning>
        <div className="loader-content" suppressHydrationWarning>
          <div className="loader-spinner" suppressHydrationWarning></div>
          <p className="loader-text" suppressHydrationWarning>Loading Product Details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: '8rem 2rem', textAlign: 'center' }}>
        <h2 className="serif-title" style={{ color: 'var(--error)' }}>Error</h2>
        <p style={{ margin: '1rem 0 2rem', color: 'var(--text-secondary)' }}>{error || 'The requested product could not be found.'}</p>
        <Link href="/shop" className="gold-btn">Back to Shop Catalog</Link>
      </div>
    );
  }

  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Shop', href: '/shop' },
          { label: product.categoryName, href: `/shop?category=${product.category}` },
          { label: product.name },
        ]}
      />
      <div className="container" style={{ padding: '1.5rem 2rem 5rem' }}>
        <div className={styles.detailLayout}>
          {/* Left Side: Product Image */}
          <div className={styles.imageGallery}>
            <div className={`${styles.mainImageWrapper} glassmorphism`}>
              <img src={product.image} alt={product.name} className={styles.mainImage} />
              <span className={styles.purityBadge}>{product.purity} Purity</span>
            </div>
          </div>

          {/* Right Side: Specifications & Calculations */}
          <div className={styles.infoDetails}>
            <span className={styles.categoryTag}>{product.categoryName}</span>
            <h1 className={`${styles.productName} serif-title`}>{product.name}</h1>

            <div className={styles.specificationBox}>
              <h3 className={styles.specTitle}>Specifications</h3>
              <table className={styles.specTable}>
                <tbody>
                  <tr>
                    <td>Product ID</td>
                    <td><strong>#{product.id}</strong></td>
                  </tr>
                  <tr>
                    <td>Metal Type</td>
                    <td>{product.metal}</td>
                  </tr>
                  <tr>
                    <td>Gold Purity</td>
                    <td>{product.purity} (Hallmarked)</td>
                  </tr>
                  <tr>
                    <td>Gross Weight</td>
                    <td><strong>{product.weight} grams</strong></td>
                  </tr>
                  <tr>
                    <td>Making Charges</td>
                    <td>{product.makingCharges}%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={styles.descriptionSection}>
              <p>{product.description}</p>
            </div>

            {/* Pricing Estimation Section */}
            {priceBreakdown && (
              <div className={`${styles.priceBox} glassmorphism`}>
                <div className={styles.priceHeader}>
                  <span className={styles.pricingTitle}>Estimated Value Breakdown</span>
                  <span className={styles.liveTag}>Live Rates Applied</span>
                </div>
                <div className={styles.priceRow}>
                  <span>Base Metal Value ({product.weight}g @ ₹{priceBreakdown.ratePerGram}/g)</span>
                  <span>₹{priceBreakdown.metalValue.toLocaleString('en-IN')}</span>
                </div>
                {priceBreakdown.diamondValue > 0 && (
                  <div className={styles.priceRow}>
                    <span>Diamond Gem Charges</span>
                    <span>₹{priceBreakdown.diamondValue.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className={styles.priceRow}>
                  <span>Making Charges ({product.makingCharges}%)</span>
                  <span>₹{priceBreakdown.makingCharges.toLocaleString('en-IN')}</span>
                </div>
                <div className={styles.priceRow}>
                  <span>GST (3%)</span>
                  <span>₹{priceBreakdown.gst.toLocaleString('en-IN')}</span>
                </div>
                <div className={`${styles.priceRow} ${styles.totalRow}`}>
                  <span>Total Approximate Price</span>
                  <span className="gold-text">₹{priceBreakdown.total.toLocaleString('en-IN')}</span>
                </div>
                <p className={styles.priceNotice}>
                  *Calculations are approximate, based on live rate ₹{priceBreakdown.ratePerGram}/g. Making charges are calculated on base metal value. Final pricing depends on current rate at time of purchase.
                </p>
              </div>
            )}

            <div className={`${styles.detailInquiryForm} glassmorphism`}>
              <h3 className="serif-title" style={{ fontSize: '1.1rem', marginBottom: '1.2rem', color: 'var(--accent-gold)' }}>
                Send enquiry for this piece
              </h3>

              {submitStatus.message && (
                <div className={`${styles.statusMsg} ${submitStatus.success ? styles.successMsg : styles.errorMsg}`}>
                  {submitStatus.message}
                </div>
              )}

              <form onSubmit={handleFormSubmit}>
                <div className="grid-2" style={{ gap: '1rem', marginBottom: '0.8rem' }}>
                  <div className="form-group" style={{ marginBottom: '0' }}>
                    <label className="form-label">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Your name"
                      required
                      style={{ padding: '0.6rem 0.8rem', fontSize: '0.9rem' }}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '0' }}>
                    <label className="form-label">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Mobile number"
                      required
                      style={{ padding: '0.6rem 0.8rem', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: '0.8rem' }}>
                  <label className="form-label">Inquiry Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="3"
                    className="form-control"
                    required
                    style={{ padding: '0.6rem 0.8rem', fontSize: '0.9rem' }}
                  />
                </div>
                <p style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  Login is optional and never required for a price quote or showroom visit.
                </p>
                <button
                  type="submit"
                  className="outline-btn"
                  style={{ width: '100%', padding: '0.6rem', fontSize: '0.8rem' }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending Request...' : 'Send Enquiry'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
