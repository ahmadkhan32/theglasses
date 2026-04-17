import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Container from '../layout/Container';
import GlassesHeroAnimation from '../animation/GlassesHeroAnimation';
import Button from '../ui/Button';

const HERO_IMG = 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=700&q=80';

const Hero = () => (
  <section style={{
    background: 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 50%, #fdf4ff 100%)',
    padding: '100px 0 80px',
    overflow: 'hidden',
    position: 'relative',
  }}>
    {/* Background decoration */}
    <div style={{
      position: 'absolute', top: '-100px', right: '-100px',
      width: '500px', height: '500px',
      background: 'radial-gradient(circle, rgba(0,102,255,0.08) 0%, transparent 70%)',
      borderRadius: '50%', pointerEvents: 'none',
    }} />

    <Container>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '60px',
        alignItems: 'center',
      }} className="hero-grid">

        {/* Left — text */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span style={{
              display: 'inline-block',
              backgroundColor: 'var(--accent-blue-light)',
              color: 'var(--accent-blue)',
              fontSize: '13px',
              fontWeight: '700',
              padding: '6px 14px',
              borderRadius: '100px',
              marginBottom: '20px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              🕶️ New Season Collection
            </span>

            <h1 style={{
              fontSize: 'clamp(36px, 5vw, 60px)',
              fontWeight: '800',
              lineHeight: '1.1',
              letterSpacing: '-1.5px',
              marginBottom: '20px',
            }}>
              See the World{' '}
              <span className="text-gradient">in Style.</span>
            </h1>

            <p style={{
              fontSize: '17px',
              color: 'var(--text-secondary)',
              lineHeight: '1.7',
              marginBottom: '36px',
              maxWidth: '420px',
            }}>
              Premium eyewear crafted for every face. Blue light blockers, UV sunglasses, aviators — discover your perfect pair.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link to="/shop">
                <Button size="lg">
                  Shop Now <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/try-on">
                <Button variant="outline" size="lg">
                  🕶️ Try On Virtually
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '32px', marginTop: '48px' }}>
              {[
                { value: '500+', label: 'Happy Customers' },
                { value: '4.9★', label: 'Average Rating' },
                { value: '50+', label: 'Frame Styles' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)' }}>{value}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right — glasses animation */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <GlassesHeroAnimation image={HERO_IMG} />
        </motion.div>
      </div>
    </Container>
  </section>
);

export default Hero;
