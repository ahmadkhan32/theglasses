import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Download, ShoppingBag, Info } from 'lucide-react';
import TryOnCanvas from '../components/tryon/TryOnCanvas';
import ImageUpload from '../components/tryon/ImageUpload';
import Controls from '../components/tryon/Controls';
import GlassesSelector, { GLASSES } from '../components/tryon/GlassesSelector';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';

const DEFAULT_SIZE = 180;
const DEFAULT_ROTATION = 0;

const TryOn = () => {
    const [userImage, setUserImage] = useState(null);
    const [selectedGlasses, setSelectedGlasses] = useState(GLASSES[0]);
    const [size, setSize] = useState(DEFAULT_SIZE);
    const [rotation, setRotation] = useState(DEFAULT_ROTATION);
    const [downloadDone, setDownloadDone] = useState(false);
    const canvasRef = useRef(null);

    const handleReset = useCallback(() => {
        setSize(DEFAULT_SIZE);
        setRotation(DEFAULT_ROTATION);
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

    return (
        <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)', padding: '48px 0 80px' }}>
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
                                🖱️ <strong>Drag glasses</strong> on the preview to position them. Use sliders below to resize and tilt.
                            </p>
                            <Controls
                                size={size}
                                setSize={setSize}
                                rotation={rotation}
                                setRotation={setRotation}
                                onReset={handleReset}
                            />
                        </div>

                        {/* Actions */}
                        <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '4px' }}>4. Save & Shop</h3>

                            <Button
                                variant="primary"
                                fullWidth
                                onClick={handleDownload}
                                disabled={!userImage}
                            >
                                <Download size={16} />
                                {downloadDone ? '✓ Downloaded!' : 'Download Preview'}
                            </Button>

                            <Link to="/shop" style={{ display: 'block' }}>
                                <Button variant="outline" fullWidth>
                                    <ShoppingBag size={16} />
                                    Buy {selectedGlasses?.label} Glasses
                                </Button>
                            </Link>

                            {!userImage && (
                                <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-light)' }}>
                                    Upload a photo to enable download
                                </p>
                            )}
                        </div>
                    </motion.div>

                    {/* Right Panel — Canvas Preview */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
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
                                canvasRef={canvasRef}
                            />
                            <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-light)', marginTop: '12px' }}>
                                Drag the glasses to reposition • Use sliders to adjust fit
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    );
};

export default TryOn;
