export const scrollFadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut' }
    }
};

export const scrollFadeInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

export const scrollFadeInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

export const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } }
};

export const hoverRotate = {
    rest: { rotateY: 0, scale: 1 },
    hover: {
        rotateY: 20,
        rotateX: 10,
        scale: 1.08,
        transition: { type: 'spring', stiffness: 300, damping: 20 }
    }
};

export const hoverLift = {
    rest: { y: 0, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' },
    hover: {
        y: -8,
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)',
        transition: { duration: 0.3 }
    }
};
