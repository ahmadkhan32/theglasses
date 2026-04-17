/**
 * Face detection utility built on face-api.js
 * Models are loaded from jsDelivr CDN – no manual file download needed.
 */
import * as faceapi from 'face-api.js';

const MODEL_URL = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights';

let modelsLoaded = false;
let modelsLoading = null; // promise cache – never double-loads

/**
 * Load TinyFaceDetector + FaceLandmark68 models once and cache.
 * Safe to call multiple times.
 */
export const loadModels = () => {
  if (modelsLoaded) return Promise.resolve();
  if (modelsLoading) return modelsLoading;

  modelsLoading = Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
  ]).then(() => {
    modelsLoaded = true;
    modelsLoading = null;
  });

  return modelsLoading;
};

export const areModelsLoaded = () => modelsLoaded;

/**
 * Detect face landmarks on an image, video, or canvas element.
 * @returns face detection result or null
 */
export const detectFace = async (el) => {
  if (!modelsLoaded) await loadModels();
  const detection = await faceapi
    .detectSingleFace(el, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.3 }))
    .withFaceLandmarks();
  return detection || null;
};

/**
 * Convert raw face landmarks into canvas-space glasses transform.
 *
 * @param {object} landmarks   face-api FaceLandmarks68 object
 * @param {number} canvasW     canvas render width  (px)
 * @param {number} canvasH     canvas render height (px)
 * @param {number} srcW        source image/video width  (px)
 * @param {number} srcH        source image/video height (px)
 * @returns {{ cx, cy, glassesWidth, angle }}
 */
export const getGlassesTransform = (landmarks, canvasW, canvasH, srcW, srcH) => {
  const pts = landmarks.positions; // 68 {x,y} points

  const sx = canvasW / srcW;
  const sy = canvasH / srcH;

  // Left eye pts 36-41, right eye pts 42-47
  const left  = pts.slice(36, 42);
  const right = pts.slice(42, 48);

  const avgX = (arr) => arr.reduce((s, p) => s + p.x, 0) / arr.length;
  const avgY = (arr) => arr.reduce((s, p) => s + p.y, 0) / arr.length;

  const leftCX  = avgX(left)  * sx;
  const leftCY  = avgY(left)  * sy;
  const rightCX = avgX(right) * sx;
  const rightCY = avgY(right) * sy;

  const cx = (leftCX + rightCX) / 2;
  const cy = (leftCY + rightCY) / 2;

  // Outer corners: pt 36 = left outer, pt 45 = right outer
  const outerLeft  = { x: pts[36].x * sx, y: pts[36].y * sy };
  const outerRight = { x: pts[45].x * sx, y: pts[45].y * sy };

  const glassesWidth = Math.sqrt(
    (outerRight.x - outerLeft.x) ** 2 +
    (outerRight.y - outerLeft.y) ** 2
  ) * 1.55;

  const angle = Math.atan2(rightCY - leftCY, rightCX - leftCX);

  return { cx, cy, glassesWidth, angle };
};
