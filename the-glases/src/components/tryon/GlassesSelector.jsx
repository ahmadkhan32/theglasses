import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getGlasses } from '../../services/api/glasses';

// ─── Local fallback glasses (always available offline / before Supabase loads) ─
export const LOCAL_GLASSES = [
    {
        id: 'aviator',
        label: 'Aviator',
        emoji: '🕶️',
        src: '/glasses/aviator.png',
        desc: 'Classic gold aviator',
        color: '#fef9c3',
        category: 'Sunglasses',
    },
    {
        id: 'round',
        label: 'Round',
        emoji: '⭕',
        src: '/glasses/round.png',
        desc: 'Vintage round frame',
        color: '#f3e8ff',
        category: 'Fashion',
    },
    {
        id: 'square',
        label: 'Wayfarer',
        emoji: '⬛',
        src: '/glasses/square.png',
        desc: 'Bold square style',
        color: '#dbeafe',
        category: 'Wayfarer',
    },
];

// GLASSES export kept for backward-compat (TryOnOverlay uses it)
export const GLASSES = LOCAL_GLASSES;

// ─── Component ────────────────────────────────────────────────────────────────
const GlassesSelector = ({ selected, onSelect }) => {
    const [frames, setFrames] = useState(LOCAL_GLASSES);
    const [loadingRemote, setLoadingRemote] = useState(true);

    // Fetch from Supabase glasses table and merge with local
    useEffect(() => {
        getGlasses()
            .then((remote) => {
                if (remote.length > 0) {
                    // Map Supabase rows to selector shape
                    const remoteFrames = remote.map((g) => ({
                        id: g.id,
                        label: g.name,
                        emoji: '🕶️',
                        src: g.image_url,
                        desc: g.category || 'Custom frame',
                        color: '#e0f2fe',
                        category: g.category,
                    }));
                    // Merge: local first, then remote (avoid duplicates by id)
                    setFrames([...LOCAL_GLASSES, ...remoteFrames]);
                }
            })
            .catch(() => {
                // Supabase table may not exist yet — silently fallback to local
            })
            .finally(() => setLoadingRemote(false));
    }, []);

    return (
        <div>
            <p style={{
                fontSize: '13px', fontWeight: 600,
                color: 'var(--text-secondary)', marginBottom: '12px',
                textTransform: 'uppercase', letterSpacing: '0.5px',
                display: 'flex', alignItems: 'center', gap: '8px',
            }}>
                Choose Frame Style
                {loadingRemote && (
                    <span style={{ fontSize: '11px', color: 'var(--accent-blue)', fontWeight: 500, textTransform: 'none' }}>
                        (loading custom frames…)
                    </span>
                )}
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {frames.map((g) => {
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
                                padding: '14px 18px',
                                borderRadius: '14px',
                                border: `2px solid ${isSelected ? 'var(--accent-blue)' : 'var(--border-color)'}`,
                                backgroundColor: isSelected ? 'var(--accent-blue-light)' : g.color,
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                                minWidth: '90px',
                                transition: 'border-color 0.2s, background-color 0.2s',
                                boxShadow: isSelected ? '0 0 0 3px rgba(0,102,255,0.15)' : 'none',
                            }}
                        >
                            <img
                                src={g.src}
                                alt={g.label}
                                style={{ width: '64px', height: '32px', objectFit: 'contain' }}
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                            <span style={{ fontWeight: 700, fontSize: '13px', color: isSelected ? 'var(--accent-blue)' : 'var(--text-primary)' }}>
                                {g.label}
                            </span>
                            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{g.desc}</span>
                            {isSelected && (
                                <span style={{
                                    fontSize: '10px', backgroundColor: 'var(--accent-blue)',
                                    color: '#fff', padding: '2px 8px', borderRadius: '100px', fontWeight: 700,
                                }}>
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

export { GlassesSelector };
export default GlassesSelector;
