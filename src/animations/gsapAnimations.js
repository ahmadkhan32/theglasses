import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const animateHero = (target) => {
    gsap.fromTo(target,
        { opacity: 0, y: -60 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );
};

export const animateOnScroll = (targets) => {
    gsap.utils.toArray(targets).forEach((el) => {
        gsap.fromTo(el,
            { opacity: 0, y: 60 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                }
            }
        );
    });
};

export const animateStagger = (parent, children, delay = 0.15) => {
    gsap.fromTo(children,
        { opacity: 0, y: 40 },
        {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            stagger: delay,
            scrollTrigger: {
                trigger: parent,
                start: 'top 80%',
            }
        }
    );
};

export const animateGlasses3D = (target) => {
    gsap.to(target, {
        rotateY: 20,
        rotateX: 10,
        scale: 1.05,
        duration: 0.4,
        ease: 'power2.out',
    });
};

export const resetGlasses3D = (target) => {
    gsap.to(target, {
        rotateY: 0,
        rotateX: 0,
        scale: 1,
        duration: 0.4,
        ease: 'power2.inOut',
    });
};
