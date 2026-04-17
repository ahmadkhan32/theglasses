/**
 * hoverAnimation.js
 * Framer Motion variants and helpers for hover micro-interactions.
 * Import these into any component needing hover effects.
 */

/** 3D tilt effect for product cards / glasses images */
export const tiltVariants = {
  rest: {
    rotateY: 0,
    rotateX: 0,
    scale: 1,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
  hover: {
    rotateY: 8,
    rotateX: -4,
    scale: 1.04,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
};

/** Simple lift + shadow for cards */
export const liftVariants = {
  rest: { y: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  hover: { y: -6, boxShadow: '0 16px 40px rgba(0,0,0,0.14)' },
};

/** Button press feedback */
export const buttonTap = { scale: 0.95 };
export const buttonHover = { scale: 1.04 };

/** Glasses sway on hover (for hero / product images) */
export const glassesSway = {
  rest: { rotate: 0, scale: 1 },
  hover: {
    rotate: [0, -3, 3, -2, 0],
    scale: 1.06,
    transition: { duration: 0.6, ease: 'easeInOut' },
  },
};

/**
 * Apply mouse-move 3D tilt to a DOM element using inline style.
 * Usage:  element.addEventListener('mousemove', (e) => applyTilt(e, element))
 *         element.addEventListener('mouseleave', () => resetTilt(element))
 */
export const applyTilt = (e, element) => {
  const rect = element.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = (e.clientX - cx) / (rect.width / 2);
  const dy = (e.clientY - cy) / (rect.height / 2);
  element.style.transform = `perspective(800px) rotateY(${dx * 10}deg) rotateX(${-dy * 8}deg) scale(1.03)`;
  element.style.transition = 'transform 0.08s ease';
};

export const resetTilt = (element) => {
  element.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)';
  element.style.transition = 'transform 0.35s ease';
};
