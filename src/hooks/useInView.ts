import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
}

export const useInView = ({
    threshold = 0.15,
    rootMargin = "0px 0px -60px 0px",
    triggerOnce = true,
}: UseInViewOptions = {}) => {
    const ref = useRef<HTMLDivElement>(null);

    // Respect prefers-reduced-motion
    const prefersReducedMotion =
        typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const [isInView, setIsInView] = useState(prefersReducedMotion);

    useEffect(() => {
        if (prefersReducedMotion) return;

        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    if (triggerOnce) {
                        observer.unobserve(element);
                    }
                } else if (!triggerOnce) {
                    setIsInView(false);
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(element);

        return () => {
            observer.unobserve(element);
        };
    }, [threshold, rootMargin, triggerOnce, prefersReducedMotion]);

    return { ref, isInView };
};
