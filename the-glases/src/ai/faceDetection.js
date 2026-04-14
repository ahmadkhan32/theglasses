// Initialize MediaPipe FaceMesh
// It requires the video element and a callback fired on every processed frame
// NOTE: window.FaceMesh is accessed lazily (inside the function) to ensure the CDN script has loaded.
export const initFaceMesh = (onResults) => {
    const FaceMesh = window.FaceMesh;
    if (!FaceMesh) {
        throw new Error('MediaPipe FaceMesh is not loaded yet. Make sure the CDN script in index.html has loaded.');
    }
    const faceMesh = new FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
    });

    faceMesh.onResults(onResults);

    return faceMesh;
};

// Extract the center position between eyes, the distance (for scale), and the angle (for rotation)
export const getFaceMetrics = (landmarks) => {
    if (!landmarks || landmarks.length === 0) return null;

    // MediaPipe Face Mesh point indices:
    // Left eye center is approx at index 33 or 133
    // Right eye center is approx at index 263 or 362
    // Nose tip is 1
    const leftEye = landmarks[33];
    const rightEye = landmarks[263];
    const nose = landmarks[1];

    if (!leftEye || !rightEye || !nose) return null;

    // These are normalized coordinates [0.0 to 1.0].
    // Center point between the eyes:
    const centerX = (leftEye.x + rightEye.x) / 2;
    const centerY = (leftEye.y + rightEye.y) / 2;

    // Normalized width between the outer corners of eyes
    const distanceNormalize = Math.sqrt(
        Math.pow(rightEye.x - leftEye.x, 2) + Math.pow(rightEye.y - leftEye.y, 2)
    );

    // Angle in radians (for rotation)
    const angleRad = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);

    // The glasses image should be wider than the exact distance between eyes.
    // Usually, glasses width is ~2.2x the distance between the two eyes.
    const glassesScaleFactor = 2.2;

    return {
        x: centerX,
        y: centerY,
        width: distanceNormalize * glassesScaleFactor,
        rotation: angleRad, 
    };
};
