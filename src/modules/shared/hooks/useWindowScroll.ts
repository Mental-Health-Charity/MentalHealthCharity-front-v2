import { useEffect, useState } from "react";

const useWindowScroll = () => {
    const [scroll, setScroll] = useState({ x: 0, y: 0 });
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScroll({ x: window.scrollX, y: window.scrollY });
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return { scroll, isScrolled };
};

export default useWindowScroll;
