'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function AdminDashboard() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch inquiries on mount
  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const res = await fetch('/api/inquiries');
        const data = await res.json();
        if (data.success) {
          setInquiries(data.inquiries);
        }
      } catch (err) {
        console.error('Error fetching inquiries:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  // Filter inquiries based on search term (name, phone, product)
  const filteredInquiries = inquiries.filter((inq) => {
    const term = searchTerm.toLowerCase();
    return (
      inq.name.toLowerCase().includes(term) ||
      inq.phone.includes(term) ||
      (inq.productName && inq.productName.toLowerCase().includes(term)) ||
      (inq.productId && inq.productId.includes(term)) ||
      inq.message.toLowerCase().includes(term)
    );
  });

  return (
    <div className="container" style={{ padding: '3rem 2rem 5rem' }}>
      <div className={styles.adminHeader}>
        <div>
          <span className={styles.adminSubtitle}>Jay Bhavani Administration</span>
          <h1 className="serif-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Customer Inquiries</h1>
          <p className={styles.adminDesc}>Manage, check, and follow up on customer product callback requests and web forms.</p>
        </div>
      </div>

      {/* Control panel */}
      <div className={`${styles.controlPanel} glassmorphism`}>
        <div style={{ flex: 1 }}>
          <label className="form-label">Search Submissions</label>
          <input 
            type="text" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="form-control" 
            placeholder="Search by customer name, phone, product ID..." 
            style={{ padding: '0.7rem 1.2rem', fontSize: '0.9rem' }}
          />
        </div>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Total Submissions</span>
          <span className={styles.statCount}>{filteredInquiries.length}</span>
        </div>
      </div>

      {/* Inquiry List */}
      {loading ? (
        <div className={styles.statusBox}>
          <div className={styles.spinner}></div>
          <p>Retrieving secure submissions from database...</p>
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div className={styles.emptyBox}>
          <p>No customer inquiries found.</p>
        </div>
      ) : (
        <div className={styles.inquiriesContainer}>
          {filteredInquiries.map((inq) => (
            <div key={inq.id} className={`${styles.inquiryCard} glassmorphism`}>
              <div className={styles.cardHeader}>
                <div className={styles.customerMeta}>
                  <h3 className={styles.customerName}>{inq.name}</h3>
                  <div className={styles.badgeRow}>
                    <span className={`${styles.badge} ${styles.phoneBadge}`}>📞 {inq.phone}</span>
                    {inq.email && <span className={`${styles.badge} ${styles.emailBadge}`}>✉️ {inq.email}</span>}
                  </div>
                </div>
                <div className={styles.timeMeta}>
                  <span className={styles.dateLabel}>{new Date(inq.createdAt).toLocaleString('en-IN')}</span>
                  <span className={`${styles.statusLabel} ${styles.pendingStatus}`}>{inq.status}</span>
                </div>
              </div>

              <div className={styles.cardBody}>
                {inq.productId && (
                  <div className={styles.productTagLine}>
                    <span>Product Interest:</span>
                    <Link href={`/product/${inq.productId}`} className={styles.prodLink}>
                      {inq.productName || `Product #${inq.productId}`} (ID: #{inq.productId}) &rarr;
                    </Link>
                  </div>
                )}
                <div className={styles.messageBox}>
                  <strong>Inquiry Message:</strong>
                  <p className={styles.messageText}>&quot;{inq.message}&quot;</p>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <a 
                  href={`tel:${inq.phone}`} 
                  className="outline-btn" 
                  style={{ padding: '0.4rem 1.2rem', fontSize: '0.75rem', letterSpacing: '0.05em' }}
                >
                  Call Client
                </a>
                <a 
                  href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="gold-btn" 
                  style={{ padding: '0.4rem 1.2rem', fontSize: '0.75rem', letterSpacing: '0.05em', color: '#000000' }}
                >
                  WhatsApp Follow Up
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
