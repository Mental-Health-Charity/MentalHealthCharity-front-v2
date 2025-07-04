import { Link as MuiLink, styled } from "@mui/material";
import { Link } from "react-router-dom";

export const StyledLink = styled(Link)<{ color?: string }>`
    font-family: "Ubuntu", sans-serif;
    color: ${({ theme, color }) => color || theme.palette.primary.dark};
`;

export const StyledExternalLink = styled(MuiLink)<{ color: "primary" | "secondary" }>`
    font-family: "Ubuntu", sans-serif;
    color: ${({ theme, color }) => color || theme.palette.colors.accent};
`;
