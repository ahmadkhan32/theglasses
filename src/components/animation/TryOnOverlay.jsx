import React, { useState, useRef } from 'react';

const TryOnOverlay = () => {
    const [faceImage, setFaceImage] = useState(null);
    const [selectedGlasses, setSelectedGlasses] = useState(0);
    const fileRef = useRef(null);

    const glassesOptions = [
        { label: 'Blue Light', url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=400' },
        { label: 'Aviator', url: 'https://images.unsplash.com/photo-1473496169904-658ba7574b0d?auto=format&fit=crop&q=80&w=400' },
        { label: 'Round', url: 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&q=80&w=400' },
    ];

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setFaceImage(URL.createObjectURL(file));
    };

    return (
        <div style={{ padding: '40px', backgroundColor: 'var(--bg-secondary)', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>🕶️ Virtual Try-On</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Upload your photo and preview any frame.</p>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', flexWrap: 'wrap' }}>
                {glassesOptions.map((g, i) => (
                    <button
                        key={i}
                        onClick={() => setSelectedGlasses(i)}
                        style={{
                            padding: '8px 16px', borderRadius: '8px', border: '2px solid',
                            borderColor: selectedGlasses === i ? 'var(--accent-blue)' : 'var(--border-color)',
                            backgroundColor: selectedGlasses === i ? 'var(--accent-blue-light)' : '#fff',
                            color: selectedGlasses === i ? 'var(--accent-blue)' : 'var(--text-secondary)',
                            cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit'
                        }}
                    >{g.label}</button>
                ))}
            </div>

            <div style={{ position: 'relative', display: 'inline-block', width: '100%', maxWidth: '400px' }}>
                {faceImage ? (
                    <>
                        <img src={faceImage} alt="Your face" style={{ width: '100%', borderRadius: '16px' }} />
                        <img
                            src={glassesOptions[selectedGlasses].url}
                            alt="Glasses overlay"
                            style={{
                                position: 'absolute',
                                top: '28%', left: '10%',
                                width: '80%', opacity: 0.85,
                                mixBlendMode: 'multiply',
                                pointerEvents: 'none'
                            }}
                        />
                    </>
                ) : (
                    <div
                        onClick={() => fileRef.current?.click()}
                        style={{
                            width: '100%', height: '250px',
                            border: '2px dashed var(--border-color)',
                            borderRadius: '16px', display: 'flex',
                            flexDirection: 'column', alignItems: 'center',
                            justifyContent: 'center', cursor: 'pointer',
                            color: 'var(--text-secondary)'
                        }}
                    >
                        <span style={{ fontSize: '40px', marginBottom: '12px' }}>📷</span>
                        <p>Click to upload your face photo</p>
                    </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
            </div>

            {faceImage && (
                <button
                    onClick={() => setFaceImage(null)}
                    style={{ marginTop: '16px', padding: '8px 16px', borderRadius: '8px', border: '1.5px solid var(--border-color)', cursor: 'pointer', color: 'var(--text-secondary)', fontFamily: 'inherit' }}
                >
                    Remove Photo
                </button>
            )}
        </div>
    );
};

export default TryOnOverlay;
