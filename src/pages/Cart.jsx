import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import CartItem from '../components/cart/CartItem';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/pricing';

const Cart = () => {
    const { items, subtotal, shipping, total, clearCart } = useCart();

    return (
        <main style={{ padding: '60px 0', minHeight: '100vh' }}>
            <div className="container">
                <h1 style={{ fontSize: '36px', marginBottom: '32px' }}>Your Cart</h1>

                {items.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 0' }}>
                        <div style={{ fontSize: '60px', marginBottom: '16px' }}>🕶️</div>
                        <h3 style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>Your cart is empty</h3>
                        <Link to="/shop"><Button variant="primary">Browse Glasses</Button></Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px', alignItems: 'start' }}>
                        {/* Items */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <AnimatePresence>
                                {items.map((item) => <CartItem key={item.id} item={item} />)}
                            </AnimatePresence>
                            <button onClick={clearCart} style={{ alignSelf: 'flex-end', color: '#ef4444', fontSize: '13px', cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'inherit', fontWeight: 600 }}>
                                Clear Cart
                            </button>
                        </div>

                        {/* Summary */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', padding: '32px', border: '1px solid var(--border-color)' }}
                        >
                            <h3 style={{ fontSize: '20px', marginBottom: '24px', fontWeight: 700 }}>Order Summary</h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                                    <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                                    <span>Shipping</span><span style={{ color: shipping === 0 ? '#22c55e' : 'inherit' }}>{shipping === 0 ? 'Free 🎉' : formatPrice(shipping)}</span>
                                </div>
                                <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '18px' }}>
                                    <span>Total</span><span style={{ color: 'var(--accent-blue)' }}>{formatPrice(total)}</span>
                                </div>
                            </div>

                            <Link to="/checkout" style={{ display: 'block' }}>
                                <Button variant="primary" fullWidth size="lg">Proceed to Checkout</Button>
                            </Link>

                            {shipping > 0 && (
                                <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '12px' }}>
                                    Add Rs. {formatPrice(2000 - subtotal)} more for free shipping!
                                </p>
                            )}
                        </motion.div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default Cart;
