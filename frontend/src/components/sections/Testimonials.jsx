import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import Container from '../layout/Container';

const TESTIMONIALS = [
  {
    name: 'Ayesha Raza',
    location: 'Lahore',
    rating: 5,
    comment: 'Absolutely love my blue light glasses! My eyes feel so much better after long work sessions. The quality is superb and delivery was super fast.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80',
  },
  {
    name: 'Ahmed Khan',
    location: 'Karachi',
    rating: 5,
    comment: "Got the classic gold aviators and I get compliments every day. The lenses are crystal clear and the frame is very sturdy. 100% recommend!",
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80',
  },
  {
    name: 'Sara Malik',
    location: 'Islamabad',
    rating: 5,
    comment: "The try-on feature is genius! Found my perfect round frames without leaving home. Fast shipping and the packaging was gorgeous.",
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80',
  },
  {
    name: 'Usman Butt',
    location: 'Faisalabad',
    rating: 4,
    comment: "Great sunglasses at an unbeatable price. Polarized lenses block glare perfectly. Will definitely be ordering more frames soon.",
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80',
  },
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setCurrent((c) => (c + 1) % TESTIMONIALS.length);

  const visible = [
    TESTIMONIALS[current],
    TESTIMONIALS[(current + 1) % TESTIMONIALS.length],
    TESTIMONIALS[(current + 2) % TESTIMONIALS.length],
  ];

  return (
    <section style={{ padding: '80px 0', backgroundColor: '#fff' }}>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <p style={{ color: 'var(--accent-blue)', fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
            What Customers Say
          </p>
          <h2 style={{ fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: '800', letterSpacing: '-0.5px' }}>
            Loved by Thousands ⭐
          </h2>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px',
          marginBottom: '32px',
        }}>
          {visible.map((t, i) => (
            <motion.div
              key={`${current}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid var(--border-color)',
              }}
            >
              <div style={{ display: 'flex', marginBottom: '12px' }}>
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={16} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '20px' }}>
                "{t.comment}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={t.avatar}
                  alt={t.name}
                  style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div>
                  <div style={{ fontWeight: '700', fontSize: '14px' }}>{t.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>{t.location}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <button onClick={prev} aria-label="Previous" style={{
            width: '42px', height: '42px', borderRadius: '50%',
            border: '1px solid var(--border-color)', background: '#fff',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ChevronLeft size={18} />
          </button>
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              style={{
                width: '8px', height: '8px', borderRadius: '50%', border: 'none',
                backgroundColor: i === current ? 'var(--accent-blue)' : 'var(--border-color)',
                cursor: 'pointer',
              }}
            />
          ))}
          <button onClick={next} aria-label="Next" style={{
            width: '42px', height: '42px', borderRadius: '50%',
            border: '1px solid var(--border-color)', background: '#fff',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ChevronRight size={18} />
          </button>
        </div>
      </Container>
    </section>
  );
};

export default Testimonials;
