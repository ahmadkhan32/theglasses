import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import CartItem from './CartItem';
import Button from '../ui/Button';
import { formatPrice } from '../../utils/helpers';
import { calcSubtotal, calcShipping } from '../../utils/pricing';

const CartDrawer = () => {
  const { cartItems, isCartOpen, setIsCartOpen, clearCart } = useCart();
  const subtotal = calcSubtotal(cartItems);
  const shipping = calcShipping(subtotal);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            style={{
              position: 'fixed', inset: 0,
              backgroundColor: 'rgba(0,0,0,0.4)',
              zIndex: 150, backdropFilter: 'blur(2px)',
            }}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0,
              width: 'min(400px, 100vw)',
              backgroundColor: '#fff',
              zIndex: 151,
              display: 'flex', flexDirection: 'column',
              boxShadow: '-8px 0 40px rgba(0,0,0,0.15)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShoppingBag size={20} color="var(--accent-blue)" />
                <span style={{ fontWeight: '700', fontSize: '17px' }}>
                  Cart ({cartItems.length})
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                aria-label="Close cart"
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px' }}>
              {cartItems.length === 0 ? (
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', height: '100%', gap: '16px',
                  color: 'var(--text-light)', paddingTop: '60px',
                }}>
                  <ShoppingBag size={56} strokeWidth={1} />
                  <p style={{ fontSize: '16px' }}>Your cart is empty</p>
                  <Button variant="outline" onClick={() => setIsCartOpen(false)}>
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer summary */}
            {cartItems.length > 0 && (
              <div style={{
                padding: '20px 24px',
                borderTop: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-secondary)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                  <span style={{ fontWeight: '600' }}>{formatPrice(subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '14px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
                  <span style={{ fontWeight: '600', color: shipping === 0 ? '#059669' : 'inherit' }}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '16px' }}>
                  <span style={{ fontWeight: '700' }}>Total</span>
                  <span style={{ fontWeight: '800', color: 'var(--accent-blue)' }}>{formatPrice(subtotal + shipping)}</span>
                </div>

                <Link to="/checkout" onClick={() => setIsCartOpen(false)}>
                  <Button fullWidth size="lg">
                    Checkout
                  </Button>
                </Link>
                <button
                  onClick={clearCart}
                  style={{
                    width: '100%', marginTop: '10px', background: 'none', border: 'none',
                    color: 'var(--text-light)', fontSize: '13px', cursor: 'pointer',
                    fontFamily: 'inherit', padding: '6px',
                  }}
                >
                  Clear Cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
