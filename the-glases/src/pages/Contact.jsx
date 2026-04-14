import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';

const Contact = () => {
    const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
    const [sent, setSent] = useState(false);

    const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        // Send via WhatsApp
        const number = '923470838718';
        const msg = `Hi The Glases! 👋%0A%0AName: ${form.name}%0AEmail: ${form.email}%0APhone: ${form.phone}%0A%0AMessage:%0A${form.message}`;
        window.open(`https://wa.me/${number}?text=${msg}`, '_blank');
        setSent(true);
    };

    const inputStyle = {
        width: '100%', padding: '14px 16px', borderRadius: '12px',
        border: '1.5px solid var(--border-color)', fontSize: '15px',
        fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
        backgroundColor: 'var(--bg-secondary)',
        transition: 'border-color 0.2s',
    };

    return (
        <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8faff 0%, #eef2ff 100%)', padding: '80px 0' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <span style={{ display: 'inline-block', backgroundColor: 'var(--accent-blue-light)', color: 'var(--accent-blue)', padding: '6px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 700, marginBottom: '20px' }}>
                        📩 Get in Touch
                    </span>
                    <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', marginBottom: '16px' }}>Contact <span style={{ color: 'var(--accent-blue)' }}>Us</span></h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '17px', maxWidth: '520px', margin: '0 auto' }}>
                        Have a question about your order, a product, or just want to say hello? We'd love to hear from you.
                    </p>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px', alignItems: 'start' }}>
                    {/* Contact Info */}
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '24px' }}>Reach Us Directly</h2>
                        {[
                            { icon: '📱', title: 'WhatsApp / Phone', info: '+92 347 083 8718' },
                            { icon: '📧', title: 'Email', info: 'support@theglases.pk / glasesthe@gmail.com' },
                            { icon: '📍', title: 'Location', info: 'Karachi, Pakistan' },
                            { icon: '🕐', title: 'Hours', info: 'Mon–Sat, 10am – 7pm PKT' },
                        ].map((c) => (
                            <div key={c.title} style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                                <span style={{ fontSize: '24px', flexShrink: 0 }}>{c.icon}</span>
                                <div>
                                    <p style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)', marginBottom: '2px' }}>{c.title}</p>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>{c.info}</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                        {sent ? (
                            <div style={{ textAlign: 'center', padding: '48px 32px', backgroundColor: '#fff', borderRadius: '24px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)' }}>
                                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                                <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '10px' }}>Message Sent!</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>We've opened WhatsApp with your message. We'll get back to you shortly.</p>
                                <button onClick={() => setSent(false)} style={{ marginTop: '24px', color: 'var(--accent-blue)', fontWeight: 700, cursor: 'pointer', fontSize: '14px', background: 'none', border: 'none' }}>Send another message</button>
                            </div>
                        ) : (
                            <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '40px 36px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)' }}>
                                <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px' }}>Send a Message via WhatsApp</h2>
                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <input name="name" value={form.name} onChange={handleChange} placeholder="Your Name *" required style={inputStyle} />
                                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email Address" style={inputStyle} />
                                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone / WhatsApp" style={inputStyle} />
                                    <textarea name="message" value={form.message} onChange={handleChange} placeholder="Your Message *" required rows={5}
                                        style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
                                    <Button type="submit" variant="primary" fullWidth size="lg">
                                        💬 Send via WhatsApp
                                    </Button>
                                </form>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </main>
    );
};

export default Contact;
