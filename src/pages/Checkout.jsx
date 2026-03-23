import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import Button from '../components/ui/Button';
import { formatPrice } from '../utils/pricing';

const Checkout = () => {
    const { items, subtotal, shipping, total } = useCart();
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [form, setForm] = useState({ name: '', phone: '', address: '', city: '' });
    const [placed, setPlaced] = useState(false);

    const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        // In production: createOrder() → createOrderItems() → clearCart()
        setPlaced(true);
    };

    if (placed) {
        return (
            <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '64px' }}>🎉</div>
                <h2 style={{ fontSize: '28px' }}>Order Placed!</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Thank you for your order. We'll WhatsApp you the tracking info.</p>
                <Button variant="primary" onClick={() => window.location.href = '/'}>Continue Shopping</Button>
            </div>
        );
    }

    const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--border-color)', fontSize: '15px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' };

    return (
        <main style={{ padding: '60px 0', minHeight: '100vh' }}>
            <div className="container">
                <h1 style={{ fontSize: '36px', marginBottom: '40px' }}>Checkout</h1>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px', alignItems: 'start' }}>

                        {/* Shipping */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <h3 style={{ fontSize: '20px' }}>Shipping Information</h3>
                            <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name *" required style={inputStyle} />
                            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone / WhatsApp *" required style={inputStyle} />
                            <input name="address" value={form.address} onChange={handleChange} placeholder="Full Address *" required style={inputStyle} />
                            <input name="city" value={form.city} onChange={handleChange} placeholder="City *" required style={inputStyle} />

                            <h3 style={{ fontSize: '20px', marginTop: '8px' }}>Payment Method</h3>
                            {['cod', 'bank', 'easypaisa', 'jazzcash'].map((pm) => (
                                <label key={pm} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', borderRadius: '10px', border: `1.5px solid ${paymentMethod === pm ? 'var(--accent-blue)' : 'var(--border-color)'}`, cursor: 'pointer', backgroundColor: paymentMethod === pm ? 'var(--accent-blue-light)' : '#fff' }}>
                                    <input type="radio" name="payment" value={pm} checked={paymentMethod === pm} onChange={() => setPaymentMethod(pm)} />
                                    <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>
                                        {{ cod: '💵 Cash on Delivery', bank: '🏦 Bank Transfer (-10%)', easypaisa: '📱 EasyPaisa', jazzcash: '💰 JazzCash' }[pm]}
                                    </span>
                                </label>
                            ))}
                        </div>

                        {/* Summary */}
                        <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', padding: '32px', border: '1px solid var(--border-color)' }}>
                            <h3 style={{ fontSize: '20px', marginBottom: '20px' }}>Order Total</h3>
                            {items.map((item) => (
                                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
                                    <span>{item.name} × {item.quantity}</span>
                                    <span>{formatPrice(item.price * item.quantity)}</span>
                                </div>
                            ))}
                            <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                                <span>Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                            </div>
                            {paymentMethod === 'bank' && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#22c55e', marginBottom: '8px' }}>
                                    <span>Bank Discount 10%</span><span>-{formatPrice(total * 0.1)}</span>
                                </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '18px', marginBottom: '24px' }}>
                                <span>Total</span>
                                <span style={{ color: 'var(--accent-blue)' }}>{formatPrice(paymentMethod === 'bank' ? total * 0.9 : total)}</span>
                            </div>
                            <Button type="submit" variant="primary" fullWidth size="lg">Place Order</Button>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default Checkout;
