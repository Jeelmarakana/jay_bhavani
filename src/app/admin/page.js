'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAdminSession, loginAdmin, clearAdminSession, ADMIN_CREDENTIALS } from '@/lib/auth';
import styles from './page.module.css';

export default function AdminDashboard() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [authLoading, setAuthLoading] = useState(true);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminForm, setAdminForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [authStatus, setAuthStatus] = useState({ success: null, message: '' });

  useEffect(() => {
    if (!authStatus.message) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setAuthStatus({ success: null, message: '' });
    }, 3000);

    return () => clearTimeout(timer);
  }, [authStatus.message]);

  useEffect(() => {
    const session = getAdminSession();
    const hasSession = Boolean(session?.username);
    setIsAdminLoggedIn(hasSession);
    setAuthLoading(false);

    if (typeof window !== 'undefined') {
      const msg = sessionStorage.getItem('admin_login_toast');
      if (msg) {
        setAuthStatus({ success: true, message: msg });
        sessionStorage.removeItem('admin_login_toast');
      }
    }

    if (!hasSession) {
      setLoading(false);
      return;
    }

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

  const handleAdminLogin = (e) => {
    e.preventDefault();
    const result = loginAdmin(adminForm);

    if (!result.success) {
      setAuthStatus({ success: false, message: result.message });
      return;
    }

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('admin_login_toast', result.message || 'Admin login successful.');
    }
    setIsAdminLoggedIn(true);
    window.location.reload();
  };

  const handleLogout = () => {
    clearAdminSession();
    setIsAdminLoggedIn(false);
    setAuthStatus({ success: true, message: 'Logged out successfully.' });
  };

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

  if (authLoading) {
    return (
      <div className="container" style={{ padding: '3rem 2rem 5rem' }}>
        <div className={styles.statusBox}>
          <div className={styles.spinner}></div>
          <p>Checking admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdminLoggedIn) {
    return (
      <div className="container" style={{ padding: '4rem 2rem 5rem' }}>
        {authStatus.message ? (
          <div className={`${styles.toast} ${authStatus.success ? styles.success : styles.error}`}>
            <div className={styles.toastIcon}>
              {authStatus.success ? (
                <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 00-1.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span className={styles.toastMessage}>{authStatus.message}</span>
          </div>
        ) : null}

        <div className={styles.authCard}>
          <span className={styles.adminSubtitle}>Restricted Access</span>
          <h1 className="serif-title" style={{ fontSize: '2.1rem', marginBottom: '0.8rem' }}>Admin Login</h1>
          <p className={styles.adminDesc}>Use the protected admin account to launch the control dashboard.</p>

          <form onSubmit={handleAdminLogin} className={styles.loginForm}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                className="form-control"
                type="text"
                value={adminForm.username}
                onChange={(e) => setAdminForm((prev) => ({ ...prev, username: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className={styles.passwordWrap}>
                <input
                  className="form-control"
                  type={showPassword ? 'text' : 'password'}
                  value={adminForm.password}
                  onChange={(e) => setAdminForm((prev) => ({ ...prev, password: e.target.value }))}
                />
                <button type="button" className={styles.eyeButton} onClick={() => setShowPassword((prev) => !prev)}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" className="gold-btn" style={{ width: '100%' }}>
              Login as Admin
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container" style={{ padding: '3rem 2rem 5rem' }}>
      <div className={styles.adminHeader}>
        <div>
          <span className={styles.adminSubtitle}>Jay Bhavani Administration</span>
          <h1 className="serif-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Customer Inquiries</h1>
          <p className={styles.adminDesc}>Manage, check, and follow up on customer product callback requests and web forms.</p>
        </div>
        <button className="outline-btn" onClick={handleLogout} style={{ padding: '0.55rem 1.2rem', fontSize: '0.72rem' }}>
          Logout Admin
        </button>
      </div>

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

    {authStatus.message ? (
      <div className={`${styles.toast} ${authStatus.success ? styles.success : styles.error}`}>
        <div className={styles.toastIcon}>
          {authStatus.success ? (
            <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 00-1.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <span className={styles.toastMessage}>{authStatus.message}</span>
      </div>
    ) : null}
    </>
  );
}
