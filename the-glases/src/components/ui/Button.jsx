import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    onClick,
    type = 'button',
    fullWidth = false,
    ...props
}) => {
    const sizes = {
        sm: { padding: '8px 16px', fontSize: '13px' },
        md: { padding: '12px 24px', fontSize: '15px' },
        lg: { padding: '16px 32px', fontSize: '17px' },
    };

    const variants = {
        primary: { backgroundColor: 'var(--accent-blue)', color: '#fff', border: '2px solid var(--accent-blue)' },
        outline: { backgroundColor: 'transparent', color: 'var(--accent-blue)', border: '2px solid var(--accent-blue)' },
        ghost: { backgroundColor: 'transparent', color: 'var(--text-primary)', border: '2px solid transparent' },
        danger: { backgroundColor: '#ef4444', color: '#fff', border: '2px solid #ef4444' },
        dark: { backgroundColor: '#0f172a', color: '#fff', border: '2px solid #0f172a' },
    };

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            whileHover={{ scale: disabled ? 1 : 1.03, y: disabled ? 0 : -2 }}
            whileTap={{ scale: 0.97 }}
            style={{
                ...variants[variant],
                ...sizes[size],
                fontFamily: 'inherit',
                fontWeight: 600,
                borderRadius: '10px',
                cursor: disabled || loading ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.5 : 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: fullWidth ? '100%' : 'auto',
                transition: 'background-color 0.2s',
                ...props.style,
            }}
        >
            {loading ? <span className="loader-spin" /> : children}
        </motion.button>
    );
};

export default Button;
