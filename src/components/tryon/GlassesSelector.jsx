import React from 'react';
import { motion } from 'framer-motion';

const GLASSES = [
    {
        id: 'aviator',
        label: 'Aviator',
        emoji: '🕶️',
        src: '/glasses/aviator.png',
        desc: 'Classic gold aviator',
        color: '#fef9c3',
    },
    {
        id: 'round',
        label: 'Round',
        emoji: '⭕',
        src: '/glasses/round.png',
        desc: 'Vintage round frame',
        color: '#f3e8ff',
    },
    {
        id: 'square',
        label: 'Wayfarer',
        emoji: '⬛',
        src: '/glasses/square.png',
        desc: 'Bold square style',
        color: '#dbeafe',
    },
];

const GlassesSelector = ({ selected, onSelect }) => {
    return (
        <div>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Choose Frame Style
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {GLASSES.map((g) => {
                    const isSelected = selected === g.id;
                    return (
                        <motion.button
                            key={g.id}
                            onClick={() => onSelect(g)}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '16px 20px',
                                borderRadius: '14px',
                                border: `2px solid ${isSelected ? 'var(--accent-blue)' : 'var(--border-color)'}`,
                                backgroundColor: isSelected ? 'var(--accent-blue-light)' : g.color,
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                                minWidth: '100px',
                                transition: 'border-color 0.2s',
                            }}
                        >
                            <img
                                src={g.src}
                                alt={g.label}
                                style={{ width: '60px', height: '30px', objectFit: 'contain' }}
                            />
                            <span style={{ fontWeight: 700, fontSize: '13px', color: isSelected ? 'var(--accent-blue)' : 'var(--text-primary)' }}>
                                {g.label}
                            </span>
                            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{g.desc}</span>
                            {isSelected && (
                                <span style={{ fontSize: '10px', backgroundColor: 'var(--accent-blue)', color: '#fff', padding: '2px 8px', borderRadius: '100px', fontWeight: 700 }}>
                                    Selected
                                </span>
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};

export { GLASSES };
export default GlassesSelector;
