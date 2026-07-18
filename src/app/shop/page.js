'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State filters
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [metal, setMetal] = useState(searchParams.get('metal') || 'all');
  const [sortBy, setSortBy] = useState('none');

  // Categories list
  const categoriesList = [
    { name: 'All Collection', value: 'all' },
    { name: 'Rings', value: 'rings' },
    { name: 'Necklaces & Har', value: 'necklaces' },
    { name: 'Earrings', value: 'earrings' },
    { name: 'Bangles & Bracelets', value: 'bangles' },
    { name: 'Mangalsutras', value: 'mangalsutra' },
    { name: 'Bridal Sets', value: 'bridal-sets' },
    { name: 'Silver Jewellery', value: 'silver' }
  ];

  // Metals list
  const metalsList = [
    { name: 'All Metals', value: 'all' },
    { name: 'Gold', value: 'Gold' },
    { name: 'Diamond', value: 'Diamond' },
    { name: 'Precious Stones', value: 'Precious Stones' }
  ];

  // Listen to searchParams change (from Footer or home links)
  useEffect(() => {
    setCategory(searchParams.get('category') || 'all');
    setSearch(searchParams.get('search') || '');
  }, [searchParams]);

  // Fetch filtered products
  useEffect(() => {
    const fetchFiltered = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (search) query.append('search', search);
        if (category && category !== 'all') query.append('category', category);
        if (metal && metal !== 'all') query.append('metal', metal);

        const res = await fetch(`/api/products?${query.toString()}`);
        const data = await res.json();
        
        if (data.success) {
          let filteredProducts = data.products;

          // Apply client-side sorting
          if (sortBy === 'weight-asc') {
            filteredProducts.sort((a, b) => a.weight - b.weight);
          } else if (sortBy === 'weight-desc') {
            filteredProducts.sort((a, b) => b.weight - a.weight);
          } else if (sortBy === 'name-asc') {
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
          }

          setProducts(filteredProducts);
        }
      } catch (err) {
        console.error('Error fetching filtered products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiltered();
  }, [search, category, metal, sortBy]);

  // Clear all filters
  const handleClearFilters = () => {
    setSearch('');
    setCategory('all');
    setMetal('all');
    setSortBy('none');
    router.push('/shop');
  };

  return (
    <div className="container" style={{ padding: '3rem 2rem 5rem' }}>
      <div className={styles.shopHeader}>
        <span className={styles.shopSubtitle}>Jay Bhavani Catalog</span>
        <h1 className="serif-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Our Collection</h1>
        <p className={styles.shopDesc}>Browse through our authentic 22K Gold and Diamond signature pieces.</p>
      </div>

      <div className={styles.shopLayout}>
        {/* Filters Sidebar */}
        <aside className={`${styles.sidebar} glassmorphism`}>
          <div className={styles.sidebarHeader}>
            <h3 className="serif-title" style={{ fontSize: '1rem', color: 'var(--accent-gold)' }}>Filter By</h3>
            <button onClick={handleClearFilters} className={styles.clearBtn}>Clear All</button>
          </div>

          {/* Search bar */}
          <div className={styles.filterSection}>
            <label className="form-label">Search Ornaments</label>
            <input 
              type="text" 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="form-control" 
              placeholder="e.g. Kundan, Ring..." 
              style={{ padding: '0.7rem 1rem', fontSize: '0.9rem' }}
            />
          </div>

          {/* Categories */}
          <div className={styles.filterSection}>
            <label className="form-label">Category</label>
            <div className={styles.radioList}>
              {categoriesList.map((cat) => (
                <button 
                  key={cat.value} 
                  className={`${styles.filterBtn} ${category === cat.value ? styles.filterBtnActive : ''}`}
                  onClick={() => setCategory(cat.value)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Metal Type */}
          <div className={styles.filterSection}>
            <label className="form-label">Metal Type</label>
            <select 
              value={metal} 
              onChange={(e) => setMetal(e.target.value)} 
              className="form-control" 
              style={{ padding: '0.7rem 1rem', fontSize: '0.9rem' }}
            >
              {metalsList.map((m) => (
                <option key={m.value} value={m.value} style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sorting */}
          <div className={styles.filterSection}>
            <label className="form-label">Sort By</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)} 
              className="form-control" 
              style={{ padding: '0.7rem 1rem', fontSize: '0.9rem' }}
            >
              <option value="none" style={{ backgroundColor: 'var(--bg-secondary)' }}>Default Sorting</option>
              <option value="weight-asc" style={{ backgroundColor: 'var(--bg-secondary)' }}>Weight: Low to High</option>
              <option value="weight-desc" style={{ backgroundColor: 'var(--bg-secondary)' }}>Weight: High to Low</option>
              <option value="name-asc" style={{ backgroundColor: 'var(--bg-secondary)' }}>Alphabetical: A-Z</option>
            </select>
          </div>
        </aside>

        {/* Product Grid Area */}
        <section className={styles.gridSection}>
          <div className={styles.gridHeader}>
            <p className={styles.resultsCount}>Showing <strong>{products.length}</strong> items</p>
          </div>

          {loading ? (
            <div className={styles.statusBox}>
              <div className={styles.spinner}></div>
              <p>Fetching master creations...</p>
            </div>
          ) : products.length === 0 ? (
            <div className={styles.emptyBox}>
              <p>No jewellery matches your current selection.</p>
              <button onClick={handleClearFilters} className="outline-btn" style={{ marginTop: '1rem' }}>View All Ornaments</button>
            </div>
          ) : (
            <div className={styles.productsGrid}>
              {products.map((product) => (
                <div key={product.id} className={`${styles.shopCard} card`}>
                  <div className={styles.imgWrapper}>
                    <img src={product.image} alt={product.name} className={styles.productImg} />
                    <span className={styles.purityTag}>{product.purity}</span>
                  </div>
                  <div className={styles.details}>
                    <span className={styles.categoryLabel}>{product.categoryName}</span>
                    <h3 className={styles.name}>{product.name}</h3>
                    <p className={styles.specs}>{product.weight} grams | {product.metal}</p>
                    <div className={styles.cardFooter}>
                      <Link href={`/product/${product.id}`} className="gold-btn" style={{ width: '100%', fontSize: '0.8rem', padding: '0.6rem' }}>
                        View Details & Enquire
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--bg-primary)', color: 'var(--accent-gold)' }}>
        <div>Loading Shop...</div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
