import React, { useRef, useState } from 'react';
import { Upload, Camera, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TAB_STYLES = (active) => ({
  flex: 1,
  padding: '10px 0',
  border: 'none',
  borderBottom: `2px solid ${active ? 'var(--accent-blue)' : 'transparent'}`,
  background: 'transparent',
  cursor: 'pointer',
  fontWeight: '700',
  fontSize: '13px',
  color: active ? 'var(--accent-blue)' : 'var(--text-secondary)',
  transition: 'all 0.2s',
  fontFamily: 'inherit',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
});

const ImageUpload = ({ onImageSelect, image, onWebcamToggle, webcamMode }) => {
  const fileInputRef = useRef(null);
  const snapshotVideoRef = useRef(null);
  const snapshotCanvasRef = useRef(null);
  const snapshotStreamRef = useRef(null);

  const [tab, setTab] = useState('upload'); // 'upload' | 'webcam-capture'
  const [cameraOn, setCameraOn] = useState(false);
  const [snapError, setSnapError] = useState('');

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      onImageSelect(URL.createObjectURL(file));
      onWebcamToggle?.(false);
    }
  };

  // Switch tabs
  const switchTab = (t) => {
    setTab(t);
    stopSnapCamera();
    setSnapError('');
    if (t === 'upload') onWebcamToggle?.(false);        // static photo mode
    if (t === 'webcam-capture') onWebcamToggle?.(false); // capture = static
  };

  // â”€â”€ Live webcam tab (canvas) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Handled entirely by TryOnCanvas â€“ just toggle it

  // â”€â”€ Snapshot webcam tab â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const startSnapCamera = async () => {
    setSnapError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      snapshotStreamRef.current = stream;
      const vid = snapshotVideoRef.current;
      vid.srcObject = stream;
      await vid.play();
      setCameraOn(true);
    } catch {
      setSnapError('Camera access denied. Please allow camera in browser settings.');
    }
  };

  const stopSnapCamera = () => {
    snapshotStreamRef.current?.getTracks().forEach((t) => t.stop());
    snapshotStreamRef.current = null;
    if (snapshotVideoRef.current) snapshotVideoRef.current.srcObject = null;
    setCameraOn(false);
  };

  const takeSnapshot = () => {
    const vid = snapshotVideoRef.current;
    const cnv = snapshotCanvasRef.current;
    if (!vid || !cnv) return;
    cnv.width  = vid.videoWidth  || 640;
    cnv.height = vid.videoHeight || 480;
    cnv.getContext('2d').drawImage(vid, 0, 0);
    const dataUrl = cnv.toDataURL('image/png');
    stopSnapCamera();
    onImageSelect(dataUrl);
    onWebcamToggle?.(false);
    setTab('upload'); // switch back so Upload section shows the captured photo
  };

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '16px' }}>
        <button style={TAB_STYLES(tab === 'upload')} onClick={() => switchTab('upload')}>
          <Upload size={14} /> Upload Photo
        </button>
        <button style={TAB_STYLES(tab === 'live')} onClick={() => { setTab('live'); stopSnapCamera(); onWebcamToggle?.(true); }}>
          <Camera size={14} /> Live Webcam
        </button>
        <button style={TAB_STYLES(tab === 'webcam-capture')} onClick={() => switchTab('webcam-capture')}>
          <RefreshCw size={14} /> Capture Selfie
        </button>
      </div>

      <AnimatePresence mode="wait">
        {tab === 'upload' && (
          <motion.div key="upload" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <motion.div
              whileHover={{ scale: 1.01 }}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${image ? 'var(--accent-blue)' : 'var(--border-color)'}`,
                borderRadius: '14px',
                padding: '28px',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: image ? 'var(--accent-blue-light)' : 'var(--bg-secondary)',
                transition: 'all 0.2s',
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
            >
              {image ? (
                <div style={{ color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Camera size={20} />
                  <span style={{ fontWeight: '700', fontSize: '14px' }}>Photo uploaded - click to change</span>
                </div>
              ) : (
                <>
                  <Upload size={32} color="var(--text-light)" style={{ marginBottom: '10px' }} />
                  <p style={{ fontWeight: '700', fontSize: '14px', marginBottom: '4px' }}>Drop photo here or click to browse</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>JPG, PNG, WEBP - front-facing selfie works best</p>
                </>
              )}
            </motion.div>
            <input ref={fileInputRef} type="file" hidden accept="image/*"
              onChange={(e) => handleFile(e.target.files[0])} />
          </motion.div>
        )}

        {tab === 'live' && (
          <motion.div key="live" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div style={{
              borderRadius: '14px', padding: '24px',
              background: 'linear-gradient(135deg, #eff6ff, #f5f3ff)',
              border: '2px solid #c7d2fe',
              textAlign: 'center',
            }}>
              <Camera size={32} color="var(--accent-blue)" style={{ marginBottom: '10px' }} />
              <p style={{ fontWeight: '700', fontSize: '14px', marginBottom: '4px', color: 'var(--accent-blue)' }}>
                Live Webcam Mode Active
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', maxWidth: '280px', margin: '0 auto' }}>
                Your camera is shown on the canvas in real-time. Glasses auto-detect and follow your face.
              </p>
            </div>
          </motion.div>
        )}

        {tab === 'webcam-capture' && (
          <motion.div key="capture" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--border-color)', backgroundColor: '#000', position: 'relative' }}>
              <video
                ref={snapshotVideoRef}
                style={{ width: '100%', display: cameraOn ? 'block' : 'none', transform: 'scaleX(-1)' }}
                playsInline
                muted
              />
              {!cameraOn && (
                <div style={{ padding: '40px', textAlign: 'center' }}>
                  <Camera size={32} color="#475569" style={{ marginBottom: '12px' }} />
                  <p style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '600' }}>Camera is off</p>
                </div>
              )}
            </div>

            <canvas ref={snapshotCanvasRef} style={{ display: 'none' }} />

            {snapError && (
              <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '8px' }}>{snapError}</p>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
              {!cameraOn ? (
                <button onClick={startSnapCamera} style={btnStyle('var(--accent-blue)')}>
                  <Camera size={14} /> Start Camera
                </button>
              ) : (
                <>
                  <button onClick={takeSnapshot} style={btnStyle('#059669')}>
                    <Camera size={14} /> Take Photo
                  </button>
                  <button onClick={stopSnapCamera} style={btnStyle('#64748b')}>
                    Stop Camera
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const btnStyle = (bg) => ({
  flex: 1, padding: '10px 0', borderRadius: '10px', border: 'none',
  backgroundColor: bg, color: '#fff', cursor: 'pointer',
  fontWeight: '700', fontSize: '13px', fontFamily: 'inherit',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
});

export default ImageUpload;
