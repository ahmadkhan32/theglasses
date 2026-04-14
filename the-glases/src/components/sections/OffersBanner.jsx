import React from 'react';
import { motion } from 'framer-motion';
import { Truck, CreditCard, RotateCcw, Shield } from 'lucide-react';

const offers = [
    { icon: <Truck size={28} />, title: 'Free Shipping', desc: 'On orders above Rs. 2,000' },
    { icon: <CreditCard size={28} />, title: '10% Off Bank Transfer', desc: 'Extra savings on bank payments' },
    { icon: <RotateCcw size={28} />, title: '7-Day Returns', desc: 'No questions asked' },
    { icon: <Shield size={28} />, title: 'Secure Payments', desc: 'COD + Online options available' },
];

const OffersBanner = () => (
    <section style={{ padding: '60px 0', background: 'linear-gradient(135deg, #0052cc 0%, #0066ff 100%)' }}>
        <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px' }}>
                {offers.map((o) => (
                    <motion.div
                        key={o.title}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        style={{ color: '#fff', textAlign: 'center' }}
                    >
                        <div style={{ marginBottom: '12px', opacity: 0.9 }}>{o.icon}</div>
                        <h4 style={{ fontWeight: 700, marginBottom: '6px' }}>{o.title}</h4>
                        <p style={{ fontSize: '13px', opacity: 0.8 }}>{o.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

export default OffersBanner;
