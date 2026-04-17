import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Container from '../components/layout/Container';
import CartItem from '../components/cart/CartItem';
import Button from '../components/ui/Button';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';
import { calcSubtotal, calcShipping } from '../utils/pricing';
import { ShoppingBag } from 'lucide-react';

const Cart = () => {
  const { cartItems, clearCart } = useCart();
  const subtotal = calcSubtotal(cartItems);
  const shipping  = calcShipping(subtotal);
  const total     = subtotal + shipping;

  return (
    <div style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh', padding: '48px 0' }}>
      <Container>
        <h1 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '32px' }}>
          My Cart
        </h1>

        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-light)' }}
          >
            <ShoppingBag size={60} strokeWidth={1} style={{ marginBottom: '16px' }} />
            <p style={{ fontSize: '18px', marginBottom: '24px' }}>Your cart is empty</p>
            <Link to="/shop"><Button>Browse Collection</Button></Link>
          </motion.div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px', alignItems: 'start' }} className="cart-grid">

            {/* Items */}
            <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid var(--border-color)' }}>
              {cartItems.map((item) => <CartItem key={item.id} item={item} />)}
              <button
                onClick={clearCart}
                style={{ marginTop: '16px', background: 'none', border: 'none', color: 'var(--text-light)', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Clear Cart
              </button>
            </div>

            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                backgroundColor: '#fff', borderRadius: '16px', padding: '24px',
                border: '1px solid var(--border-color)', position: 'sticky', top: '80px',
              }}
            >
              <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Order Summary</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                  <span style={{ fontWeight: '600' }}>{formatPrice(subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
                  <span style={{ fontWeight: '600', color: shipping === 0 ? '#059669' : 'inherit' }}>
                    {shipping === 0 ? 'FREE 🎉' : formatPrice(shipping)}
                  </span>
                </div>
                <div style={{ height: '1px', backgroundColor: 'var(--border-color)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '17px' }}>
                  <span style={{ fontWeight: '700' }}>Total</span>
                  <span style={{ fontWeight: '800', color: 'var(--accent-blue)' }}>{formatPrice(total)}</span>
                </div>
              </div>

              <Link to="/checkout">
                <Button fullWidth size="lg">Proceed to Checkout</Button>
              </Link>
              <Link to="/shop">
                <Button fullWidth variant="outline" size="md" style={{ marginTop: '10px' }}>Continue Shopping</Button>
              </Link>

              {subtotal < 2000 && (
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '12px' }}>
                  Add {formatPrice(2000 - subtotal)} more for free shipping!
                </p>
              )}
            </motion.div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Cart;
