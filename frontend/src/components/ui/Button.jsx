import React from 'react';
import { motion } from 'framer-motion';

const variants = {
  primary: {
    bg: 'var(--accent-blue)', color: '#fff', border: 'none',
  },
  outline: {
    bg: 'transparent', color: 'var(--accent-blue)',
    border: '2px solid var(--accent-blue)',
  },
  ghost: {
    bg: 'transparent', color: 'var(--text-primary)', border: 'none',
  },
  dark: {
    bg: 'var(--text-primary)', color: '#fff', border: 'none',
  },
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  style = {},
}) => {
  const v = variants[variant] || variants.primary;
  const padding = size === 'sm' ? '8px 16px' : size === 'lg' ? '14px 32px' : '10px 22px';
  const fontSize = size === 'sm' ? '13px' : size === 'lg' ? '16px' : '14px';

  return (
    <motion.button
      type={type}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center', justifyContent: 'center', gap: '8px',
        padding, fontSize, fontWeight: '600',
        borderRadius: '10px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        width: fullWidth ? '100%' : 'auto',
        transition: 'background-color 0.2s, box-shadow 0.2s',
        fontFamily: 'inherit',
        ...v,
        ...style,
      }}
    >
      {children}
    </motion.button>
  );
};

export default Button;
