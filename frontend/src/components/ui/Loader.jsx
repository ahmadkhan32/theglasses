import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ size = 40, color = 'var(--accent-blue)', fullPage = false }) => {
  const spinner = (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
      style={{
        width: size, height: size,
        border: `3px solid ${color}30`,
        borderTop: `3px solid ${color}`,
        borderRadius: '50%',
      }}
    />
  );

  if (fullPage) {
    return (
      <div style={{
        minHeight: '60vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
      }}>
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Loader;
