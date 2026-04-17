/**
 * scrollAnimation.js
 * Framer Motion viewport-based scroll reveal variants and helpers.
 * Re-exports relevant GSAP scroll helpers from gsapAnimations.js.
 */

/** Fade up when element enters viewport */
export const fadeUpVariants = {
  hidden:  { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

/** Staggered container — wrap children with this */
export const staggerContainerVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

/** Child item used inside staggerContainerVariants */
export const staggerItemVariants = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

/** Slide in from left */
export const slideLeftVariants = {
  hidden:  { opacity: 0, x: -48 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

/** Slide in from right */
export const slideRightVariants = {
  hidden:  { opacity: 0, x: 48 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

/** Scale in */
export const scaleInVariants = {
  hidden:  { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: 'backOut' } },
};

/**
 * Default viewport config to pass to Framer Motion `whileInView`.
 * Usage: <motion.div variants={fadeUpVariants} initial="hidden" whileInView="visible" viewport={defaultViewport} />
 */
export const defaultViewport = { once: true, margin: '0px 0px -80px 0px' };

// Re-export GSAP scroll helpers for convenience
export { scrollFadeUp, slideInLeft, cardScaleIn } from './gsapAnimations';
