/**
 * tryOnEffect.js
 * Canvas-based helpers for the Virtual Try-On feature.
 * Used by TryOnCanvas.jsx internally; can also be imported
 * standalone for screenshot/export utilities.
 */

/**
 * Draw a user face image covering the full canvas.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement} img
 * @param {number} w  Canvas width
 * @param {number} h  Canvas height
 */
export const drawFaceImage = (ctx, img, w, h) => {
  ctx.drawImage(img, 0, 0, w, h);
};

/**
 * Draw glasses overlay centred at (x, y) with given width, rotation and opacity.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement} glassesImg
 * @param {{ x: number, y: number }} pos   Top-left corner position
 * @param {number} size   Width in pixels
 * @param {number} rotation  Degrees
 * @param {number} opacity   0–1
 */
export const drawGlassesOverlay = (ctx, glassesImg, pos, size, rotation, opacity = 1) => {
  const aspectRatio = glassesImg.width / glassesImg.height;
  const w = size;
  const h = w / aspectRatio;
  const rad = (rotation * Math.PI) / 180;

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.translate(pos.x + w / 2, pos.y + h / 2);
  ctx.rotate(rad);
  ctx.drawImage(glassesImg, -w / 2, -h / 2, w, h);
  ctx.restore();
};

/**
 * Draw dashed selection border around the glasses with corner handles.
 */
export const drawSelectionBorder = (ctx, pos, size, glassesImg, rotation) => {
  const w = size;
  const h = glassesImg ? w / (glassesImg.width / glassesImg.height) : w * 0.4;
  const rad = (rotation * Math.PI) / 180;

  ctx.save();
  ctx.translate(pos.x + w / 2, pos.y + h / 2);
  ctx.rotate(rad);

  ctx.strokeStyle = 'rgba(0,102,255,0.45)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.strokeRect(-w / 2 - 5, -h / 2 - 5, w + 10, h + 10);

  ctx.setLineDash([]);
  ctx.fillStyle = '#0066ff';
  [
    [-w / 2 - 5, -h / 2 - 5],
    [ w / 2 + 5, -h / 2 - 5],
    [-w / 2 - 5,  h / 2 + 5],
    [ w / 2 + 5,  h / 2 + 5],
  ].forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
};

/**
 * Draw a face guide (dashed ellipse + eye circles).
 */
export const drawFaceGuide = (ctx, canvasW, canvasH) => {
  ctx.save();
  ctx.strokeStyle = 'rgba(0,102,255,0.35)';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 5]);
  ctx.beginPath();
  ctx.ellipse(canvasW / 2, canvasH / 2 - 20, 140, 175, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(0,102,255,0.22)';
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 4]);
  [[canvasW / 2 - 60, canvasH / 2 - 60], [canvasW / 2 + 60, canvasH / 2 - 60]].forEach(([ex, ey]) => {
    ctx.beginPath();
    ctx.ellipse(ex, ey, 35, 18, 0, 0, Math.PI * 2);
    ctx.stroke();
  });

  ctx.restore();
};

/**
 * Hit-test: returns true if point (px, py) is within the glasses bounding box.
 */
export const isInsideGlasses = (px, py, pos, size, glassesImg) => {
  const w = size;
  const h = glassesImg ? w / (glassesImg.width / glassesImg.height) : w * 0.4;
  return px >= pos.x && px <= pos.x + w && py >= pos.y && py <= pos.y + h;
};

/**
 * Export the canvas as a PNG data URL (for download).
 */
export const exportCanvasPng = (canvas) => canvas.toDataURL('image/png');

/**
 * Trigger a file download from a data URL.
 */
export const downloadImage = (dataUrl, filename = 'tryon-preview.png') => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
};
