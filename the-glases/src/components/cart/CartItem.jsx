import React from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/pricing';

const CartItem = ({ item }) => {
    const { updateQuantity, removeFromCart } = useCart();

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}
        >
            <img loading="lazy" src={item.image_url || item.image} alt={item.name} style={{ width: '90px', height: '90px', objectFit: 'contain', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)' }} />
            <div style={{ flex: 1 }}>
                <h4 style={{ fontWeight: 600, marginBottom: '4px' }}>{item.name}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>{item.category}</p>
                <p style={{ color: 'var(--accent-blue)', fontWeight: 700 }}>{formatPrice(item.price)}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px' }}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ width: 32, height: 32, borderRadius: '8px', border: '1.5px solid var(--border-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Minus size={14} /></button>
                    <span style={{ fontWeight: 700, minWidth: '24px', textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ width: 32, height: 32, borderRadius: '8px', border: '1.5px solid var(--border-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={14} /></button>
                </div>
            </div>
            <button onClick={() => removeFromCart(item.id)}><Trash2 size={20} color="#ef4444" /></button>
        </motion.div>
    );
};

export default CartItem;
