import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Container from '../components/layout/Container';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilters from '../components/product/ProductFilters';
import { useProducts } from '../hooks/useProducts';
import { useDebounce } from '../hooks/useDebounce';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [search, setSearch]         = useState('');
  const [categorySlug, setCategory] = useState(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState(5000);

  const debouncedSearch = useDebounce(search, 350);

  const { products, categories, loading } = useProducts({
    search: debouncedSearch,
    categorySlug,
  });

  // Re-read query param on navigation
  useEffect(() => {
    setCategory(searchParams.get('category') || '');
  }, [searchParams]);

  const filtered = products.filter((p) => Number(p.price) <= priceRange);

  return (
    <div style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh' }}>
      {/* Page header */}
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid var(--border-color)', padding: '40px 0' }}>
        <Container>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '8px' }}
          >
            Shop All Glasses
          </motion.h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            Showing {filtered.length} styles
          </p>
        </Container>
      </div>

      <Container style={{ padding: '40px 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '240px 1fr',
          gap: '32px',
          alignItems: 'start',
        }} className="shop-grid">
          {/* Filters sidebar */}
          <div className="shop-filters">
            <ProductFilters
              search={search}
              onSearch={setSearch}
              categorySlug={categorySlug}
              onCategory={setCategory}
              categories={categories}
              priceRange={priceRange}
              onPriceRange={setPriceRange}
            />
          </div>

          {/* Products grid */}
          <ProductGrid products={filtered} loading={loading} />
        </div>
      </Container>
    </div>
  );
};

export default Shop;
