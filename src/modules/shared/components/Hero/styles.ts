import { Button, Card, styled } from "@mui/material";

export const HeroLogoContainer = styled("div")(() => ({
    width: "auto",
    height: "525px",
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

    "@media (max-width: 1200px)": {
        display: "none",
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

export const StyledHeroCard = styled(Card)(({ theme }) => ({
    padding: "30px",
    position: "relative",
    zIndex: 1,
    borderRadius: "12px",

    [`@media (max-width: ${theme.breakpoints.values.md}px)`]: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        margin: "0 20px",
        // // // backgroundColor: "transparent",
        // // // boxShadow: "none",
        // // padding: "0",
        // overflow: "visible",
        // width: "100%",
    },
}));
