'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Breadcrumbs.module.css';

const routeLabels = {
  admin: 'Admin',
  auth: 'Account',
  login: 'Login',
  register: 'Register',
  privacy: 'Privacy',
  shop: 'Collections',
  wishlist: 'Wishlist',
};

export function Breadcrumbs({ items }) {
  if (!items?.length) return null;

  return (
    <nav className={styles.breadcrumbBar} aria-label="Breadcrumb">
      <ol className={styles.list}>
        {items.map((item, index) => (
          <li className={styles.item} key={`${item.href || 'current'}-${item.label}`}>
            {index > 0 && <span className={styles.separator} aria-hidden="true" />}
            {item.href ? (
              <Link href={item.href} className={styles.link}>{item.label}</Link>
            ) : (
              <span className={styles.current} aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageBreadcrumbs() {
  const pathname = usePathname();

  if (!pathname || pathname === '/' || pathname.startsWith('/product/')) return null;

  const segments = pathname.split('/').filter(Boolean);
  const items = [{ label: 'Home', href: '/' }];

  segments.forEach((segment, index) => {
    const label = routeLabels[segment] || decodeURIComponent(segment).replace(/-/g, ' ');
    const href = index < segments.length - 1
      ? `/${segments.slice(0, index + 1).join('/')}`
      : undefined;

    items.push({ label, href });
  });

  return <Breadcrumbs items={items} />;
}