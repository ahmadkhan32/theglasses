import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, ShoppingBag, Info, Save, Trash2, Clock, CheckCircle, XCircle, LogIn } from 'lucide-react';
import TryOnCanvas from '../components/tryon/TryOnCanvas';
import ImageUpload from '../components/tryon/ImageUpload';
import Controls from '../components/tryon/Controls';
import GlassesSelector, { GLASSES } from '../components/tryon/GlassesSelector';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import useTryOn from '../hooks/useTryOn';

const DEFAULT_SIZE = 180;
const DEFAULT_ROTATION = 0;
const DEFAULT_OPACITY = 1;

// ─── Toast component ──────────────────────────────────────────────────────────
const Toast = ({ message, type }) => (
    <AnimatePresence>
        {message && (
            <motion.div
                key={message}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20 }}
                style={{
                    position: 'fixed',
                    bottom: '28px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 9999,
                    backgroundColor: type === 'success' ? '#22c55e' : '#ef4444',
                    color: '#fff',
                    padding: '12px 24px',
                    borderRadius: '100px',
                    fontWeight: 600,
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                }}
            >
                {type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                {message}
            </motion.div>
        )}
    </AnimatePresence>
);

// ─── Session History Card ─────────────────────────────────────────────────────
const SessionCard = ({ session, onDelete }) => (
    <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '12px 14px',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '14px',
            border: '1px solid var(--border-color)',
        }}
    >
        {/* Thumbnail */}
        {session.preview_url ? (
            <img
                src={session.preview_url}
                alt="preview"
                style={{ width: '60px', height: '52px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0 }}
            />
        ) : (
            <div style={{
                width: '60px', height: '52px', borderRadius: '10px', backgroundColor: '#e2e8f0',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0
            }}>🕶️</div>
        )}

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 700, fontSize: '13px', marginBottom: '2px', color: 'var(--text-primary)' }}>
                {session.glasses_label}
            </p>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Size {session.glasses_size}px · {session.glasses_rotation}° · {Math.round(session.glasses_opacity * 100)}% opacity
            </p>
            <p style={{ fontSize: '10px', color: 'var(--text-light)', marginTop: '2px' }}>
                {new Date(session.created_at).toLocaleDateString()}
            </p>
        </div>

        {/* Delete */}
        <button
            onClick={() => onDelete(session.id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', padding: '4px' }}
            title="Delete session"
        >
            <Trash2 size={16} />
        </button>
    </motion.div>
);

// ─── Main TryOn Page ─────────────────────────────────────────────────────────
const TryOn = () => {
    const [userImage, setUserImage] = useState(null);
    const [selectedGlasses, setSelectedGlasses] = useState(GLASSES[0]);
    const [size, setSize] = useState(DEFAULT_SIZE);
    const [rotation, setRotation] = useState(DEFAULT_ROTATION);
    const [opacity, setOpacity] = useState(DEFAULT_OPACITY);
    const [downloadDone, setDownloadDone] = useState(false);
    const canvasRef = useRef(null);

    const {
        saving,
        sessions,
        sessionsLoading,
        error,
        successMsg,
        userId,
        saveSession,
        deleteSession,
    } = useTryOn(canvasRef);

    const handleReset = useCallback(() => {
        setSize(DEFAULT_SIZE);
        setRotation(DEFAULT_ROTATION);
        setOpacity(DEFAULT_OPACITY);
    }, []);

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = `the-glases-tryon-${selectedGlasses.id}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        setDownloadDone(true);
        setTimeout(() => setDownloadDone(false), 3000);
    };

    const handleSave = async () => {
        try {
            await saveSession({ glasses: selectedGlasses, size, rotation, opacity });
        } catch (_) { /* errors handled by hook */ }
    };

    const toastMsg = successMsg || error;
    const toastType = successMsg ? 'success' : 'error';

    return (
        <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)', padding: '48px 0 80px' }}>
            {/* Toast */}
            <Toast message={toastMsg} type={toastType} />

            <div className="container">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: 'center', marginBottom: '48px' }}
                >
                    <span style={{ display: 'inline-block', backgroundColor: 'var(--accent-blue-light)', color: 'var(--accent-blue)', padding: '6px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 700, marginBottom: '16px' }}>
                        🕶️ Virtual Try-On
                    </span>
                    <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', marginBottom: '12px' }}>
                        Try Before You Buy
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '17px', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
                        Upload your photo, pick a frame, drag it into position — preview exactly how it'll look on your face.
                    </p>
                </motion.div>

                {/* Tip banner */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--accent-blue-light)', borderRadius: '12px', padding: '12px 18px', marginBottom: '36px', maxWidth: '700px', margin: '0 auto 36px' }}
                >
                    <Info size={18} color="var(--accent-blue)" style={{ flexShrink: 0 }} />
                    <p style={{ fontSize: '14px', color: 'var(--accent-blue)', fontWeight: 500 }}>
                        <strong>Tip:</strong> Upload a front-facing close-up photo for best results. Drag the glasses to align with your eyes.
                    </p>
                </motion.div>

                {/* Main layout */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', alignItems: 'start', maxWidth: '1100px', margin: '0 auto' }}>

                    {/* Left Panel — Controls */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}
                    >
                        {/* Upload */}
                        <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' }}>
                            <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '16px' }}>1. Upload Your Photo</h3>
                            <ImageUpload onImageSelect={setUserImage} image={userImage} />
                        </div>

                        {/* Glasses selector */}
                        <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' }}>
                            <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '16px' }}>2. Select Frame Style</h3>
                            <GlassesSelector selected={selectedGlasses.id} onSelect={setSelectedGlasses} />
                        </div>

                        {/* Controls */}
                        <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' }}>
                            <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '20px' }}>3. Adjust Fit</h3>
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                                🖱️ <strong>Drag glasses</strong> on the preview to position them. Use sliders below to resize, tilt and adjust opacity.
                            </p>
                            <Controls
                                size={size}
                                setSize={setSize}
                                rotation={rotation}
                                setRotation={setRotation}
                                opacity={opacity}
                                setOpacity={setOpacity}
                                onReset={handleReset}
                            />
                        </div>

                        {/* Actions */}
                        <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '4px' }}>4. Save & Shop</h3>

                            {/* Download */}
                            <Button variant="primary" fullWidth onClick={handleDownload} disabled={!userImage}>
                                <Download size={16} />
                                {downloadDone ? '✓ Downloaded!' : 'Download Preview'}
                            </Button>

                            {/* Save to Supabase */}
                            {userId ? (
                                <Button variant="outline" fullWidth onClick={handleSave} disabled={!userImage || saving}>
                                    <Save size={16} />
                                    {saving ? 'Saving…' : 'Save to My Sessions'}
                                </Button>
                            ) : (
                                <Link to="/login" style={{ display: 'block' }}>
                                    <Button variant="outline" fullWidth>
                                        <LogIn size={16} />
                                        Log in to Save Sessions
                                    </Button>
                                </Link>
                            )}

                            {/* Buy */}
                            <Link to="/shop" style={{ display: 'block' }}>
                                <Button variant="outline" fullWidth>
                                    <ShoppingBag size={16} />
                                    Buy {selectedGlasses?.label} Glasses
                                </Button>
                            </Link>

                            {!userImage && (
                                <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-light)' }}>
                                    Upload a photo to enable download & save
                                </p>
                            )}
                        </div>
                    </motion.div>

                    {/* Right Panel — Canvas + History */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}
                    >
                        {/* Canvas */}
                        <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)', position: 'sticky', top: '96px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h3 style={{ fontSize: '17px', fontWeight: 700 }}>Live Preview</h3>
                                <span style={{ backgroundColor: 'var(--bg-secondary)', padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                    {selectedGlasses?.label}
                                </span>
                            </div>
                            <TryOnCanvas
                                userImage={userImage}
                                glassesImage={selectedGlasses.src}
                                size={size}
                                rotation={rotation}
                                opacity={opacity}
                                canvasRef={canvasRef}
                            />
                            <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-light)', marginTop: '12px' }}>
                                Drag the glasses to reposition • Use sliders to adjust fit
                            </p>
                        </div>

                        {/* Session History (visible only when logged in) */}
                        {userId && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                    <Clock size={16} color="var(--accent-blue)" />
                                    <h3 style={{ fontSize: '17px', fontWeight: 700 }}>Saved Sessions</h3>
                                    <span style={{ marginLeft: 'auto', backgroundColor: 'var(--accent-blue-light)', color: 'var(--accent-blue)', padding: '2px 10px', borderRadius: '100px', fontSize: '12px', fontWeight: 700 }}>
                                        {sessions.length}
                                    </span>
                                </div>

                                {sessionsLoading ? (
                                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px', padding: '20px 0' }}>Loading…</p>
                                ) : sessions.length === 0 ? (
                                    <p style={{ textAlign: 'center', color: 'var(--text-light)', fontSize: '13px', padding: '20px 0' }}>
                                        No saved sessions yet. Click "Save to My Sessions" after trying on glasses!
                                    </p>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '340px', overflowY: 'auto' }}>
                                        <AnimatePresence>
                                            {sessions.map((s) => (
                                                <SessionCard key={s.id} session={s} onDelete={deleteSession} />
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </div>
        </main>
    );
};

export default TryOn;
