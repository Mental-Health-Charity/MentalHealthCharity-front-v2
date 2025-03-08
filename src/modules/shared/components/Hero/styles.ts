import { Button, styled } from "@mui/material";

export const HeroLogoContainer = styled("div")(() => ({
    width: "auto",
    height: "565px",
    display: "flex",
    position: "absolute",
    right: "0",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    justifyContent: "center",
    alignItems: "center",

    "& img": {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },

    "@media (max-width: 600px)": {
        position: "relative",
        width: "100%",
        height: "200px",
        borderRadius: "0",
    },
}));

// "@keyframes pulse": {
//     "0%": {
//         boxShadow: `0 0 0 0 ${theme.palette.colors.accent}33`,
//     },
//     "70%": {
//         transform: "scale(1)",
//         boxShadow: `0 0 0 14px ${theme.palette.colors.accent}2E`,
//     },
//     "100%": {
//         boxShadow: `0 0 0 0 transparent`,
//     },
// },

export const StyledPulseButton = styled(Button)(({ theme }) => ({
    // add animation before expanding and desappearing
    animation: "pulse 2s infinite",
    "@keyframes pulse": {
        "0%": {
            boxShadow: `0 0 0 0 ${theme.palette.colors.accent}BF`,
        },
        "70%": {
            boxShadow: `0 0 0 10px ${theme.palette.colors.accent}00`,
        },
        "100%": {
            boxShadow: `0 0 0 0 ${theme.palette.colors.accent}00`,
        },
    },
}));
