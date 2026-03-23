import React from 'react';
import { motion } from 'framer-motion';

const GlassesAnimation = ({ image = '/images/hero_glasses.png', altText = "Glasses" }) => {
    return (
        <motion.div
            style={{
                perspective: 1000,
                display: 'flex',
                justifyContent: 'center',
                padding: '24px'
            }}
        >
            <motion.img
                src={image}
                alt={altText}
                whileHover={{
                    rotateY: 20,
                    rotateX: 10,
                    scale: 1.1,
                    dropShadow: "0 20px 30px rgba(0,0,0,0.2)"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{
                    width: '100%',
                    maxWidth: '250px',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))',
                    cursor: 'pointer'
                }}
            />
        </motion.div>
    );
};

export default GlassesAnimation;
