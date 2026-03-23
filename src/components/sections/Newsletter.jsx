import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            setSubmitted(true);
            setEmail('');
        }
    };

    return (
        <section style={{ padding: '80px 0', background: 'linear-gradient(135deg, #f8faff 0%, #eef2ff 100%)' }}>
            <div className="container" style={{ maxWidth: '600px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>Stay in Style 📧</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                    Subscribe for exclusive offers, new arrivals, and style tips.
                </p>

                {submitted ? (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        style={{ padding: '20px', backgroundColor: '#dcfce7', borderRadius: '12px', color: '#15803d', fontWeight: 600 }}
                    >
                        🎉 You're subscribed! Watch your inbox for exclusive offers.
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            style={{
                                flex: '1 1 240px', maxWidth: '340px',
                                padding: '14px 20px', borderRadius: '10px',
                                border: '1.5px solid var(--border-color)',
                                fontSize: '15px', fontFamily: 'inherit', outline: 'none'
                            }}
                        />
                        <button type="submit" className="btn-primary" style={{ padding: '14px 28px', whiteSpace: 'nowrap' }}>
                            Subscribe Now
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
};

export default Newsletter;
