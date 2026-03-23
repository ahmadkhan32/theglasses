export const hoverRotate = {
    rest: { rotateY: 0, scale: 1 },
    hover: {
        rotateY: 20,
        rotateX: 10,
        scale: 1.1,
        transition: { type: "spring", stiffness: 300, damping: 20 }
    }
};

export const scrollFadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

export const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};
