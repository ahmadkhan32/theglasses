import React from 'react';
import { motion } from 'framer-motion';

export const GLASSES = [
  {
    id: 'aviator',
    label: 'Aviator',
    src: '/glasses/aviator.svg',
    desc: 'Classic gold pilot frame',
    color: '#c8a830',
    categorySlug: 'aviators',
    productSlug: 'classic-gold-aviator',
    price: 'Rs. 2,499',
    title: 'Classic Gold Aviator',
    details: 'UV400 lenses, adjustable nose pads, lightweight metal build',
  },
  {
    id: 'round',
    label: 'Round',
    src: '/glasses/round.svg',
    desc: 'Vintage wire rim',
    color: '#9a9a9a',
    categorySlug: 'round',
    productSlug: 'retro-round-silver',
    price: 'Rs. 1,899',
    title: 'Retro Round Silver',
    details: 'Slim steel frame, vintage profile, prescription ready',
  },
  {
    id: 'wayfarer',
    label: 'Wayfarer',
    src: '/glasses/wayfarer.svg',
    desc: 'Bold matte black',
    color: '#333333',
    categorySlug: 'wayfarer',
    productSlug: 'wayfarer-matte-black',
    price: 'Rs. 899',
    title: 'Wayfarer Matte Black',
    details: 'Acetate body, spring hinges, confident everyday shape',
  },
  {
    id: 'cat-eye',
    label: 'Cat-Eye',
    src: '/glasses/cat-eye.svg',
    desc: 'Rose gold fashion',
    color: '#d4748a',
    categorySlug: 'cat-eye',
    productSlug: 'cat-eye-rose-gold',
    price: 'Rs. 5,999',
    title: 'Cat-Eye Rose Gold',
    details: 'Fashion-forward lift, metallic finish, elegant light feel',
  },
];

const GlassesSelector = ({ selectedId, onSelect }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
      {GLASSES.map((g) => {
        const isSelected = selectedId === g.id;
        return (
          <motion.button
            key={g.id}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(g)}
            style={{
              padding: '12px 10px',
              borderRadius: '12px',
              border: `2px solid ${isSelected ? g.color : 'var(--border-color)'}`,
              backgroundColor: isSelected ? `${g.color}18` : 'var(--bg-secondary)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.18s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {isSelected && (
              <div style={{
                position: 'absolute', top: 6, right: 6,
                width: 10, height: 10, borderRadius: '50%',
                backgroundColor: g.color,
              }} />
            )}
            <img
              src={g.src}
              alt={g.label}
              style={{ width: '90px', height: '36px', objectFit: 'contain' }}
              onError={(e) => { e.currentTarget.style.opacity = '0.3'; }}
            />
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '12px', fontWeight: '700',
                color: isSelected ? g.color : 'var(--text-primary)',
              }}>
                {g.label}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>
                {g.desc}
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

export default GlassesSelector;
