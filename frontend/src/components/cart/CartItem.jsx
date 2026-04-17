import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/helpers';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      style={{
        display: 'flex', gap: '16px', alignItems: 'center',
        padding: '16px 0', borderBottom: '1px solid var(--border-color)',
      }}
    >
      {/* Thumbnail */}
      <div style={{
        width: '72px', height: '72px', minWidth: '72px',
        borderRadius: '10px', overflow: 'hidden',
        backgroundColor: 'var(--bg-secondary)',
      }}>
        <img
          src={item.image_url}
          alt={item.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=120&q=80';
          }}
        />
      </div>

      {/* Details */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {item.name}
        </div>
        <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--accent-blue)', marginBottom: '8px' }}>
          {formatPrice(item.price)}
        </div>

        {/* Quantity controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            aria-label="Decrease quantity"
            style={{
              width: '28px', height: '28px', borderRadius: '8px',
              border: '1px solid var(--border-color)', background: '#fff',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Minus size={12} />
          </button>
          <span style={{ fontSize: '14px', fontWeight: '600', minWidth: '20px', textAlign: 'center' }}>
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            aria-label="Increase quantity"
            style={{
              width: '28px', height: '28px', borderRadius: '8px',
              border: '1px solid var(--border-color)', background: '#fff',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Plus size={12} />
          </button>
        </div>
      </div>

      {/* Total + Remove */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
        <span style={{ fontWeight: '700', fontSize: '14px' }}>
          {formatPrice(item.price * item.quantity)}
        </span>
        <button
          onClick={() => removeFromCart(item.id)}
          aria-label="Remove item"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', display: 'flex' }}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default CartItem;
