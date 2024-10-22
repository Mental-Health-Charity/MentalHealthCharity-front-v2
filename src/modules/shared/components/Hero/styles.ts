import { styled } from "@mui/material";

export const HeroLogoContainer = styled("div")(() => ({
  width: "auto",
  height: "300px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  animation: `fadeIn 4s infinite`,

  "@keyframes fadeIn": {
    "0%": {
      transform: "translateY(15px)",
    },
    "50%": {
      transform: "translateY(0)",
    },
    "100%": {
      transform: "translateY(15px)",
    },
  },
}));
