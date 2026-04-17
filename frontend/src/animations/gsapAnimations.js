import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Animate hero glasses floating up
 */
export const heroGlassesEntrance = (element) => {
  gsap.fromTo(
    element,
    { y: 80, opacity: 0, scale: 0.9 },
    { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' }
  );
};

/**
 * Continuous floating animation for hero element
 */
export const floatingAnimation = (element) => {
  gsap.to(element, {
    y: -15,
    duration: 2.5,
    ease: 'power1.inOut',
    yoyo: true,
    repeat: -1,
  });
};

/**
 * Scroll-triggered fade-up for sections
 */
export const scrollFadeUp = (elements, stagger = 0.15) => {
  gsap.fromTo(
    elements,
    { y: 50, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: elements[0] || elements,
        start: 'top 85%',
        once: true,
      },
    }
  );
};

/**
 * Horizontal slide-in from left
 */
export const slideInLeft = (element) => {
  gsap.fromTo(
    element,
    { x: -60, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      duration: 0.9,
      ease: 'power2.out',
      scrollTrigger: { trigger: element, start: 'top 85%', once: true },
    }
  );
};

/**
 * Scale-in animation for product cards
 */
export const cardScaleIn = (elements) => {
  gsap.fromTo(
    elements,
    { scale: 0.85, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: 'back.out(1.4)',
      scrollTrigger: { trigger: elements[0] || elements, start: 'top 90%', once: true },
    }
  );
};
