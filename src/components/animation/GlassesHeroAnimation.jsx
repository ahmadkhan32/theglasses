import React from 'react';
import { motion } from 'framer-motion';

const GlassesHeroAnimation = ({ image = '/images/hero_glasses.png' }) => {
    return (
        <motion.div
            style={{ perspective: 1200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
        >
            <motion.img
                src={image || 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800'}
                alt="Hero Glasses"
                animate={{
                    rotateY: [0, 10, -10, 0],
                    y: [0, -10, 0]
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    times: [0, 0.25, 0.75, 1]
                }}
                style={{
                    width: '100%',
                    maxWidth: '500px',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 20px 40px rgba(0,102,255,0.2))',
                    borderRadius: '24px'
                }}
            />
        </motion.div>
    );
};

export default GlassesHeroAnimation;
