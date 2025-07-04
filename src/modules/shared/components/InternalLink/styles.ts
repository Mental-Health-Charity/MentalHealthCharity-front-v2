import { styled } from "@mui/material";
import { Link } from "react-router-dom";

const InternalLink = styled(Link)<{ color?: "primary" | "secondary" }>`
    font-family: ${({ theme }) => theme.typography.fontFamily};
    color: ${({ theme, color }) => (color === "secondary" ? theme.palette.text.primary : theme.palette.secondary.main)};
`;

export default InternalLink;

export const ExternalLink = styled("a")<{ color?: "primary" | "secondary" }>`
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: 16px;
    color: ${({ theme, color }) => (color === "secondary" ? theme.palette.text.primary : theme.palette.secondary.main)};
`;
