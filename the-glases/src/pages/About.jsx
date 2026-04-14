import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const About = () => (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8faff 0%, #eef2ff 100%)' }}>
        {/* Hero */}
        <section style={{ padding: '80px 0 60px', textAlign: 'center' }}>
            <div className="container">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <span style={{ display: 'inline-block', backgroundColor: 'var(--accent-blue-light)', color: 'var(--accent-blue)', padding: '6px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 700, marginBottom: '20px' }}>
                        🕶️ Our Story
                    </span>
                    <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: 1.1, marginBottom: '24px', color: 'var(--text-primary)' }}>
                        About <span style={{ color: 'var(--accent-blue)' }}>The Glases</span>
                    </h1>
                    <p style={{ fontSize: '18px', color: 'var(--text-secondary)', maxWidth: '660px', margin: '0 auto 40px', lineHeight: 1.7 }}>
                        We're Pakistan's premier online eyewear destination — bringing you premium frames, AI-powered virtual try-on, and an elevated shopping experience — all at accessible prices.
                    </p>
                </motion.div>
            </div>
        </section>

        {/* Values */}
        <section style={{ padding: '60px 0', backgroundColor: '#fff' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px' }}>
                    {[
                        { icon: '🎯', title: 'Our Mission', desc: 'To make premium eyewear accessible to every Pakistani — with fast delivery, fair prices, and a try-before-you-buy experience.' },
                        { icon: '🔬', title: 'Lens Quality', desc: 'We source only premium lenses with UV400, anti-reflective, and blue-light blocking coatings from verified suppliers.' },
                        { icon: '🚀', title: 'Fast Delivery', desc: 'Same-day dispatch from Karachi with nationwide delivery in 3–5 working days. Cash on delivery available.' },
                        { icon: '💚', title: 'Customer First', desc: 'Not satisfied? We offer a 7-day hassle-free return policy. Your happiness is our guarantee.' },
                    ].map((val) => (
                        <motion.div
                            key={val.title}
                            whileHover={{ y: -6 }}
                            style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', padding: '32px 28px', border: '1px solid var(--border-color)' }}
                        >
                            <div style={{ fontSize: '36px', marginBottom: '16px' }}>{val.icon}</div>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px', color: 'var(--text-primary)' }}>{val.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '15px' }}>{val.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>

        {/* Stats */}
        <section style={{ padding: '60px 0', background: 'var(--accent-blue)', color: '#fff' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'center', gap: '60px', flexWrap: 'wrap', textAlign: 'center' }}>
                    {[
                        { num: '10,000+', label: 'Happy Customers' },
                        { num: '50+', label: 'Frame Styles' },
                        { num: '3–5 Days', label: 'Nationwide Delivery' },
                        { num: '7 Day', label: 'Easy Returns' },
                    ].map((s) => (
                        <div key={s.label}>
                            <div style={{ fontSize: '36px', fontWeight: 900, marginBottom: '8px' }}>{s.num}</div>
                            <div style={{ fontSize: '14px', opacity: 0.85 }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* CTA */}
        <section style={{ padding: '80px 0', textAlign: 'center' }}>
            <div className="container">
                <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>Ready to find your perfect frame?</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '17px' }}>Browse our collection or try on glasses virtually — right from your browser.</p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/shop"><Button variant="primary" size="lg">Shop Now</Button></Link>
                    <Link to="/try-on"><Button variant="outline" size="lg">Try On 🕶️</Button></Link>
                </div>
            </div>
        </section>
    </main>
);

export default About;
