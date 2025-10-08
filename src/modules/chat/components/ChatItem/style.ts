import { styled } from "@mui/material";

export const UnreadIndicator = styled("span")(({ theme }) => ({
    padding: "2px 6px",
    fontSize: "12px",
    borderRadius: "50%",
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.main,
}));
