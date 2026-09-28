'use client';

import { useEffect, useState } from 'react';

export default function PageTransition({ children }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="page-content animate-fade-in">
      {children}
    </div>
  );
}
