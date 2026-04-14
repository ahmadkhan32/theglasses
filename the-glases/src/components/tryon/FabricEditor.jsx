import React, { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import * as fabricPkg from 'fabric';
const fabric = fabricPkg.fabric || fabricPkg;
import { Move } from 'lucide-react';

// FabricEditor: full drag / resize / rotate glasses editor using Fabric.js
// Props:
//   userImage   — data URL or object URL of the uploaded face photo
//   glassesImage — URL of the glasses PNG to overlay
//   opacity     — 0..1
//   canvasRef   — forwarded ref that exposes { toDataURL }

const CANVAS_W = 540;
const CANVAS_H = 580;

const FabricEditor = forwardRef(({ userImage, glassesImage, opacity = 1 }, ref) => {
    const canvasElRef = useRef(null);
    const fabricRef = useRef(null);        // fabric.Canvas instance
    const glassesObjRef = useRef(null);   // current fabric.Image for glasses
    const [ready, setReady] = useState(false);

    // Expose toDataURL to parent via ref
    useImperativeHandle(ref, () => ({
        toDataURL: (opts) => fabricRef.current?.toDataURL(opts || { format: 'png' }),
    }), []);

    // ─────────────────────────────────────────────────────────────────────────
    // 1. INIT Fabric canvas once
    // ─────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!canvasElRef.current) return;

        const fc = new fabric.Canvas(canvasElRef.current, {
            width: CANVAS_W,
            height: CANVAS_H,
            selection: true,
            preserveObjectStacking: true,
        });

        fabricRef.current = fc;
        setReady(true);

        return () => {
            fc.dispose();
            fabricRef.current = null;
        };
    }, []);

    // ─────────────────────────────────────────────────────────────────────────
    // 2. LOAD user photo as background
    // ─────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        const fc = fabricRef.current;
        if (!fc) return;

        if (!userImage) {
            fc.setBackgroundImage(null, () => {
                // Draw placeholder
                fc.clear();
                fc.backgroundColor = '#f1f5f9';
                fc.renderAll();
            });
            return;
        }

        fabric.Image.fromURL(userImage, (img) => {
            const scaleX = CANVAS_W / img.width;
            const scaleY = CANVAS_H / img.height;
            const scale = Math.max(scaleX, scaleY);

            img.set({ scaleX: scale, scaleY: scale, originX: 'left', originY: 'top' });
            fc.setBackgroundImage(img, () => {
                fc.renderAll();
            });
        });
    }, [userImage]);

    // ─────────────────────────────────────────────────────────────────────────
    // 3. LOAD glasses as interactive Fabric.Image (drag / resize / rotate)
    // ─────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        const fc = fabricRef.current;
        if (!fc || !ready) return;

        // Remove old glasses object
        if (glassesObjRef.current) {
            fc.remove(glassesObjRef.current);
            glassesObjRef.current = null;
        }

        if (!glassesImage) return;

        fabric.Image.fromURL(glassesImage, (img) => {
            const targetW = CANVAS_W * 0.55; // ~55% of canvas width
            const scale = targetW / img.width;

            img.set({
                left: CANVAS_W / 2,
                top: CANVAS_H * 0.38,
                scaleX: scale,
                scaleY: scale,
                originX: 'center',
                originY: 'center',
                opacity: opacity,
                borderColor: '#3b82f6',
                cornerColor: '#3b82f6',
                cornerStyle: 'circle',
                cornerSize: 10,
                transparentCorners: false,
            });

            fc.add(img);
            fc.setActiveObject(img);
            glassesObjRef.current = img;
            fc.renderAll();
        }, { crossOrigin: 'anonymous' });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [glassesImage, ready]);

    // ─────────────────────────────────────────────────────────────────────────
    // 4. Update opacity when slider changes
    // ─────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        const obj = glassesObjRef.current;
        const fc = fabricRef.current;
        if (!obj || !fc) return;
        obj.set('opacity', opacity);
        fc.renderAll();
    }, [opacity]);

    return (
        <div style={{ position: 'relative', width: '100%', maxWidth: `${CANVAS_W}px`, margin: '0 auto' }}>
            {/* Canvas */}
            <canvas
                ref={canvasElRef}
                style={{
                    width: '100%',
                    borderRadius: '16px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
                    display: 'block',
                    background: '#f1f5f9',
                }}
            />

            {/* Placeholder when no photo */}
            {!userImage && (
                <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    gap: '12px', pointerEvents: 'none',
                    borderRadius: '16px',
                }}>
                    <span style={{ fontSize: '48px' }}>📷</span>
                    <p style={{ fontWeight: 600, color: '#64748b', fontSize: '15px' }}>Upload a photo to start</p>
                    <p style={{ fontSize: '12px', color: '#94a3b8' }}>Drag · Resize · Rotate the glasses frame</p>
                </div>
            )}

            {/* Tip badge */}
            {userImage && glassesImage && (
                <div style={{
                    position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(0,0,0,0.65)', color: '#fff',
                    padding: '6px 14px', borderRadius: '100px',
                    fontSize: '12px', fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: '6px',
                    backdropFilter: 'blur(8px)',
                    pointerEvents: 'none',
                }}>
                    <Move size={13} />
                    Click glasses to drag · handles to resize &amp; rotate
                </div>
            )}
        </div>
    );
});

FabricEditor.displayName = 'FabricEditor';
export default FabricEditor;
