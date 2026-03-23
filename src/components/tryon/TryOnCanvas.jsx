import React, { useRef, useEffect, useState, useCallback } from 'react';

const CANVAS_W = 520;
const CANVAS_H = 580;

const TryOnCanvas = ({ userImage, glassesImage, size, rotation, canvasRef }) => {
    const [dragging, setDragging] = useState(false);
    const [pos, setPos] = useState({ x: CANVAS_W / 2 - 100, y: CANVAS_H / 2 - 60 });
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [glassesLoaded, setGlassesLoaded] = useState(false);

    const userImgRef = useRef(null);
    const glassesImgRef = useRef(null);
    const animFrameRef = useRef(null);

    // Load glasses image
    useEffect(() => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = glassesImage;
        img.onload = () => {
            glassesImgRef.current = img;
            setGlassesLoaded(true);
        };
    }, [glassesImage]);

    // Load user image
    useEffect(() => {
        if (!userImage) return;
        const img = new Image();
        img.src = userImage;
        img.onload = () => { userImgRef.current = img; draw(); };
    }, [userImage]);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

        // Draw user face
        if (userImgRef.current) {
            ctx.drawImage(userImgRef.current, 0, 0, CANVAS_W, CANVAS_H);
        } else {
            ctx.fillStyle = '#f1f5f9';
            ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
            ctx.fillStyle = '#94a3b8';
            ctx.font = '18px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('📷 Upload your photo above', CANVAS_W / 2, CANVAS_H / 2);
        }

        // Draw glasses overlay
        if (glassesImgRef.current) {
            const w = parseInt(size);
            const aspectRatio = glassesImgRef.current.width / glassesImgRef.current.height;
            const h = w / aspectRatio;
            const rad = (parseInt(rotation) * Math.PI) / 180;

            ctx.save();
            ctx.translate(pos.x + w / 2, pos.y + h / 2);
            ctx.rotate(rad);
            ctx.drawImage(glassesImgRef.current, -w / 2, -h / 2, w, h);
            ctx.restore();

            // Draw drag handle border when not dragging
            if (!dragging) {
                ctx.save();
                ctx.translate(pos.x + w / 2, pos.y + h / 2);
                ctx.rotate(rad);
                ctx.strokeStyle = 'rgba(0, 102, 255, 0.5)';
                ctx.lineWidth = 2;
                ctx.setLineDash([6, 4]);
                ctx.strokeRect(-w / 2 - 4, -h / 2 - 4, w + 8, h + 8);
                ctx.restore();
            }
        }
    }, [pos, size, rotation, dragging, canvasRef]);

    // Re-draw on any change
    useEffect(() => {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(animFrameRef.current);
    }, [draw, glassesLoaded]);

    const getCanvasPos = (e, canvas) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = CANVAS_W / rect.width;
        const scaleY = CANVAS_H / rect.height;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY,
        };
    };

    const handleMouseDown = (e) => {
        e.preventDefault();
        const canvas = canvasRef.current;
        const { x, y } = getCanvasPos(e, canvas);
        const w = parseInt(size);
        const gl = glassesImgRef.current;
        const h = gl ? w / (gl.width / gl.height) : w * 0.4;

        if (x >= pos.x && x <= pos.x + w && y >= pos.y && y <= pos.y + h) {
            setDragging(true);
            setDragOffset({ x: x - pos.x, y: y - pos.y });
        }
    };

    const handleMouseMove = (e) => {
        if (!dragging) return;
        e.preventDefault();
        const { x, y } = getCanvasPos(e, canvasRef.current);
        setPos({ x: x - dragOffset.x, y: y - dragOffset.y });
    };

    const handleMouseUp = () => setDragging(false);

    const cursorStyle = dragging ? 'grabbing' : 'grab';

    return (
        <canvas
            ref={canvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            style={{
                width: '100%',
                maxWidth: `${CANVAS_W}px`,
                borderRadius: '16px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
                cursor: cursorStyle,
                touchAction: 'none',
                display: 'block',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
        />
    );
};

export default TryOnCanvas;
