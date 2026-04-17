import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Reveal all elements with data-reveal attribute on scroll
 */
export const initScrollReveal = () => {
  const elements = document.querySelectorAll('[data-reveal]');
  elements.forEach((el) => {
    const direction = el.dataset.reveal || 'up';
    const from =
      direction === 'up'    ? { y: 50, opacity: 0 }
      : direction === 'down'  ? { y: -50, opacity: 0 }
      : direction === 'left'  ? { x: -50, opacity: 0 }
      : direction === 'right' ? { x: 50, opacity: 0 }
      : { opacity: 0 };

    gsap.fromTo(el, from, {
      x: 0,
      y: 0,
      opacity: 1,
      duration: 0.85,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true,
      },
    });
  });
};

export default initScrollReveal;
