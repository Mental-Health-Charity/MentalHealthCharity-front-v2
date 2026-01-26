import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Box } from "@mui/material";
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
        <Box
            sx={{
                position: "absolute",
                bottom: 24,
                left: "50%",
                transform: "translateX(-50%)",
                color: "white",
                opacity: 0.85,
                animation: "scrollHint 1.6s ease-in-out infinite",
                "@keyframes scrollHint": {
                    "0%": { transform: "translate(-50%, 0)" },
                    "50%": { transform: "translate(-50%, 8px)" },
                    "100%": { transform: "translate(-50%, 0)" },
                },
            }}
        >
            <KeyboardArrowDownIcon fontSize="large" />
        </Box>
    );
};

export default ScrollIndicator;
