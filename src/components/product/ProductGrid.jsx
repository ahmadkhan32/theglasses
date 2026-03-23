import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, scrollFadeIn } from '../../animations/scrollReveal';
import Loader from '../ui/Loader';

const ProductCard = lazy(() => import('../ProductCard'));

const ProductGrid = ({ products = [], loading = false }) => {
    if (loading) return <Loader />;
    if (!products.length) return (
        <p style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
            No products found.
        </p>
    );

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '24px',
            }}
        >
            <Suspense fallback={<Loader />}>
                {products.map((product) => (
                    <motion.div key={product.id} variants={scrollFadeIn}>
                        <ProductCard product={product} />
                    </motion.div>
                ))}
            </Suspense>
        </motion.div>
    );
};

export default ProductGrid;
