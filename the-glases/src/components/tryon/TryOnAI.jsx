import React, { useRef, useEffect, useState, useCallback } from 'react';
import { initFaceMesh, getFaceMetrics } from '../../ai/faceDetection';
import { Camera as CameraIcon, Info, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import Button from '../ui/Button';

// ─── Perfect Alignment Webcam Try-On ─────────────────────────────────────────
// Uses MediaPipe FaceMesh landmarks:
//   Left Eye  → 33
//   Right Eye → 263
//   Nose      → 1
// Applies: ctx.save() / translate / rotate(angle) / drawImage / restore
// Runs in a requestAnimationFrame loop for buttery-smooth overlay

const TryOnAI = ({ selectedGlassesImage, onCartAdd }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const imgRef = useRef(null);
    const glassesImgRef = useRef(null);          // preloaded glasses HTMLImageElement
    const faceMetricsRef = useRef(null);         // latest face metrics (for rAF)
    const rafRef = useRef(null);                 // requestAnimationFrame id
    const faceMeshRef = useRef(null);
    const cameraObjRef = useRef(null);

    const [uploadedImage, setUploadedImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cameraOn, setCameraOn] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);
    const [faceDetected, setFaceDetected] = useState(false);
    const [scaleMultiplier, setScaleMultiplier] = useState(2.2);
    const [snapshotting, setSnapshotting] = useState(false);

    const [mediaSize, setMediaSize] = useState({ width: 640, height: 480 });

    // ─── Preload glasses image whenever it changes ───────────────────────────
    useEffect(() => {
        if (!selectedGlassesImage) { glassesImgRef.current = null; return; }

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = selectedGlassesImage;
        img.onload = () => {
            // Remove white/near-white background via off-screen canvas
            const oc = document.createElement('canvas');
            oc.width = img.width; oc.height = img.height;
            const octx = oc.getContext('2d');
            octx.drawImage(img, 0, 0);
            try {
                const imageData = octx.getImageData(0, 0, oc.width, oc.height);
                const d = imageData.data;
                for (let i = 0; i < d.length; i += 4) {
                    if (d[i] > 230 && d[i+1] > 230 && d[i+2] > 230) d[i+3] = 0;
                }
                octx.putImageData(imageData, 0, 0);
            } catch (_) { /* CORS blocked — use original */ }

            // Create a new image from processed canvas
            const clean = new Image();
            clean.src = oc.toDataURL('image/png');
            clean.onload = () => { glassesImgRef.current = clean; };
        };
        img.onerror = () => { glassesImgRef.current = img; };
    }, [selectedGlassesImage]);

    // ─── Draw loop (rAF) ─────────────────────────────────────────────────────
    const drawLoop = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const { width: cw, height: ch } = canvas;

        ctx.clearRect(0, 0, cw, ch);

        // 1. Draw source (video or static image)
        const source = cameraOn ? videoRef.current : imgRef.current;
        if (source && (source.readyState >= 2 || source.complete)) {
            if (cameraOn) {
                // Mirror webcam horizontally
                ctx.save();
                ctx.translate(cw, 0);
                ctx.scale(-1, 1);
                ctx.drawImage(source, 0, 0, cw, ch);
                ctx.restore();
            } else {
                ctx.drawImage(source, 0, 0, cw, ch);
            }
        }

        // 2. Draw glasses with PERFECT ALIGNMENT (rotation fix)
        const metrics = faceMetricsRef.current;
        const glassesImg = glassesImgRef.current;
        if (metrics && glassesImg) {
            const widthFrac = (metrics.width / 2.2) * scaleMultiplier;
            const w = widthFrac * cw;
            const h = w * (glassesImg.height / glassesImg.width);

            // For webcam: mirror x coordinate
            const rawX = cameraOn ? (1 - metrics.x) : metrics.x;
            const x = rawX * cw;
            const y = metrics.y * ch;

            // Rotation: negate for webcam mirror
            const angle = metrics.rotation * (cameraOn ? -1 : 1);

            // ── THE KEY ROTATION FIX ──────────────────────────────────────
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.globalAlpha = 0.95;
            ctx.drawImage(glassesImg, -w / 2, -h / 2 - h * 0.05, w, h);
            ctx.globalAlpha = 1;
            ctx.restore();
        }

        rafRef.current = requestAnimationFrame(drawLoop);
    }, [cameraOn, scaleMultiplier]);

    // Start / stop the rAF loop
    useEffect(() => {
        rafRef.current = requestAnimationFrame(drawLoop);
        return () => cancelAnimationFrame(rafRef.current);
    }, [drawLoop]);

    // ─── Start webcam + FaceMesh ─────────────────────────────────────────────
    useEffect(() => {
        if (!cameraOn) return;
        let stopped = false;

        const start = async () => {
            setLoading(true);
            setErrorMsg(null);
            faceMetricsRef.current = null;
            setFaceDetected(false);

            try {
                const faceMesh = initFaceMesh((results) => {
                    if (stopped) return;
                    if (results.multiFaceLandmarks?.length > 0) {
                        const m = getFaceMetrics(results.multiFaceLandmarks[0]);
                        faceMetricsRef.current = m;
                        setFaceDetected(true);
                    } else {
                        faceMetricsRef.current = null;
                        setFaceDetected(false);
                    }
                });
                faceMeshRef.current = faceMesh;

                const cam = new window.Camera(videoRef.current, {
                    onFrame: async () => {
                        if (videoRef.current && faceMeshRef.current) {
                            await faceMeshRef.current.send({ image: videoRef.current });
                        }
                    },
                    width: 640,
                    height: 480,
                    facingMode: 'user',
                });
                cameraObjRef.current = cam;
                await cam.start();

                if (videoRef.current) {
                    setMediaSize({
                        width: videoRef.current.videoWidth || 640,
                        height: videoRef.current.videoHeight || 480,
                    });
                }
                setLoading(false);
            } catch (err) {
                console.error('Camera error:', err);
                setErrorMsg('Camera access denied or unavailable.');
                setLoading(false);
            }
        };

        start();

        return () => {
            stopped = true;
            cameraObjRef.current?.stop();
        };
    }, [cameraOn]);

    // ─── Static image FaceMesh ───────────────────────────────────────────────
    const runStaticFaceMesh = async () => {
        if (!imgRef.current) return;
        setLoading(true);
        faceMetricsRef.current = null;
        setFaceDetected(false);
        try {
            const faceMesh = initFaceMesh((results) => {
                if (results.multiFaceLandmarks?.length > 0) {
                    faceMetricsRef.current = getFaceMetrics(results.multiFaceLandmarks[0]);
                    setFaceDetected(true);
                } else {
                    setErrorMsg('No face detected. Use a clear front-facing photo.');
                }
                setLoading(false);
            });
            setMediaSize({ width: imgRef.current.naturalWidth, height: imgRef.current.naturalHeight });
            await faceMesh.send({ image: imgRef.current });
        } catch (err) {
            setErrorMsg('Face analysis failed.');
            setLoading(false);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setCameraOn(false);
        setFaceDetected(false);
        faceMetricsRef.current = null;
        setErrorMsg(null);
        setUploadedImage(URL.createObjectURL(file));
    };

    const handleSnapshot = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        setSnapshotting(true);
        const link = document.createElement('a');
        link.download = `the-glases-tryon-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        setTimeout(() => setSnapshotting(false), 1500);
    };

    const canvasW = mediaSize.width;
    const canvasH = mediaSize.height;

    return (
        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-200">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-[17px] font-bold flex items-center gap-2">
                    <CameraIcon size={20} className="text-primary" />
                    {cameraOn ? 'Live AI Mirror 🎥' : 'Static Photo Try-On 📷'}
                </h3>
                <div className="flex items-center gap-2">
                    <label className="text-[13px] text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-blue-100 font-semibold transition-colors">
                        Upload Photo
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                    {!cameraOn && (
                        <button
                            onClick={() => { setUploadedImage(null); faceMetricsRef.current = null; setErrorMsg(null); setFaceDetected(false); setCameraOn(true); }}
                            className="text-[13px] text-gray-500 hover:text-gray-900 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors"
                        >
                            Use Camera
                        </button>
                    )}
                </div>
            </div>

            {/* Mirror container */}
            <div className="relative w-full bg-black rounded-2xl overflow-hidden max-w-[640px] mx-auto"
                 style={{ aspectRatio: `${canvasW}/${canvasH}` }}>

                {/* Loading overlay */}
                {loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 bg-black/60 gap-3">
                        <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
                        <p className="font-semibold text-sm">Loading AI Model…</p>
                    </div>
                )}

                {/* Hidden video for webcam feed */}
                <video ref={videoRef} playsInline className="hidden" />

                {/* Hidden static image for FaceMesh analysis */}
                {!cameraOn && uploadedImage && (
                    <img ref={imgRef} src={uploadedImage} alt="upload" onLoad={runStaticFaceMesh}
                        className="hidden" crossOrigin="anonymous" />
                )}

                {/* Drawing canvas (rAF loop draws here) */}
                <canvas
                    ref={canvasRef}
                    width={canvasW}
                    height={canvasH}
                    className="w-full h-full"
                    style={{ display: 'block' }}
                />

                {/* Face detection status */}
                <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        faceDetected ? 'bg-green-500 text-white' : 'bg-black/50 text-white'
                    }`}>
                        {faceDetected ? '✅ Face Detected' : '👁 Scanning…'}
                    </span>
                </div>
            </div>

            {/* Error */}
            {errorMsg && (
                <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                    {errorMsg}
                </div>
            )}

            {/* Scale multiplier slider */}
            {!errorMsg && faceDetected && (
                <div className="mt-4 bg-gray-50 border border-gray-100 rounded-xl p-4">
                    <label className="text-[13px] font-semibold text-gray-700 flex justify-between mb-2">
                        <span className="flex items-center gap-1"><ZoomIn size={14} /> Glasses Size Multiplier</span>
                        <span className="text-primary font-bold">{scaleMultiplier}×</span>
                    </label>
                    <input
                        type="range" min="1" max="5" step="0.1"
                        value={scaleMultiplier}
                        onChange={(e) => setScaleMultiplier(parseFloat(e.target.value))}
                        className="w-full"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">
                        Adjust if glasses appear too small or too large
                    </p>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-5">
                <Button variant="primary" fullWidth onClick={onCartAdd}>
                    🛍️ Add to Cart
                </Button>
                <Button variant="outline" fullWidth onClick={handleSnapshot} disabled={snapshotting}>
                    <CameraIcon size={16} />
                    {snapshotting ? 'Saved! ✓' : 'Download'}
                </Button>
            </div>

            <p className="flex items-center gap-2 text-[13px] text-gray-500 mt-4">
                <Info size={14} />
                Center your face · AI auto-fits glasses · Tilt your head to test rotation
            </p>
        </div>
    );
};

export default TryOnAI;
