import React from 'react';
import { Maximize2, RotateCw } from 'lucide-react';

const sliderStyle = {
    width: '100%',
    height: '6px',
    borderRadius: '3px',
    outline: 'none',
    cursor: 'pointer',
    accentColor: 'var(--accent-blue)',
};

const Controls = ({ size, setSize, rotation, setRotation, onReset }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Size */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Maximize2 size={16} color="var(--accent-blue)" />
                        <span style={{ fontWeight: 600, fontSize: '14px' }}>Size</span>
                    </div>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 700 }}>
                        {size}px
                    </span>
                </div>
                <input
                    type="range"
                    min="80"
                    max="360"
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    style={sliderStyle}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-light)', marginTop: '4px' }}>
                    <span>Smaller</span>
                    <span>Larger</span>
                </div>
            </div>

            {/* Rotation */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <RotateCw size={16} color="var(--accent-blue)" />
                        <span style={{ fontWeight: 600, fontSize: '14px' }}>Rotation</span>
                    </div>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 700 }}>
                        {rotation}°
                    </span>
                </div>
                <input
                    type="range"
                    min="-45"
                    max="45"
                    value={rotation}
                    onChange={(e) => setRotation(Number(e.target.value))}
                    style={sliderStyle}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-light)', marginTop: '4px' }}>
                    <span>← Tilt left</span>
                    <span>Tilt right →</span>
                </div>
            </div>

            {/* Reset */}
            <button
                onClick={onReset}
                style={{
                    padding: '10px 20px',
                    borderRadius: '10px',
                    border: '1.5px solid var(--border-color)',
                    backgroundColor: '#fff',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    alignSelf: 'flex-start',
                }}
            >
                ↺ Reset Position
            </button>
        </div>
    );
};

export default Controls;
