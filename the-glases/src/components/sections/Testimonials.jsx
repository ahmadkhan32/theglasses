import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const REVIEWS = [
    { name: 'Usman Malik', city: 'Karachi', rating: 5, text: 'Amazing quality! The blue light glasses saved my eyes during 16-hour work days. Super fast delivery.' },
    { name: 'Sana Rehman', city: 'Lahore', rating: 5, text: 'The aviators are absolutely stunning. Got so many compliments. Will buy more for my family!' },
    { name: 'Ahmed Khan', city: 'Islamabad', rating: 4, text: 'Excellent service and premium packaging. Exceeded my expectations for this price point.' },
    { name: 'Fatima Riaz', city: 'Peshawar', rating: 5, text: 'The virtual try-on feature is genius! Loved how accurate the preview was before ordering.' },
];

const Testimonials = () => {
    const [current, setCurrent] = useState(0);

    const prev = () => setCurrent((c) => (c === 0 ? REVIEWS.length - 1 : c - 1));
    const next = () => setCurrent((c) => (c === REVIEWS.length - 1 ? 0 : c + 1));

    return (
        <section style={{ padding: '80px 0', backgroundColor: '#fff' }}>
            <div className="container" style={{ maxWidth: '700px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '32px', marginBottom: '48px' }}>What Our Customers Say</h2>

                <div style={{ position: 'relative', overflow: 'hidden', minHeight: '200px' }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current}
                            initial={{ opacity: 0, x: 60 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -60 }}
                            transition={{ duration: 0.4 }}
                            style={{
                                backgroundColor: 'var(--bg-secondary)', borderRadius: '20px',
                                padding: '40px', textAlign: 'left', boxShadow: 'var(--shadow-md)'
                            }}
                        >
                            <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                                {[...Array(REVIEWS[current].rating)].map((_, i) => <Star key={i} size={18} fill="#facc15" color="#facc15" />)}
                            </div>
                            <p style={{ fontSize: '17px', lineHeight: 1.7, color: 'var(--text-primary)', marginBottom: '24px' }}>
                                "{REVIEWS[current].text}"
                            </p>
                            <div style={{ fontWeight: 700 }}>{REVIEWS[current].name}</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{REVIEWS[current].city}</div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '32px' }}>
                    <button onClick={prev} style={{ width: 44, height: 44, borderRadius: '50%', border: '1.5px solid var(--border-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}><ChevronLeft size={20} /></button>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {REVIEWS.map((_, i) => (
                            <div key={i} onClick={() => setCurrent(i)} style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: i === current ? 'var(--accent-blue)' : 'var(--border-color)', cursor: 'pointer', transition: 'background-color 0.2s' }} />
                        ))}
                    </div>
                    <button onClick={next} style={{ width: 44, height: 44, borderRadius: '50%', border: '1.5px solid var(--border-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}><ChevronRight size={20} /></button>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
