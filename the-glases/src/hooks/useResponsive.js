import { useState, useEffect } from "react";

export default function useResponsive() {
    const [screen, setScreen] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setScreen(window.innerWidth);
        window.addEventListener("resize", handleResize);
        
        // Initial setup check
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return {
        isMobile: screen < 768,
        isTablet: screen >= 768 && screen < 1024,
        isDesktop: screen >= 1024,
    };
}
