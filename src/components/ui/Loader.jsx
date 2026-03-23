import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ size = 40, color = 'var(--accent-blue)', fullScreen = false }) => {
    const spinner = (
        <motion.div
            style={{
                width: size,
                height: size,
                borderRadius: '50%',
                border: `3px solid var(--bg-tertiary)`,
                borderTopColor: color,
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
    );

    if (fullScreen) {
        return (
            <div style={{
                position: 'fixed', inset: 0, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                backgroundColor: 'rgba(255,255,255,0.85)', zIndex: 999
            }}>
                {spinner}
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
            {spinner}
        </div>
    );
};

export default Loader;
