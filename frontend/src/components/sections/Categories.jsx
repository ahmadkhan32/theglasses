import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Container from '../layout/Container';

const CATEGORIES = [
  {
    name: 'Blue Light',
    slug: 'blue-light',
    emoji: '💻',
    image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=400&q=80',
    description: 'Screen protection',
  },
  {
    name: 'Sunglasses',
    slug: 'sunglasses',
    emoji: '☀️',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80',
    description: 'UV400 protection',
  },
  {
    name: 'Aviators',
    slug: 'aviators',
    emoji: '✈️',
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&q=80',
    description: 'Timeless classic',
  },
  {
    name: 'Round Frames',
    slug: 'round',
    emoji: '🔵',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&q=80',
    description: 'Vintage style',
  },
  {
    name: 'Square & Wayfarer',
    slug: 'square',
    emoji: '⬛',
    image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&q=80',
    description: 'Modern bold',
  },
];

const Categories = () => (
  <section style={{ padding: '80px 0', backgroundColor: 'var(--bg-secondary)' }}>
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ textAlign: 'center', marginBottom: '48px' }}
      >
        <p style={{ color: 'var(--accent-blue)', fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
          Browse by Type
        </p>
        <h2 style={{ fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: '800', letterSpacing: '-0.5px' }}>Shop by Category</h2>
      </motion.div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '20px',
      }}>
        {CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              to={`/shop?category=${cat.slug}`}
              style={{
                display: 'block',
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative',
                aspectRatio: '4/3',
                textDecoration: 'none',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              {/* Background image */}
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.4s ease',
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              {/* Overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%)',
                display: 'flex', flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '16px',
              }}>
                <div style={{ fontSize: '22px', marginBottom: '4px' }}>{cat.emoji}</div>
                <div style={{ color: '#fff', fontWeight: '700', fontSize: '15px' }}>{cat.name}</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>{cat.description}</div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </Container>
  </section>
);

export default Categories;
