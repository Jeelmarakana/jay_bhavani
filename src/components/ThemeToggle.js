'use client';

import { useTheme } from './ThemeContext';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle({ showLabel = true, className = '' }) {
  const { theme, toggleTheme, mounted } = useTheme();

  // Before mounting on client, render a placeholder with default look to avoid mismatch
  if (!mounted) {
    return (
      <button
        type="button"
        className={`${styles.themeToggle} ${className}`}
        aria-label="Toggle Theme"
        disabled
        style={{ opacity: 0.7 }}
      >
        <span className={styles.iconWrap}>☀️</span>
        {showLabel && <span className={styles.label}>Light</span>}
      </button>
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`${styles.themeToggle} ${className}`}
      aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} theme`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} theme`}
    >
      <span className={styles.iconWrap}>
        {isDark ? '🌙' : '☀️'}
      </span>
      {showLabel && (
        <span className={styles.label}>
          {isDark ? 'Dark' : 'Light'}
        </span>
      )}
    </button>
  );
}
