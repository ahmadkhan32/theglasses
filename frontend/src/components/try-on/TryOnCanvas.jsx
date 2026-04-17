/**
 * TryOnCanvas â€“ Virtual glasses try-on canvas
 *
 * Modes:
 *   webcamMode=false  â€“ static uploaded photo with face detection
 *   webcamMode=true   â€“ live webcam video with real-time detection
 *
 * Face detection auto-places glasses at eye level with correct tilt.
 * User can fine-tune with drag (offsetX/Y) and the Controls sliders.
 */
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { loadModels, detectFace, getGlassesTransform } from '../../utils/faceDetection';

const CANVAS_W = 520;
const CANVAS_H = 560;

// â”€â”€ helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/** Draw a single image scaled-to-cover the full canvas */
const fillCanvas = (ctx, img, w, h) => {
  const ir = img.naturalWidth / img.naturalHeight;
  const cr = w / h;
  let sw, sh, sx, sy;
  if (ir > cr) { sh = h; sw = sh * ir; sx = (w - sw) / 2; sy = 0; }
  else          { sw = w; sh = sw / ir; sy = (h - sh) / 2; sx = 0; }
  ctx.drawImage(img, sx, sy, sw, sh);
};

/** Draw glasses centred at (cx, cy) with rotation and opacity */
const drawGlasses = (ctx, gImg, cx, cy, width, angle, opacity) => {
  const h = width * (gImg.naturalHeight / gImg.naturalWidth);
  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, opacity));
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.drawImage(gImg, -width / 2, -h / 2, width, h);
  ctx.restore();
};

// â”€â”€ component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const TryOnCanvas = ({
  userImage,          // data-URL or object-URL of uploaded photo
  webcamMode = false, // true â†’ live webcam overlay
  glassesImage,       // path to glasses SVG/PNG
  sizeScale,          // 0.5-2.0 multiplier on auto-detected width
  extraRotation,      // degrees â€“ added on top of auto angle
  opacity,            // 0-1 glasses opacity
  onDetectStatus,     // cb(status: 'detecting'|'found'|'not_found'|'error')
  canvasRef,          // forwarded ref so parent can call toDataURL()
}) => {
  // Internal refs
  const localCanvasRef  = useRef(null);
  const effectiveCanvas = canvasRef || localCanvasRef;
  const userImgRef      = useRef(null);
  const glassesImgRef   = useRef(null);
  const videoRef        = useRef(null);
  const streamRef       = useRef(null);
  const animFrameRef    = useRef(null);
  const detectTimerRef  = useRef(null);
  const lastTransformRef = useRef(null); // cached face transform for webcam

  // State
  const [glassesReady,  setGlassesReady]  = useState(false);
  const [imageReady,    setImageReady]    = useState(false);
  const [autoTransform, setAutoTransform] = useState(null); // {cx,cy,glassesWidth,angle}
  const [detecting,     setDetecting]     = useState(false);
  const [webcamReady,   setWebcamReady]   = useState(false);

  // Drag fine-tune
  const [dragOffset, setDragOffset]  = useState({ x: 0, y: 0 });
  const draggingRef    = useRef(false);
  const dragStartRef   = useRef({ x: 0, y: 0 });
  const dragOffsetRef  = useRef({ x: 0, y: 0 });

  // â”€â”€ Load glasses image â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    setGlassesReady(false);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = glassesImage;
    img.onload  = () => { glassesImgRef.current = img; setGlassesReady(true); };
    img.onerror = () => { glassesImgRef.current = null; };
    return () => { img.onload = null; img.onerror = null; };
  }, [glassesImage]);

  // â”€â”€ Load user image + auto-detect â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    if (webcamMode || !userImage) {
      userImgRef.current = null;
      setImageReady(false);
      setAutoTransform(null);
      setDragOffset({ x: 0, y: 0 });
      return;
    }

    setImageReady(false);
    setAutoTransform(null);
    setDragOffset({ x: 0, y: 0 });

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = userImage;
    img.onload = async () => {
      userImgRef.current = img;
      setImageReady(true);

      // Attempt face detection
      onDetectStatus?.('detecting');
      setDetecting(true);
      try {
        await loadModels();
        const detection = await detectFace(img);
        if (detection) {
          const t = getGlassesTransform(
            detection.landmarks, CANVAS_W, CANVAS_H,
            img.naturalWidth, img.naturalHeight,
          );
          setAutoTransform(t);
          onDetectStatus?.('found');
        } else {
          setAutoTransform(null);
          onDetectStatus?.('not_found');
        }
      } catch {
        setAutoTransform(null);
        onDetectStatus?.('error');
      } finally {
        setDetecting(false);
      }
    };
    img.onerror = () => { userImgRef.current = null; setImageReady(false); };
    return () => { img.onload = null; img.onerror = null; };
  }, [userImage, webcamMode]); // eslint-disable-line

  // â”€â”€ Webcam lifecycle â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    if (!webcamMode) {
      // Stop any active webcam stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      setWebcamReady(false);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (detectTimerRef.current) clearInterval(detectTimerRef.current);
      return;
    }

    let cancelled = false;
    setWebcamReady(false);

    navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480, facingMode: 'user' } })
      .then((stream) => {
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        const vid = videoRef.current;
        if (!vid) return;
        vid.srcObject = stream;
        vid.play().then(() => {
          if (!cancelled) setWebcamReady(true);
        });
      })
      .catch(() => { if (!cancelled) onDetectStatus?.('error'); });

    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      setWebcamReady(false);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (detectTimerRef.current) clearInterval(detectTimerRef.current);
    };
  }, [webcamMode]); // eslint-disable-line

  // â”€â”€ Periodic face detection for webcam â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    if (!webcamMode || !webcamReady) return;

    const runDetect = async () => {
      const vid = videoRef.current;
      if (!vid || vid.paused || vid.ended || vid.readyState < 2) return;
      try {
        await loadModels();
        const detection = await detectFace(vid);
        if (detection) {
          const t = getGlassesTransform(
            detection.landmarks, CANVAS_W, CANVAS_H,
            vid.videoWidth, vid.videoHeight,
          );
          lastTransformRef.current = t;
          setAutoTransform(t);
          onDetectStatus?.('found');
        } else {
          onDetectStatus?.('not_found');
        }
      } catch { /* keep going */ }
    };

    // Run face detection every 600ms (not every frame â€“ too heavy)
    detectTimerRef.current = setInterval(runDetect, 600);
    runDetect(); // immediate first run

    return () => { if (detectTimerRef.current) clearInterval(detectTimerRef.current); };
  }, [webcamMode, webcamReady]); // eslint-disable-line

  // â”€â”€ Canvas render loop â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const render = useCallback(() => {
    const canvas = effectiveCanvas.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // â”€â”€ Background / face layer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    if (webcamMode) {
      const vid = videoRef.current;
      if (vid && webcamReady && vid.readyState >= 2) {
        // Mirror webcam horizontally for selfie feel
        ctx.save();
        ctx.translate(CANVAS_W, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(vid, 0, 0, CANVAS_W, CANVAS_H);
        ctx.restore();
      } else {
        drawPlaceholder(ctx, 'ðŸŽ¥  Allow camera access to begin');
      }
    } else if (userImgRef.current && imageReady) {
      fillCanvas(ctx, userImgRef.current, CANVAS_W, CANVAS_H);
    } else {
      drawPlaceholder(ctx, 'ðŸ“·  Upload your photo to begin');
    }

    // â”€â”€ Detecting spinner text â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    if (detecting) {
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.fillRect(0, CANVAS_H - 44, CANVAS_W, 44);
      ctx.fillStyle = '#fff';
      ctx.font = '600 14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Detecting face...', CANVAS_W / 2, CANVAS_H - 22);
      ctx.restore();
    }

    // â”€â”€ Glasses layer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    if (glassesImgRef.current && glassesReady) {
      let cx, cy, gWidth, angle;

      if (autoTransform) {
        cx = autoTransform.cx + dragOffsetRef.current.x;
        cy = autoTransform.cy + dragOffsetRef.current.y;
        // webcam: mirror X offset because canvas is flipped
        if (webcamMode) cx = CANVAS_W - cx;
        gWidth = autoTransform.glassesWidth * (sizeScale ?? 1.0);
        angle  = (webcamMode ? -autoTransform.angle : autoTransform.angle)
               + ((extraRotation ?? 0) * Math.PI / 180);
      } else if (!webcamMode && imageReady) {
        // Fallback â€“ center of the image, neutral
        cx = CANVAS_W / 2 + dragOffsetRef.current.x;
        cy = CANVAS_H * 0.38 + dragOffsetRef.current.y;
        gWidth = CANVAS_W * 0.52 * (sizeScale ?? 1.0);
        angle  = (extraRotation ?? 0) * Math.PI / 180;
      } else {
        angle = gWidth = 0; cx = cy = 0; // no face yet
      }

      if (gWidth > 0) {
        drawGlasses(ctx, glassesImgRef.current, cx, cy, gWidth, angle, opacity ?? 1);
      }
    }
  }, [autoTransform, detecting, glassesReady, imageReady, webcamMode, webcamReady, sizeScale, extraRotation, opacity, dragOffset]); // dragOffset in dep to re-render on drag

  // rAF draw loop
  useEffect(() => {
    let rafId;
    const loop = () => { render(); rafId = requestAnimationFrame(loop); };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [render]);

  // â”€â”€ Drag handlers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const getPos = (e) => {
    const rect = effectiveCanvas.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (CANVAS_W / rect.width),
      y: (clientY - rect.top)  * (CANVAS_H / rect.height),
    };
  };

  const onPointerDown = (e) => {
    draggingRef.current = true;
    const pos = getPos(e);
    dragStartRef.current = {
      x: pos.x - dragOffsetRef.current.x,
      y: pos.y - dragOffsetRef.current.y,
    };
  };

  const onPointerMove = (e) => {
    if (!draggingRef.current) return;
    const pos = getPos(e);
    const newOffset = {
      x: pos.x - dragStartRef.current.x,
      y: pos.y - dragStartRef.current.y,
    };
    dragOffsetRef.current = newOffset;
    setDragOffset({ ...newOffset }); // trigger re-render via dep
  };

  const onPointerUp = () => { draggingRef.current = false; };

  // â”€â”€ Reset exposed API â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    dragOffsetRef.current = { x: 0, y: 0 };
    setDragOffset({ x: 0, y: 0 });
  }, [autoTransform]); // each new detection resets drag

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: `${CANVAS_W}px`, margin: '0 auto' }}>
      {/* Hidden video element for webcam */}
      <video
        ref={videoRef}
        style={{ display: 'none' }}
        playsInline
        muted
        autoPlay
      />

      <canvas
        ref={effectiveCanvas}
        width={CANVAS_W}
        height={CANVAS_H}
        onMouseDown={onPointerDown}
        onMouseMove={onPointerMove}
        onMouseUp={onPointerUp}
        onMouseLeave={onPointerUp}
        onTouchStart={onPointerDown}
        onTouchMove={onPointerMove}
        onTouchEnd={onPointerUp}
        style={{
          width: '100%',
          borderRadius: '20px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
          cursor: autoTransform || imageReady ? 'move' : 'default',
          touchAction: 'none',
          userSelect: 'none',
          backgroundColor: '#f1f5f9',
          display: 'block',
        }}
      />

      {/* Drag hint badge */}
      {(imageReady || webcamReady) && autoTransform && (
        <div style={{
          position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0,0,0,0.55)', color: '#fff',
          padding: '5px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: '600',
          backdropFilter: 'blur(6px)', pointerEvents: 'none', whiteSpace: 'nowrap',
        }}>
          Drag to fine-tune position
        </div>
      )}
    </div>
  );
};

// â”€â”€ Placeholder helper (outside component to avoid recreation) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function drawPlaceholder(ctx, msg) {
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  // Face silhouette
  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = '#94a3b8';
  ctx.beginPath();
  ctx.ellipse(CANVAS_W / 2, CANVAS_H / 2 - 30, 130, 160, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  // Eyes
  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = '#94a3b8';
  ctx.beginPath(); ctx.ellipse(CANVAS_W / 2 - 45, CANVAS_H / 2 - 50, 22, 12, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(CANVAS_W / 2 + 45, CANVAS_H / 2 - 50, 22, 12, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  // Message
  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 15px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(msg, CANVAS_W / 2, CANVAS_H - 44);
}

export default TryOnCanvas;
