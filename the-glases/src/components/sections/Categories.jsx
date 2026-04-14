import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { staggerContainer, scrollFadeIn } from '../../animations/scrollReveal';

const CATS = [
    { label: 'Blue Light', emoji: '💻', color: '#dbeafe', link: '/shop?cat=Blue+Light' },
    { label: 'Sunglasses', emoji: '☀️', color: '#fef9c3', link: '/shop?cat=Sunglasses' },
    { label: 'Aviators', emoji: '✈️', color: '#f3e8ff', link: '/shop?cat=Aviators' },
    { label: 'Fashion', emoji: '💎', color: '#fce7f3', link: '/shop?cat=Fashion' },
    { label: 'UV Protection', emoji: '🛡️', color: '#dcfce7', link: '/shop?cat=UV+Protection' },
];

const Categories = () => (
    <section style={{ padding: '60px 0', backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
            <motion.h2
                initial="hidden" whileInView="visible" variants={scrollFadeIn} viewport={{ once: true }}
                style={{ textAlign: 'center', fontSize: '32px', marginBottom: '40px' }}
            >
                Shop by Category
            </motion.h2>

            <motion.div
                initial="hidden" whileInView="visible" variants={staggerContainer} viewport={{ once: true }}
                style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}
            >
                {CATS.map((c) => (
                    <motion.div key={c.label} variants={scrollFadeIn}>
                        <Link to={c.link} style={{ textDecoration: 'none' }}>
                            <motion.div
                                whileHover={{ y: -6, scale: 1.04 }}
                                style={{
                                    backgroundColor: c.color,
                                    borderRadius: '16px',
                                    padding: '28px 32px',
                                    textAlign: 'center',
                                    minWidth: '140px',
                                    cursor: 'pointer',
                                    border: '1.5px solid transparent',
                                    transition: 'border-color 0.2s',
                                }}
                            >
                                <div style={{ fontSize: '36px', marginBottom: '8px' }}>{c.emoji}</div>
                                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '15px' }}>{c.label}</div>
                            </motion.div>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    </section>
);

export default Categories;
