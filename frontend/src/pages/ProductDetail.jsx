import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft, Star, Truck } from 'lucide-react';
import Container from '../components/layout/Container';
import Loader from '../components/ui/Loader';
import Button from '../components/ui/Button';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/ui/Toast';
import { getProductBySlug } from '../services/api/products';
import { getProductReviews, getAverageRating } from '../services/api/reviews';
import { formatPrice, calcDiscount } from '../utils/helpers';
import { DEMO_PRODUCTS } from '../utils/constants';

const ProductDetail = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const toast = useToast();

  const [product,  setProduct]  = useState(null);
  const [reviews,  setReviews]  = useState([]);
  const [ratingInfo, setRating] = useState({ average: 0, count: 0 });
  const [loading,  setLoading]  = useState(true);
  const [quantity, setQty]      = useState(1);
  const [activeImg, setImg]     = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const p = await getProductBySlug(slug);
        setProduct(p);
        setImg(0);
        try {
          const [rv, ra] = await Promise.all([
            getProductReviews(p.id),
            getAverageRating(p.id),
          ]);
          setReviews(rv || []);
          setRating(ra || { average: 0, count: 0 });
        } catch {
          // Reviews unavailable — continue without them
        }
      } catch {
        // Supabase not configured — look in demo products
        const demo = DEMO_PRODUCTS.find((p) => p.slug === slug);
        setProduct(demo || null);
        setImg(0);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading) return <Loader fullPage />;
  if (!product) return (
    <Container style={{ padding: '80px 24px' }}>
      <p>Product not found.</p>
      <Link to="/shop"><Button style={{ marginTop: '16px' }} variant="outline">Back to Shop</Button></Link>
    </Container>
  );

  const gallery = [product.image_url, ...(product.gallery || [])].filter(Boolean);
  const discount = product.discount || calcDiscount(product.price, product.old_price);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    if (toast) toast.addToast(`${product.name} added to cart!`, 'success');
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh', padding: '40px 0' }}>
      <Container>
        <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
          <ArrowLeft size={16} /> Back to Shop
        </Link>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '48px',
          backgroundColor: '#fff',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: 'var(--shadow-sm)',
        }} className="product-detail-grid">

          {/* Gallery */}
          <div>
            <motion.div
              key={activeImg}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                borderRadius: '16px', overflow: 'hidden',
                backgroundColor: 'var(--bg-secondary)',
                aspectRatio: '1',
                marginBottom: '16px',
              }}
            >
              <img
                src={gallery[activeImg]}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&q=80'; }}
              />
            </motion.div>

            {gallery.length > 1 && (
              <div style={{ display: 'flex', gap: '8px' }}>
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImg(i)}
                    style={{
                      width: '64px', height: '64px', borderRadius: '10px',
                      border: `2px solid ${i === activeImg ? 'var(--accent-blue)' : 'var(--border-color)'}`,
                      overflow: 'hidden', cursor: 'pointer', padding: 0, background: 'none',
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {product.categories?.name && (
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {product.categories.name}
              </span>
            )}
            <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px', margin: '8px 0 12px' }}>
              {product.name}
            </h1>

            {/* Rating */}
            {ratingInfo.count > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} fill={i < Math.round(ratingInfo.average) ? '#f59e0b' : 'none'} color="#f59e0b" />
                ))}
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {ratingInfo.average} ({ratingInfo.count} reviews)
                </span>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '20px' }}>
              <span style={{ fontSize: '28px', fontWeight: '800', color: 'var(--accent-blue)' }}>{formatPrice(product.price)}</span>
              {product.old_price && (
                <span style={{ fontSize: '16px', color: 'var(--text-light)', textDecoration: 'line-through' }}>{formatPrice(product.old_price)}</span>
              )}
              {discount > 0 && (
                <span style={{ backgroundColor: '#fef2f2', color: '#ef4444', fontSize: '13px', fontWeight: '700', padding: '3px 8px', borderRadius: '100px' }}>
                  -{discount}% OFF
                </span>
              )}
            </div>

            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '28px', fontSize: '15px' }}>
              {product.description}
            </p>

            {/* Product Details */}
            {(product.brand || product.material || product.color || product.pattern) && (
              <div style={{
                backgroundColor: '#f9f9f9',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '24px',
                border: '1px solid var(--border-color)',
              }}>
                <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-primary)' }}>
                  Product Details
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                  {product.brand && (
                    <div>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Brand:</span>
                      <p style={{ color: 'var(--text-primary)', fontWeight: '600', margin: '4px 0 0' }}>{product.brand}</p>
                    </div>
                  )}
                  {product.material && (
                    <div>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Material:</span>
                      <p style={{ color: 'var(--text-primary)', fontWeight: '600', margin: '4px 0 0' }}>{product.material}</p>
                    </div>
                  )}
                  {product.color && (
                    <div>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Color:</span>
                      <p style={{ color: 'var(--text-primary)', fontWeight: '600', margin: '4px 0 0' }}>{product.color}</p>
                    </div>
                  )}
                  {product.pattern && (
                    <div>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Pattern:</span>
                      <p style={{ color: 'var(--text-primary)', fontWeight: '600', margin: '4px 0 0' }}>{product.pattern}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Long Description */}
            {product.long_description && (
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>About This Product</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '14px' }}>
                  {product.long_description}
                </p>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', display: 'block' }}>
                  Select Size
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', gap: '8px' }}>
                  {product.sizes.map((size, i) => (
                    <button
                      key={i}
                      style={{
                        padding: '10px',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        backgroundColor: '#fff',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '600',
                        transition: 'all 0.2s',
                        hover: { borderColor: 'var(--accent-blue)', backgroundColor: 'var(--bg-secondary)' },
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-blue)'; e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.backgroundColor = '#fff'; }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Details */}
            {product.details && typeof product.details === 'object' && Object.keys(product.details).length > 0 && (
              <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>Specifications</h3>
                <div style={{ display: 'grid', gap: '8px', fontSize: '13px' }}>
                  {Object.entries(product.details).map(([key, value]) => (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: '500', textTransform: 'capitalize' }}>
                        {key.replace(/_/g, ' ')}:
                      </span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>Qty:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0', border: '1px solid var(--border-color)', borderRadius: '10px', overflow: 'hidden' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: '36px', height: '36px', border: 'none', background: '#fff', cursor: 'pointer', fontSize: '16px' }}>-</button>
                <span style={{ width: '36px', textAlign: 'center', fontWeight: '600', fontSize: '14px' }}>{quantity}</span>
                <button onClick={() => setQty(q => q + 1)} style={{ width: '36px', height: '36px', border: 'none', background: '#fff', cursor: 'pointer', fontSize: '16px' }}>+</button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '28px' }}>
              <Button onClick={handleAddToCart} size="lg" style={{ flex: 1 }}>
                <ShoppingCart size={18} /> Add to Cart
              </Button>
              <Link to="/checkout" onClick={() => addToCart(product, quantity)}>
                <Button variant="dark" size="lg">Buy Now</Button>
              </Link>
            </div>

            {/* Shipping note */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '12px 16px', backgroundColor: 'var(--bg-secondary)',
              borderRadius: '10px', fontSize: '13px', color: 'var(--text-secondary)',
            }}>
              <Truck size={18} color="#059669" />
              <span>Free shipping on orders above Rs. 2,000</span>
            </div>
          </div>
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <div style={{ marginTop: '48px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '24px' }}>Customer Reviews</h2>
            <div style={{ display: 'grid', gap: '16px' }}>
              {reviews.map((r) => (
                <div key={r.id} style={{
                  backgroundColor: '#fff', borderRadius: '12px',
                  padding: '20px', border: '1px solid var(--border-color)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '700', fontSize: '14px' }}>{r.users?.name || 'Anonymous'}</span>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                      ))}
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default ProductDetail;
