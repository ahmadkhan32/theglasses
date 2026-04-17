import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Container from '../layout/Container';
import ProductCard from '../product/ProductCard';
import Loader from '../ui/Loader';
import { useProducts } from '../../hooks/useProducts';

const FeaturedProducts = () => {
  const { products, loading } = useProducts({ featured: true });

  return (
    <section style={{ padding: '80px 0', backgroundColor: '#fff' }}>
      <Container>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={{ color: 'var(--accent-blue)', fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}
            >
              Top Picks
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: '800', letterSpacing: '-0.5px' }}
            >
              Featured Styles
            </motion.h2>
          </div>
          <Link
            to="/shop"
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              color: 'var(--accent-blue)', fontWeight: '600', fontSize: '14px',
            }}
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <Loader fullPage />
        ) : products.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: '40px 0' }}>
            No products found. Add to your Supabase database!
          </p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '24px',
          }}>
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
};

export default FeaturedProducts;
