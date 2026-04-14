import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useDebounce } from '../hooks/useDebounce';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilters from '../components/product/ProductFilters';
import { motion } from 'framer-motion';

const Shop = () => {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const debouncedSearch = useDebounce(search, 400);
    const { products, loading } = useProducts({ search: debouncedSearch, category });

    return (
        <main className="min-h-screen bg-bg-soft relative overflow-hidden py-20 pb-32">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4" />

            <div className="container relative z-10">
                {/* Header Section */}
                <header className="mb-16 text-center md:text-left max-w-[800px]">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-dark font-heading leading-none">
                            Shop Our <br />
                            <span className="text-gradient">Collections</span>
                        </h1>
                        <p className="text-light font-bold text-sm uppercase tracking-[4px] mb-8">
                            Premium Eyewear / Established 2024
                        </p>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-4 text-dark/40 font-bold"
                    >
                        <div className="h-[2px] w-12 bg-primary/20" />
                        <span className="text-sm">
                            {loading ? 'Curating collection...' : `Showing ${products.length} Masterpieces`}
                        </span>
                    </motion.div>
                </header>

                {/* Filters & Grid */}
                <section>
                    <ProductFilters
                        selected={category}
                        onSelect={setCategory}
                        search={search}
                        onSearch={setSearch}
                    />
                    
                    <div className="relative">
                        <ProductGrid products={products} loading={loading} />
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Shop;
