import React, { useRef, useEffect, useState } from 'react';
const Camera = window.Camera;
import { initFaceMesh, getFaceMetrics } from '../../ai/faceDetection';
import { Camera as CameraIcon, Info } from 'lucide-react';
import Button from '../ui/Button';

const TryOnAI = ({ selectedGlassesImage, onCartAdd, onSavePreview }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [faceMetrics, setFaceMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cameraOn, setCameraOn] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);

    // To store native video resolution for calculating aspect ratios
    const [videoSize, setVideoSize] = useState({ width: 640, height: 480 });

    useEffect(() => {
        if (!cameraOn) return;

        let activeCamera = null;

        const startAI = async () => {
            setLoading(true);
            try {
                // 1. Init FaceMesh
                const faceMesh = initFaceMesh((results) => {
                    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
                        const m = getFaceMetrics(results.multiFaceLandmarks[0]);
                        setFaceMetrics(m);
                    } else {
                        setFaceMetrics(null);
                    }
                });

                // 2. Start Camera Feed via MediaPipe
                activeCamera = new Camera(videoRef.current, {
                    onFrame: async () => {
                        if (videoRef.current) {
                            await faceMesh.send({ image: videoRef.current });
                        }
                    },
                    width: 640,
                    height: 480,
                });

                await activeCamera.start();

                // Update natural dimensions
                if (videoRef.current) {
                    setVideoSize({
                        width: videoRef.current.videoWidth,
                        height: videoRef.current.videoHeight,
                    });
                }
                setLoading(false);

            } catch (err) {
                console.error("Camera access failed", err);
                setErrorMsg("Camera access denied or device not found.");
                setLoading(false);
            }
        };

        startAI();

        return () => {
            if (activeCamera) activeCamera.stop();
        };
    }, [cameraOn]);

    return (
        <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CameraIcon size={20} color="var(--accent-blue)" />
                    Live AI Mirror
                </h3>
            </div>

            {errorMsg ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-light)' }}>
                    <p>{errorMsg}</p>
                </div>
            ) : (
                <div 
                    ref={canvasRef}
                    style={{ position: 'relative', width: '100%', aspectRatio: `${videoSize.width}/${videoSize.height}`, backgroundColor: '#000', borderRadius: '16px', overflow: 'hidden' }}
                >
                    {loading && (
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', zIndex: 10 }}>
                            Loading AI Models & Camera...
                        </div>
                    )}

                    {/* Flipped video feed so acts like a mirror */}
                    <video
                        ref={videoRef}
                        playsInline
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transform: 'scaleX(-1)', // Mirror effect
                        }}
                    />

                    {/* Auto-Fitted Glasses Overlay */}
                    {faceMetrics && selectedGlassesImage && (
                        <img
                            src={selectedGlassesImage}
                            alt="Glasses AI Overlay"
                            style={{
                                position: 'absolute',
                                // Mirror the X coordinate: 1 - faceMetrics.x
                                left: `${(1 - faceMetrics.x) * 100}%`,
                                top: `${faceMetrics.y * 100}%`,
                                width: `${faceMetrics.width * 100}%`,
                                // Because we scale horizontally, we also must reverse the rotation logic
                                transform: `translate(-50%, -50%) rotate(${faceMetrics.rotation * -1}rad)`,
                                transformOrigin: 'center center',
                                pointerEvents: 'none',
                                filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.4))'
                            }}
                        />
                    )}
                </div>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <Button variant="primary" fullWidth onClick={onCartAdd}>
                    Add to Cart
                </Button>
                {/* Save preview isn't natively supported on absolute overlays easily without html2canvas,
                    but we pass the hook here if user implements html2canvas snapshot */}
                <Button variant="outline" fullWidth onClick={() => {
                        alert("For AI Live Save, take a screenshot of your screen!");
                    }}>
                    Take Snapshot
                </Button>
            </div>
            <p style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-light)', marginTop: '16px' }}>
                <Info size={14} /> Center your face. The AI auto-detects and fits the glasses.
            </p>
        </div>
    );
};

export default TryOnAI;
