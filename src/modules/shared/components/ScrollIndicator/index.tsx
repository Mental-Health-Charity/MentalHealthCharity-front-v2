import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

const SCROLL_TOLERANCE_PX = 4;

const ScrollIndicator = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const hasScroll = document.documentElement.scrollHeight > window.innerHeight + SCROLL_TOLERANCE_PX;

        setVisible(hasScroll);

        if (!hasScroll) return;

        const onScroll = () => {
            if (window.scrollY > 10) {
                setVisible(false);
            }
        };

        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    if (!visible) return null;

    return (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-white opacity-85">
            <ChevronDown size={32} />
        </div>
    );
};

export default ScrollIndicator;
