'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();

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
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          productId: product.id,
          productName: product.name
        }),
      });
      const data = await res.json();

      if (data.success) {
        setSubmitStatus({ success: true, message: 'Thank you! Your product enquiry has been sent. We will call you back.' });
        setFormData({ name: '', phone: '', email: '', message: `Hello, I am interested in inquiring about "${product.name}" (Product ID: ${product.id}, Weight: ${product.weight}g).` });
      } else {
        setSubmitStatus({ success: false, message: data.error || 'Failed to submit enquiry.' });
      }
    } catch (err) {
      setSubmitStatus({ success: false, message: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // WhatsApp pre-filled link
  const getWhatsAppLink = () => {
    if (!product) return '#';
    const number = '919898426635'; // Shop WhatsApp number
    const text = `Hi Jay Bhavani Ornaments, I am interested in inquiring about this product:\n\n*Product:* ${product.name}\n*ID:* ${product.id}\n*Category:* ${product.categoryName}\n*Weight:* ${product.weight}g\n*Purity:* ${product.purity}\n\n${priceBreakdown ? `*Approximate Estimate:* ₹${priceBreakdown.total.toLocaleString('en-IN')}\n\n` : ''}Please let me know the availability and current buying process.`;
    return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  };

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner}></div>
        <p>Loading master craftsmanship details...</p>
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
    <div className="container" style={{ padding: '3rem 2rem 5rem' }}>
      {/* Breadcrumbs */}
      <div className={styles.breadcrumbs}>
        <Link href="/">Home</Link> &gt; <Link href="/shop">Shop</Link> &gt; <Link href={`/shop?category=${product.category}`}>{product.categoryName}</Link> &gt; <span>{product.name}</span>
      </div>

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

          {/* Action Buttons */}
          <div className={styles.actionSection}>
            <a 
              href={getWhatsAppLink()} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`${styles.whatsappBtn} gold-btn`}
              style={{ display: 'flex', gap: '0.8rem', color: '#000000' }}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.431 2.522 1.22 3.52l-.794 2.899 2.966-.777c.955.651 2.09 1.003 3.375 1.004 3.182 0 5.768-2.587 5.769-5.766.002-3.18-2.585-5.766-5.768-5.766zm3.611 8.228c-.206.581-1.028 1.109-1.414 1.144-.386.035-.747.187-2.45-.487-2.179-.865-3.585-3.08-3.694-3.226-.109-.146-.889-1.182-.889-2.254 0-1.072.56-1.599.76-1.815.199-.216.436-.271.581-.271.145 0 .29.002.418.008.136.006.317-.052.496.381.186.449.634 1.547.69 1.658.056.111.093.24.019.387-.074.148-.112.24-.223.369-.111.13-.233.29-.333.389-.111.111-.228.232-.098.455.13.223.578.955 1.24 1.547.854.764 1.571 1.002 1.794 1.113.223.111.353.093.483-.056.13-.149.557-.65.706-.873.149-.223.298-.186.502-.111.204.074 1.293.61 1.516.721.223.111.371.167.427.262.056.096.056.554-.15 1.135zM12 2C6.477 2 2 6.477 2 12c0 2.03.606 3.917 1.647 5.49L2 22l4.653-1.22C8.12 21.353 9.97 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.834 0-3.551-.54-5.002-1.464l-.358-.22-2.753.722.735-2.686-.24-.383C3.473 14.502 3 12.802 3 12c0-4.963 4.037-9 9-9s9 4.037 9 9-4.037 9-9 9z"/>
              </svg>
              Enquire on WhatsApp
            </a>
          </div>

          {/* Inline Product Inquiry Form */}
          <div className={`${styles.detailInquiryForm} glassmorphism`}>
            <h3 className="serif-title" style={{ fontSize: '1.1rem', marginBottom: '1.2rem', color: 'var(--accent-gold)' }}>Request Callback / Customise Order</h3>
            
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
                ></textarea>
              </div>
              <button type="submit" className="outline-btn" style={{ width: '100%', padding: '0.6rem', fontSize: '0.8rem' }} disabled={isSubmitting}>
                {isSubmitting ? 'Sending Request...' : 'Submit Callback Request'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
