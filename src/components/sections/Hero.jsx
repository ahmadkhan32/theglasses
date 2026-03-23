import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import GlassesHeroAnimation from '../animation/GlassesHeroAnimation';
import Button from '../ui/Button';
import { scrollFadeInLeft, scrollFadeInRight } from '../../animations/scrollReveal';

const Hero = () => {
    return (
        <section style={{
            minHeight: '90vh',
            display: 'flex',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #f8faff 0%, #eef2ff 100%)',
            padding: '40px 0',
            overflow: 'hidden'
        }}>
            <div className="container" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '60px',
                alignItems: 'center'
            }}>
                {/* Left — Text */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={scrollFadeInLeft}
                >
                    <span style={{
                        display: 'inline-block',
                        backgroundColor: 'var(--accent-blue-light)',
                        color: 'var(--accent-blue)',
                        padding: '6px 16px', borderRadius: '100px',
                        fontSize: '13px', fontWeight: 700, marginBottom: '20px'
                    }}>
                        🕶️ Premium Eyewear — Pakistan
                    </span>

                    <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', lineHeight: 1.1, marginBottom: '24px' }}>
                        See the World<br />in <span style={{ color: 'var(--accent-blue)' }}>Style.</span>
                    </h1>

                    <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '36px', maxWidth: '440px', lineHeight: 1.7 }}>
                        Discover our premium glasses collection — Blue Light, UV, Sunglasses, and more. Fast delivery, COD available.
                    </p>

                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <Link to="/shop">
                            <Button variant="primary" size="lg">Shop Now</Button>
                        </Link>
                        <Button variant="outline" size="lg" onClick={() => document.getElementById('try-on')?.scrollIntoView({ behavior: 'smooth' })}>
                            Try On 🕶️
                        </Button>
                    </div>

                    <div style={{ marginTop: '48px', display: 'flex', gap: '40px' }}>
                        {[{ num: '10k+', label: 'Happy Customers' }, { num: 'Free', label: 'Shipping above Rs. 2000' }, { num: '7-Day', label: 'Easy Returns' }].map((s) => (
                            <div key={s.label}>
                                <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>{s.num}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Right — Animation */}
                <motion.div initial="hidden" animate="visible" variants={scrollFadeInRight}>
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            position: 'absolute', top: '50%', left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '120%', height: '120%',
                            background: 'radial-gradient(circle, rgba(0,102,255,0.07) 0%, transparent 70%)',
                            borderRadius: '50%', zIndex: 0
                        }} />
                        <GlassesHeroAnimation image="/images/hero_glasses.png" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
