import React from 'react';
import { motion } from 'framer-motion';

const HoverTilt = ({ children, intensity = 15 }) => {
    return (
        <motion.div
            whileHover={{
                rotateY: intensity,
                rotateX: intensity / 2,
                scale: 1.04,
                transition: { type: 'spring', stiffness: 300, damping: 20 }
            }}
            style={{ perspective: 1000 }}
        >
            {children}
        </motion.div>
    );
};

export default HoverTilt;
