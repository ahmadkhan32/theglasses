import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import Loader from '../ui/Loader';

const ProductGrid = ({ products, loading }) => {
  if (loading) return <Loader fullPage />;

  if (!products?.length) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-light)' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>👓</div>
        <p style={{ fontSize: '16px' }}>No glasses found. Try adjusting your filters!</p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
      gap: '24px',
    }}>
      {products.map((product, i) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </div>
  );
};

export default ProductGrid;
