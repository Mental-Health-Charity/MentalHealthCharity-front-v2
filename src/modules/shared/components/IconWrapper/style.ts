import { styled } from "@mui/material";

const DEFAULT_SIZE = 40;

const IconWrapper = styled("div")<{ color?: string; size?: number }>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${({ size }) => size || DEFAULT_SIZE}px;
    height: ${({ size }) => size || DEFAULT_SIZE}px;
    border-radius: 8px;
    background-color: ${({ color }) => color || "transparent"}1b;

    & svg {
        fill: ${({ color, theme }) => color || theme.palette.primary.main};
        width: ${({ size }) => (size || DEFAULT_SIZE) - 15}px;
        height: ${({ size }) => (size || DEFAULT_SIZE) - 15}px;
    }
`;

export default IconWrapper;
