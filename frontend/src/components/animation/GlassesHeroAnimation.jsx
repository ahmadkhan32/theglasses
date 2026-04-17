import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { floatingAnimation, heroGlassesEntrance } from '../../animations/gsapAnimations';

const GlassesHeroAnimation = ({ image }) => {
  const imgRef = useRef(null);

  useEffect(() => {
    if (imgRef.current) {
      heroGlassesEntrance(imgRef.current);
      setTimeout(() => floatingAnimation(imgRef.current), 1200);
    }
  }, []);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Glow blob behind glasses */}
      <div style={{
        position: 'absolute', inset: '-20%',
        background: 'radial-gradient(ellipse, rgba(0,102,255,0.18) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(20px)',
        zIndex: 0,
      }} />

      <motion.img
        ref={imgRef}
        src={image}
        alt="Featured Glasses"
        whileHover={{ rotate: 3, scale: 1.06 }}
        transition={{ type: 'spring', stiffness: 200 }}
        style={{
          maxWidth: '520px',
          width: '100%',
          objectFit: 'contain',
          position: 'relative',
          zIndex: 1,
          filter: 'drop-shadow(0 24px 40px rgba(0,102,255,0.2))',
        }}
        onError={(e) => {
          e.currentTarget.src = 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&q=80';
        }}
      />
    </div>
  );
};

export default GlassesHeroAnimation;
