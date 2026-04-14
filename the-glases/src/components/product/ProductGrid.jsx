import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, scrollFadeIn } from '../../animations/scrollReveal';
import Loader from '../ui/Loader';

const ProductCard = lazy(() => import('../ProductCard'));

const ProductGrid = ({ products = [], loading = false }) => {
    if (loading) return <Loader />;
    if (!products.length) return (
        <p className="text-center py-16 text-gray-500 font-medium text-lg">
            No products found.
        </p>
    );

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
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
