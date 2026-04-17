import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Container from '../components/layout/Container';
import Button from '../components/ui/Button';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import { createOrder } from '../services/api/orders';
import { validateCoupon } from '../services/api/users';
import { formatPrice } from '../utils/helpers';
import { calcSubtotal, calcShipping, calcCouponDiscount, calcBankDiscount, calcGrandTotal } from '../utils/pricing';
import { PAYMENT_METHODS } from '../utils/constants';
import { Tag, Check } from 'lucide-react';

const inputStyle = {
  width: '100%', padding: '11px 14px',
  border: '1px solid var(--border-color)', borderRadius: '10px',
  fontSize: '14px', outline: 'none', fontFamily: 'inherit',
  boxSizing: 'border-box',
};

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm]   = useState({ name: '', phone: '', address: '', city: '', payment: 'cod' });
  const [couponCode, setCouponCode] = useState('');
  const [coupon, setCoupon]         = useState(null);
  const [couponError, setCouponError] = useState('');
  const [submitting, setSubmitting]   = useState(false);

  const subtotal      = calcSubtotal(cartItems);
  const shipping      = calcShipping(subtotal);
  const couponDisc    = calcCouponDiscount(subtotal, coupon?.discount || 0);
  const bankDisc      = calcBankDiscount(subtotal, form.payment);
  const grandTotal    = calcGrandTotal({ subtotal, shipping, couponDiscount: couponDisc, bankDiscount: bankDisc });

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleCoupon = async () => {
    setCouponError('');
    const result = await validateCoupon(couponCode);
    if (!result) {
      setCouponError('Invalid or expired coupon code.');
    } else if (subtotal < result.min_order) {
      setCouponError(`Minimum order of ${formatPrice(result.min_order)} required.`);
    } else {
      setCoupon(result);
      if (toast) toast.addToast(`Coupon applied! ${result.discount}% off`, 'success');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (!cartItems.length) return;

    setSubmitting(true);
    try {
      await createOrder({
        order: {
          user_id: user.id,
          total: grandTotal,
          status: 'pending',
          payment_method: form.payment,
          shipping_address: `${form.name}, ${form.phone}, ${form.address}, ${form.city}`,
          coupon_code: coupon?.code || null,
          discount_applied: couponDisc + bankDisc,
        },
        items: cartItems,
      });

      clearCart();
      if (toast) toast.addToast('Order placed successfully! 🎉', 'success');
      navigate('/profile');
    } catch (err) {
      console.error('CHECKOUT ERROR:', err);
      if (toast) toast.addToast(err?.message || 'Error placing order. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh', padding: '48px 0' }}>
      <Container>
        <h1 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '32px' }}>Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px', alignItems: 'start' }} className="checkout-grid">

            {/* Left */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

              {/* Shipping */}
              <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid var(--border-color)' }}>
                <h2 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '20px' }}>Shipping Information</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {[
                    { name: 'name',    label: 'Full Name',     required: true },
                    { name: 'phone',   label: 'Phone Number',  required: true },
                    { name: 'city',    label: 'City',          required: true },
                  ].map(({ name, label, required }) => (
                    <div key={name}>
                      <label style={{ fontSize: '13px', fontWeight: '600', marginBottom: '6px', display: 'block' }}>{label}</label>
                      <input name={name} value={form[name]} onChange={handleChange} required={required} style={inputStyle} />
                    </div>
                  ))}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', marginBottom: '6px', display: 'block' }}>Full Address</label>
                    <textarea
                      name="address" value={form.address} onChange={handleChange} required rows={3}
                      style={{ ...inputStyle, resize: 'none' }}
                    />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid var(--border-color)' }}>
                <h2 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '20px' }}>Payment Method</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {PAYMENT_METHODS.map((pm) => (
                    <label
                      key={pm.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '14px 16px', borderRadius: '10px', cursor: 'pointer',
                        border: `2px solid ${form.payment === pm.id ? 'var(--accent-blue)' : 'var(--border-color)'}`,
                        backgroundColor: form.payment === pm.id ? 'var(--accent-blue-light)' : '#fff',
                        transition: 'all 0.2s',
                      }}
                    >
                      <input
                        type="radio" name="payment" value={pm.id}
                        checked={form.payment === pm.id}
                        onChange={handleChange}
                        style={{ accentColor: 'var(--accent-blue)' }}
                      />
                      <span style={{ fontSize: '14px', fontWeight: '600' }}>{pm.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Coupon */}
              <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid var(--border-color)' }}>
                <h2 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '16px' }}>Coupon Code</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Tag size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                    <input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      style={{ ...inputStyle, paddingLeft: '36px' }}
                      disabled={!!coupon}
                    />
                  </div>
                  {coupon ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontWeight: '700', fontSize: '14px' }}>
                      <Check size={16} /> Applied!
                    </div>
                  ) : (
                    <Button type="button" variant="outline" onClick={handleCoupon} disabled={!couponCode}>
                      Apply
                    </Button>
                  )}
                </div>
                {couponError && <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '8px' }}>{couponError}</p>}
              </div>
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                backgroundColor: '#fff', borderRadius: '16px', padding: '24px',
                border: '1px solid var(--border-color)', position: 'sticky', top: '80px',
              }}
            >
              <h2 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '20px' }}>Order Summary</h2>

              {/* Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
                {cartItems.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{item.name} × {item.quantity}</span>
                    <span style={{ fontWeight: '600' }}>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
                  <span style={{ color: shipping === 0 ? '#059669' : 'inherit' }}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                </div>
                {couponDisc > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#059669' }}>
                    <span>Coupon ({coupon.code})</span>
                    <span>-{formatPrice(couponDisc)}</span>
                  </div>
                )}
                {bankDisc > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#059669' }}>
                    <span>Bank Discount (10%)</span>
                    <span>-{formatPrice(bankDisc)}</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '800', marginBottom: '24px' }}>
                <span>Total</span>
                <span style={{ color: 'var(--accent-blue)' }}>{formatPrice(grandTotal)}</span>
              </div>

              <Button type="submit" fullWidth size="lg" disabled={submitting || !cartItems.length}>
                {submitting ? 'Placing Order…' : 'Place Order'}
              </Button>

              {!user && (
                <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '12px' }}>
                  You must be <Link to="/login" style={{ color: 'var(--accent-blue)' }}>logged in</Link> to place an order.
                </p>
              )}
            </motion.div>
          </div>
        </form>
      </Container>
    </div>
  );
};

export default Checkout;
