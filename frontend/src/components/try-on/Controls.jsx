import React from 'react';
import { Maximize2, RotateCw, Eye, RotateCcw, Scan, CheckCircle2, AlertCircle, Loader } from 'lucide-react';

const Slider = ({ icon: Icon, label, value, displayValue, min, max, step = 1, onChange, color = 'var(--accent-blue)' }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
      <span style={{ fontWeight: '600', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
        <Icon size={14} color={color} /> {label}
      </span>
      <span style={{
        fontSize: '12px', fontWeight: '700', color,
        background: `${color}18`, padding: '2px 8px', borderRadius: '99px',
      }}>
        {displayValue}
      </span>
    </div>
    <input
      type="range" min={min} max={max} step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{ width: '100%', accentColor: color, cursor: 'pointer' }}
    />
  </div>
);

// Detection status badge colours
const DETECT_META = {
  idle:      { color: '#64748b', bg: '#f1f5f9', label: 'No photo yet',       Icon: Scan },
  detecting: { color: '#d97706', bg: '#fffbeb', label: 'Detecting face...',   Icon: Loader },
  found:     { color: '#059669', bg: '#f0fdf4', label: 'Face detected',       Icon: CheckCircle2 },
  not_found: { color: '#dc2626', bg: '#fef2f2', label: 'No face found - drag manually', Icon: AlertCircle },
  error:     { color: '#dc2626', bg: '#fef2f2', label: 'Detection failed - drag manually', Icon: AlertCircle },
};

const Controls = ({
  sizeScale, setSizeScale,
  rotation, setRotation,
  opacity, setOpacity,
  onReset,
  detectStatus = 'idle',
  hasImage,
}) => {
  const meta = DETECT_META[detectStatus] || DETECT_META.idle;
  const { Icon: StatusIcon } = meta;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Detection status badge */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        backgroundColor: meta.bg, color: meta.color,
        padding: '10px 14px', borderRadius: '10px',
        fontSize: '13px', fontWeight: '600',
        border: `1px solid ${meta.color}30`,
        transition: 'all 0.25s',
      }}>
        <StatusIcon
          size={15}
          style={detectStatus === 'detecting' ? { animation: 'spin 1.2s linear infinite' } : {}}
        />
        {meta.label}
      </div>

      {/* Sliders â€” only enabled when there's an image */}
      <div style={{ opacity: hasImage ? 1 : 0.4, pointerEvents: hasImage ? 'auto' : 'none', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Slider
          icon={Maximize2}
          label="Size Scale"
          value={Math.round(sizeScale * 100)}
          displayValue={`${Math.round(sizeScale * 100)}%`}
          min={50} max={200}
          onChange={(v) => setSizeScale(v / 100)}
          color="var(--accent-blue)"
        />
        <Slider
          icon={RotateCw}
          label="Tilt Fine-tune"
          value={rotation}
          displayValue={`${rotation > 0 ? '+' : ''}${rotation}deg`}
          min={-30} max={30}
          onChange={setRotation}
          color="#7c3aed"
        />
        <Slider
          icon={Eye}
          label="Opacity"
          value={Math.round(opacity * 100)}
          displayValue={`${Math.round(opacity * 100)}%`}
          min={20} max={100}
          onChange={(v) => setOpacity(v / 100)}
          color="#059669"
        />

        <button
          onClick={onReset}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            padding: '10px', borderRadius: '8px',
            border: '1.5px solid var(--border-color)',
            backgroundColor: 'var(--bg-secondary)',
            cursor: 'pointer', fontWeight: '600', fontSize: '12px',
            color: 'var(--text-secondary)', transition: 'background 0.15s',
            fontFamily: 'inherit', width: '100%',
          }}
        >
          <RotateCcw size={13} /> Reset Adjustments
        </button>
      </div>

      {/* Tips */}
      <div style={{
        fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6',
        borderTop: '1px solid var(--border-color)', paddingTop: '16px',
      }}>
        <p style={{ fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)' }}>Tips</p>
        <ul style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <li>Face camera directly for best auto-detect</li>
          <li>Good even lighting improves accuracy</li>
          <li>Drag the canvas to fine-tune position</li>
          <li>Use Size % if glasses look too big/small</li>
          <li>Live Webcam mode works in real time</li>
        </ul>
      </div>
    </div>
  );
};

export default Controls;
