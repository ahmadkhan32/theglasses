import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../ui/Toast';
import { formatPrice, calcDiscount } from '../../utils/helpers';
import HoverTilt from '../animation/HoverTilt';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const toast = useToast();

  const discount = product.discount || calcDiscount(product.price, product.old_price);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    if (toast) toast.addToast(`${product.name} added to cart!`, 'success');
  };

  return (
    <HoverTilt intensity={6}>
      <Link to={`/product/${product.slug || product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div
          style={{
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            overflow: 'hidden',
            backgroundColor: '#fff',
            boxShadow: 'var(--shadow-sm)',
            transition: 'box-shadow 0.3s',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
        >
          {/* Image */}
          <div style={{
            position: 'relative',
            backgroundColor: 'var(--bg-secondary)',
            aspectRatio: '4/3',
            overflow: 'hidden',
          }}>
            <img
              src={product.image_url}
              alt={product.name}
              loading="lazy"
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.4s ease',
              }}
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&q=80';
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            />

            {/* Discount badge */}
            {discount > 0 && (
              <div style={{
                position: 'absolute', top: '12px', left: '12px',
                backgroundColor: '#ef4444', color: '#fff',
                fontSize: '11px', fontWeight: '700',
                padding: '3px 8px', borderRadius: '100px',
              }}>
                -{discount}%
              </div>
            )}

            {/* Featured badge */}
            {product.is_featured && (
              <div style={{
                position: 'absolute', top: '12px', right: '12px',
                backgroundColor: 'var(--accent-blue)', color: '#fff',
                fontSize: '11px', fontWeight: '700',
                padding: '3px 8px', borderRadius: '100px',
              }}>
                ⭐ Featured
              </div>
            )}
          </div>

          {/* Info */}
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
            {product.categories?.name && (
              <span style={{
                fontSize: '11px', fontWeight: '600',
                color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>
                {product.categories.name}
              </span>
            )}

            <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: '1.3' }}>
              {product.name}
            </h3>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', flex: 1 }}>
              {product.description?.slice(0, 65)}…
            </p>

            {/* Price + CTA */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontSize: '17px', fontWeight: '800', color: 'var(--accent-blue)' }}>
                  {formatPrice(product.price)}
                </span>
                {product.old_price && (
                  <span style={{ fontSize: '12px', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                    {formatPrice(product.old_price)}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddToCart}
                  aria-label="Add to cart"
                  style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    backgroundColor: 'var(--accent-blue)', border: 'none',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <ShoppingCart size={16} color="#fff" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </HoverTilt>
  );
};

export default ProductCard;
