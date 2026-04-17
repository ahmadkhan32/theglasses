import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

const ProductFilters = ({ search, onSearch, categorySlug, onCategory, categories, priceRange, onPriceRange }) => (
  <div style={{
    backgroundColor: '#fff',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex', flexDirection: 'column', gap: '20px',
    position: 'sticky', top: '80px',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '-4px' }}>
      <SlidersHorizontal size={16} color="var(--accent-blue)" />
      <span style={{ fontWeight: '700', fontSize: '14px' }}>Filters</span>
    </div>

    {/* Search */}
    <div style={{ position: 'relative' }}>
      <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
      <input
        type="text"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search glasses..."
        style={{
          width: '100%', padding: '10px 12px 10px 36px',
          border: '1px solid var(--border-color)', borderRadius: '10px',
          fontSize: '14px', outline: 'none', fontFamily: 'inherit',
          boxSizing: 'border-box',
        }}
      />
    </div>

    {/* Categories */}
    <div>
      <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
        Category
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <button
          onClick={() => onCategory('')}
          style={{
            textAlign: 'left', padding: '8px 12px', borderRadius: '8px',
            border: 'none', cursor: 'pointer', fontSize: '14px',
            backgroundColor: !categorySlug ? 'var(--accent-blue-light)' : 'transparent',
            color: !categorySlug ? 'var(--accent-blue)' : 'var(--text-secondary)',
            fontWeight: !categorySlug ? '600' : '400',
            fontFamily: 'inherit',
          }}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => onCategory(cat.slug)}
            style={{
              textAlign: 'left', padding: '8px 12px', borderRadius: '8px',
              border: 'none', cursor: 'pointer', fontSize: '14px',
              backgroundColor: categorySlug === cat.slug ? 'var(--accent-blue-light)' : 'transparent',
              color: categorySlug === cat.slug ? 'var(--accent-blue)' : 'var(--text-secondary)',
              fontWeight: categorySlug === cat.slug ? '600' : '400',
              fontFamily: 'inherit',
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>

    {/* Price range */}
    <div>
      <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
        Max Price: Rs. {priceRange?.toLocaleString()}
      </div>
      <input
        type="range"
        min="500" max="5000" step="100"
        value={priceRange}
        onChange={(e) => onPriceRange(Number(e.target.value))}
        style={{ width: '100%', accentColor: 'var(--accent-blue)' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-light)', marginTop: '4px' }}>
        <span>Rs. 500</span>
        <span>Rs. 5,000</span>
      </div>
    </div>
  </div>
);

export default ProductFilters;
