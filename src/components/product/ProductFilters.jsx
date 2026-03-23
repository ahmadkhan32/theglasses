import React from 'react';
import { CATEGORIES } from '../../utils/constants';

const ProductFilters = ({ selected, onSelect, search, onSearch }) => {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '32px' }}>
            <input
                type="text"
                placeholder="Search glasses..."
                value={search}
                onChange={(e) => onSearch(e.target.value)}
                style={{
                    padding: '10px 16px',
                    borderRadius: '10px',
                    border: '1.5px solid var(--border-color)',
                    fontSize: '14px',
                    outline: 'none',
                    minWidth: '220px',
                    fontFamily: 'inherit',
                    flex: '1 1 220px',
                }}
            />
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.value}
                        onClick={() => onSelect(cat.value)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            border: '1.5px solid',
                            borderColor: selected === cat.value ? 'var(--accent-blue)' : 'var(--border-color)',
                            backgroundColor: selected === cat.value ? 'var(--accent-blue)' : 'transparent',
                            color: selected === cat.value ? '#fff' : 'var(--text-secondary)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: '13px',
                            transition: 'all 0.2s',
                            fontFamily: 'inherit',
                        }}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ProductFilters;
