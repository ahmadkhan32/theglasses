import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, ShoppingBag, Info, Save, Trash2, Clock, CheckCircle, XCircle, LogIn, Camera as CameraIcon, Image as ImageIcon } from 'lucide-react';
import FabricEditor from '../components/tryon/FabricEditor';
import TryOnAI from '../components/tryon/TryOnAI';
import ImageUpload from '../components/tryon/ImageUpload';
import Controls from '../components/tryon/Controls';
import GlassesSelector, { LOCAL_GLASSES } from '../components/tryon/GlassesSelector';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import useTryOn from '../hooks/useTryOn';
import useResponsive from '../hooks/useResponsive';

const DEFAULT_OPACITY = 1;

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ message, type }) => (
    <AnimatePresence>
        {message && (
            <motion.div
                key={message}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20 }}
                style={{
                    position: 'fixed', bottom: '28px', left: '50%',
                    transform: 'translateX(-50%)', zIndex: 9999,
                    backgroundColor: type === 'success' ? '#22c55e' : '#ef4444',
                    color: '#fff', padding: '12px 24px', borderRadius: '100px',
                    fontWeight: 600, fontSize: '14px',
                    display: 'flex', alignItems: 'center', gap: '8px',
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
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        style={{
            display: 'flex', alignItems: 'center', gap: '14px',
            padding: '12px 14px', backgroundColor: 'var(--bg-secondary)',
            borderRadius: '14px', border: '1px solid var(--border-color)',
        }}
    >
        {session.preview_url ? (
            <img src={session.preview_url} alt="preview" style={{ width: '60px', height: '52px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0 }} />
        ) : (
            <div style={{ width: '60px', height: '52px', borderRadius: '10px', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>🕶️</div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 700, fontSize: '13px', marginBottom: '2px', color: 'var(--text-primary)' }}>{session.glasses_label}</p>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Size {session.glasses_size}px · {session.glasses_rotation}° · {Math.round(session.glasses_opacity * 100)}% opacity
            </p>
            <p style={{ fontSize: '10px', color: 'var(--text-light)', marginTop: '2px' }}>
                {new Date(session.created_at).toLocaleDateString()}
            </p>
        </div>
        <button onClick={() => onDelete(session.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', padding: '4px' }}>
            <Trash2 size={16} />
        </button>
    </motion.div>
);

// ─── Main TryOn Page ──────────────────────────────────────────────────────────
const TryOn = () => {
    const { isMobile, isDesktop } = useResponsive();
    const [mode, setMode] = useState('manual');           // 'manual' | 'ai'
    const [userImage, setUserImage] = useState(null);
    const [selectedGlasses, setSelectedGlasses] = useState(LOCAL_GLASSES[0]);
    const [opacity, setOpacity] = useState(DEFAULT_OPACITY);
    const [downloadDone, setDownloadDone] = useState(false);
    const [cartMsg, setCartMsg] = useState(null);

    // FabricEditor exposes toDataURL via forwardRef
    const fabricEditorRef = useRef(null);

    const { saving, sessions, sessionsLoading, error, successMsg, userId, saveSession, deleteSession } = useTryOn(null);

    const handleReset = useCallback(() => { setOpacity(DEFAULT_OPACITY); }, []);

    // Download: use Fabric canvas toDataURL
    const handleDownload = () => {
        const dataUrl = fabricEditorRef.current?.toDataURL({ format: 'png', multiplier: 1 });
        if (!dataUrl) return;
        const link = document.createElement('a');
        link.download = `the-glases-tryon-${selectedGlasses.id}.png`;
        link.href = dataUrl;
        link.click();
        setDownloadDone(true);
        setTimeout(() => setDownloadDone(false), 3000);
    };

    // Save: create a fake canvas ref that returns Fabric's data
    const handleSave = async () => {
        const dataUrl = fabricEditorRef.current?.toDataURL({ format: 'png', multiplier: 1 });
        const fakeCanvasRef = {
            current: {
                toBlob: (cb) => {
                    if (!dataUrl) return cb(null);
                    fetch(dataUrl).then(r => r.blob()).then(cb);
                }
            }
        };
        try {
            await saveSession({ glasses: selectedGlasses, size: 180, rotation: 0, opacity });
        } catch (_) {}
    };

    const handleAddToCart = () => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push({ id: selectedGlasses.id, name: selectedGlasses.label, price: 3000, qty: 1, image: selectedGlasses.src });
        localStorage.setItem('cart', JSON.stringify(cart));
        setCartMsg(`${selectedGlasses.label} added to cart!`);
        setTimeout(() => setCartMsg(null), 3000);
    };

    const toastMsg = successMsg || error || cartMsg;
    const toastType = (successMsg || cartMsg) ? 'success' : 'error';

    return (
        <main className={`min-h-[100vh] bg-gray-50 ${isMobile ? 'pt-6 pb-[240px]' : 'pt-12 pb-20'}`}>
            <Toast message={toastMsg} type={toastType} />

            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <span className="inline-block bg-blue-100 text-primary px-4 py-1.5 rounded-full text-sm font-bold mb-4">
                        🕶️ Virtual Try-On
                    </span>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3">Try Before You Buy</h1>
                    <p className="text-gray-600 text-[17px] max-w-xl mx-auto leading-relaxed">
                        Upload your photo or use live webcam · Pick a frame · Drag &amp; resize it to perfection
                    </p>
                </motion.div>

                {/* Tips banner */}
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                    className="flex items-center gap-3 bg-blue-50 rounded-xl p-3 md:p-4 mb-9 max-w-3xl mx-auto"
                >
                    <Info size={18} className="text-primary shrink-0" />
                    <p className="text-sm text-primary font-medium">
                        <strong>Manual mode:</strong> drag &amp; resize glasses freely with Fabric.js · <strong>AI mode:</strong> AI auto-fits glasses to your face in real-time
                    </p>
                </motion.div>

                {/* Mode Selector */}
                <div className="flex justify-center mb-8">
                    <div className="inline-flex bg-white rounded-full p-1 border border-gray-200 shadow-sm overflow-hidden">
                        <button
                            onClick={() => setMode('manual')}
                            className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all rounded-full ${mode === 'manual' ? 'bg-primary text-white' : 'bg-transparent text-gray-500 hover:text-gray-800'}`}
                        >
                            <ImageIcon size={18} /> Upload Photo
                        </button>
                        <button
                            onClick={() => setMode('ai')}
                            className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all rounded-full ${mode === 'ai' ? 'bg-primary text-white' : 'bg-transparent text-gray-500 hover:text-gray-800'}`}
                        >
                            <CameraIcon size={18} /> Live AI Mirror
                        </button>
                    </div>
                </div>

                {/* Main layout */}
                <div style={{ display: 'flex', flexDirection: isMobile ? 'column-reverse' : 'row', gap: '32px', alignItems: 'start', maxWidth: '1100px', margin: '0 auto' }}>

                    {/* ── Left Panel ── */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                        className="flex flex-col gap-7 flex-1 w-full"
                    >
                        {/* Upload (manual only) */}
                        {mode === 'manual' && (
                            <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-200">
                                <h3 className="text-[17px] font-bold mb-4">1. Upload Your Photo</h3>
                                <ImageUpload onImageSelect={setUserImage} image={userImage} />
                            </div>
                        )}

                        {/* Glasses Selector */}
                        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-200">
                            <h3 className="text-[17px] font-bold mb-4">
                                {mode === 'manual' ? '2. Select Frame Style' : '1. Select Frame Style'}
                            </h3>
                            <GlassesSelector selected={selectedGlasses.id} onSelect={setSelectedGlasses} />
                        </div>

                        {/* Opacity slider (manual only) */}
                        {mode === 'manual' && (
                            <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-200">
                                <h3 className="text-[17px] font-bold mb-5">3. Adjust Opacity</h3>
                                <Controls
                                    size={180}
                                    setSize={() => {}}
                                    rotation={0}
                                    setRotation={() => {}}
                                    opacity={opacity}
                                    setOpacity={setOpacity}
                                    onReset={handleReset}
                                />
                                <p className="text-[12px] text-gray-400 mt-3">
                                    💡 Drag &amp; resize the glasses directly on the canvas. Use handles to rotate.
                                </p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className={`bg-white p-6 border border-gray-200 flex flex-col gap-3 ${
                            isMobile ? 'fixed bottom-0 left-0 right-0 z-[100] rounded-t-[24px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]' : 'rounded-[20px] shadow-sm'
                        }`}>
                            <h3 className={`text-[17px] font-bold mb-1 ${isMobile ? 'hidden' : 'block'}`}>
                                {mode === 'manual' ? '4. Save & Shop' : '2. Action & Shop'}
                            </h3>

                            {mode === 'manual' && (
                                <Button variant="primary" fullWidth onClick={handleDownload} disabled={!userImage}>
                                    <Download size={16} />
                                    {downloadDone ? '✓ Downloaded!' : 'Download Preview'}
                                </Button>
                            )}

                            {userId ? (
                                <Button variant="outline" fullWidth onClick={handleSave} disabled={!userImage || saving}>
                                    <Save size={16} />
                                    {saving ? 'Saving…' : 'Save to My Sessions'}
                                </Button>
                            ) : (
                                <Link to="/login" style={{ display: 'block' }}>
                                    <Button variant="outline" fullWidth>
                                        <LogIn size={16} /> Log in to Save Sessions
                                    </Button>
                                </Link>
                            )}

                            <Link to="/shop" style={{ display: 'block' }}>
                                <Button variant="outline" fullWidth>
                                    <ShoppingBag size={16} /> Buy {selectedGlasses?.label} Glasses
                                </Button>
                            </Link>

                            {mode === 'manual' && !userImage && (
                                <p className="text-center text-[12px] text-gray-400">Upload a photo to enable download &amp; save</p>
                            )}
                        </div>
                    </motion.div>

                    {/* ── Right Panel ── */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                        className={`flex flex-col gap-7 w-full ${isDesktop ? 'flex-[1.2]' : 'flex-1'}`}
                    >
                        {/* Canvas area */}
                        {mode === 'manual' ? (
                            <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-200 sticky top-24">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-[17px] font-bold">Live Preview</h3>
                                    <span className="bg-blue-50 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                                        Fabric.js · Drag &amp; Resize
                                    </span>
                                </div>
                                <FabricEditor
                                    ref={fabricEditorRef}
                                    userImage={userImage}
                                    glassesImage={selectedGlasses?.src}
                                    opacity={opacity}
                                />
                            </div>
                        ) : (
                            <TryOnAI
                                selectedGlassesImage={selectedGlasses?.src}
                                onCartAdd={handleAddToCart}
                            />
                        )}

                        {/* Session History */}
                        {userId && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                                className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-200"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <Clock size={16} className="text-primary" />
                                    <h3 className="text-[17px] font-bold">Saved Sessions</h3>
                                    <span className="ml-auto bg-blue-50 text-primary px-2.5 py-0.5 rounded-full text-xs font-bold">
                                        {sessions.length}
                                    </span>
                                </div>

                                {sessionsLoading ? (
                                    <p className="text-center text-gray-500 text-sm py-5">Loading…</p>
                                ) : sessions.length === 0 ? (
                                    <p className="text-center text-gray-400 text-[13px] py-5">
                                        No saved sessions yet. Click "Save to My Sessions" after trying on glasses!
                                    </p>
                                ) : (
                                    <div className="flex flex-col gap-2.5 max-h-[340px] overflow-y-auto pr-2">
                                        <AnimatePresence>
                                            {sessions.map((s) => <SessionCard key={s.id} session={s} onDelete={deleteSession} />)}
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
