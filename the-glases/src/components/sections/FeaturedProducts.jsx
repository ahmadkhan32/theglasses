import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { scrollFadeIn, staggerContainer } from '../../animations/scrollReveal';
import { useProducts } from '../../hooks/useProducts';
import ProductGrid from '../product/ProductGrid';

const FeaturedProducts = () => {
    const { products, loading } = useProducts({ featured: true });

    return (
        <section style={{ padding: '80px 0', backgroundColor: '#fff' }}>
            <div className="container">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    style={{ textAlign: 'center', marginBottom: '48px' }}
                >
                    <motion.span variants={scrollFadeIn} style={{ display: 'inline-block', backgroundColor: 'var(--accent-blue-light)', color: 'var(--accent-blue)', padding: '6px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 700, marginBottom: '12px' }}>
                        Trending Now
                    </motion.span>
                    <motion.h2 variants={scrollFadeIn} style={{ fontSize: '36px' }}>Our Featured Styles</motion.h2>
                    <motion.p variants={scrollFadeIn} style={{ color: 'var(--text-secondary)', marginTop: '12px' }}>
                        Hand-picked looks loved by our customers.
                    </motion.p>
                </motion.div>

                <ProductGrid products={products} loading={loading} />

                <div style={{ textAlign: 'center', marginTop: '48px' }}>
                    <Link to="/shop">
                        <button className="btn-outline">View All Products →</button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
