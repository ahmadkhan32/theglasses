import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import Button from '../ui/Button';
import { formatPrice } from '../../utils/pricing';

const CartDrawer = () => {
    const { items, isOpen, setIsOpen, removeFromCart, updateQuantity, subtotal, shipping, total, itemCount } = useCart();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 90 }}
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        style={{
                            position: 'fixed', top: 0, right: 0, bottom: 0,
                            width: '100%', maxWidth: '420px',
                            backgroundColor: '#fff', zIndex: 100,
                            display: 'flex', flexDirection: 'column',
                            boxShadow: '-10px 0 40px rgba(0,0,0,0.15)'
                        }}
                    >
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: 700 }}>Cart ({itemCount})</h3>
                            <button onClick={() => setIsOpen(false)}><X size={22} /></button>
                        </div>

                        {/* Items */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {items.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
                                    <p style={{ fontSize: '32px', marginBottom: '8px' }}>🕶️</p>
                                    <p>Your cart is empty</p>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                                        <img loading="lazy" src={item.image_url || item.image} alt={item.name} style={{ width: '72px', height: '72px', objectFit: 'contain', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)' }} />
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontWeight: 600, fontSize: '15px' }}>{item.name}</p>
                                            <p style={{ color: 'var(--accent-blue)', fontWeight: 700 }}>{formatPrice(item.price)}</p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ width: 28, height: 28, borderRadius: '6px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Minus size={14} /></button>
                                                <span style={{ fontWeight: 600, minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ width: 28, height: 28, borderRadius: '6px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Plus size={14} /></button>
                                            </div>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id)}><Trash2 size={18} color="#ef4444" /></button>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border-color)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                                    <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                                    <span>Shipping</span><span>{shipping === 0 ? 'Free 🎉' : formatPrice(shipping)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '18px', marginBottom: '20px' }}>
                                    <span>Total</span><span style={{ color: 'var(--accent-blue)' }}>{formatPrice(total)}</span>
                                </div>
                                <Button variant="primary" fullWidth onClick={() => { setIsOpen(false); window.location.href = '/checkout'; }}>
                                    Checkout
                                </Button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
