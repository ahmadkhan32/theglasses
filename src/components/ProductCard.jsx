import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { formatPrice, calcDiscountedPrice } from '../utils/pricing';
import GlassesAnimation from './GlassesAnimation';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const finalPrice = calcDiscountedPrice(product.price, product.discount);

    return (
        <motion.div
            whileHover={{ y: -8 }}
            style={{
                backgroundColor: 'var(--white)',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Link to={`/products/${product.slug || product.id}`}>
                <div style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <GlassesAnimation
                        image={product.image_url || product.image}
                        altText={product.name}
                    />
                </div>
            </Link>

            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                {product.discount > 0 && (
                    <span style={{
                        display: 'inline-block', backgroundColor: '#fce7f3',
                        color: '#db2777', padding: '2px 10px',
                        borderRadius: '100px', fontSize: '11px', fontWeight: 700,
                        alignSelf: 'flex-start'
                    }}>
                        {product.discount}% OFF
                    </span>
                )}
                <h3 style={{ fontSize: '17px', color: 'var(--text-primary)', fontWeight: 700 }}>{product.name}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{product.category}</p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <div>
                        <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--accent-blue)' }}>
                            {formatPrice(finalPrice)}
                        </span>
                        {product.discount > 0 && (
                            <span style={{ fontSize: '13px', color: 'var(--text-light)', textDecoration: 'line-through', marginLeft: '8px' }}>
                                {formatPrice(product.price)}
                            </span>
                        )}
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => addToCart(product)}
                        style={{
                            backgroundColor: 'var(--accent-blue)', color: '#fff',
                            padding: '8px 16px', borderRadius: '8px',
                            fontWeight: 600, fontSize: '13px', border: 'none',
                            cursor: 'pointer', fontFamily: 'inherit'
                        }}
                    >
                        Add to Cart
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
