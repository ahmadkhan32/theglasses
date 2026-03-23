import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useDebounce } from '../hooks/useDebounce';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilters from '../components/product/ProductFilters';

const Shop = () => {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const debouncedSearch = useDebounce(search, 400);
    const { products, loading } = useProducts({ search: debouncedSearch, category });

    return (
        <main style={{ padding: '60px 0', minHeight: '100vh' }}>
            <div className="container">
                <div style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '40px', marginBottom: '8px' }}>Shop All Glasses</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {loading ? 'Loading...' : `${products.length} products`}
                    </p>
                </div>
                <ProductFilters
                    selected={category}
                    onSelect={setCategory}
                    search={search}
                    onSearch={setSearch}
                />
                <ProductGrid products={products} loading={loading} />
            </div>
        </main>
    );
};

export default Shop;
