'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/lib/auth';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [status, setStatus] = useState({ success: null, message: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!status.message) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setStatus({ success: null, message: '' });
    }, 3000);

    return () => clearTimeout(timer);
  }, [status.message]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ success: null, message: '' });

    const result = loginUser(formData);

    if (!result.success) {
      setStatus({ success: false, message: result.message });
      setLoading(false);
      return;
    }

    setStatus({ success: true, message: result.message });
    setTimeout(() => router.push('/shop'), 800);
    setLoading(false);
  };

  return (
    <div className={styles.authShell}>
      {status.message ? (
        <div className={`${styles.toast} ${status.success ? styles.success : styles.error}`}>
          <div className={styles.toastIcon}>
            {status.success ? (
              <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 00-1.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <span className={styles.toastMessage}>{status.message}</span>
        </div>
      ) : null}

      <div className={styles.authCard}>
        <span className={styles.kicker}>Client Login</span>
        <h1 className="serif-title">Welcome Back</h1>
        <p className={styles.subtitle}>Login with your registered email or name to continue shopping.</p>

        <form onSubmit={handleLogin} className={styles.form}>
          <div className="form-group">
            <label className="form-label">Email or Name</label>
            <input className="form-control" type="text" name="identifier" value={formData.identifier} onChange={handleChange} placeholder="Enter your registered email or name" />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className={styles.passwordWrap}>
              <input className="form-control" type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" />
              <button type="button" className={styles.eyeButton} onClick={() => setShowPassword((prev) => !prev)}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit" className="gold-btn" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className={styles.footerRow}>
          <span>Don&apos;t have an account?</span>
          <Link href="/auth/register" className={styles.linkText}>Register now</Link>
        </div>
      </div>
    </div>
  );
}
