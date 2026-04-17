import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Overlays a glasses image on top of an uploaded face photo using CSS positioning.
 */
const TryOnOverlay = ({ faceImageUrl, glassesImageUrl, position = { top: '30%', left: '18%' }, scale = 1.0 }) => {
  if (!faceImageUrl) return null;

  return (
    <div style={{ position: 'relative', display: 'inline-block', maxWidth: '100%' }}>
      <img
        src={faceImageUrl}
        alt="Your face"
        style={{ width: '100%', borderRadius: '16px', display: 'block' }}
      />
      <AnimatePresence>
        {glassesImageUrl && (
          <motion.img
            key={glassesImageUrl}
            src={glassesImageUrl}
            alt="Try-on glasses"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              position: 'absolute',
              top: position.top,
              left: position.left,
              width: `${64 * scale}%`,
              pointerEvents: 'none',
              filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.3))',
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TryOnOverlay;
