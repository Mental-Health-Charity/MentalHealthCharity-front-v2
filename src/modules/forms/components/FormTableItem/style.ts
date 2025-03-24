import { styled } from "@mui/material";

export const Row = styled("ul")`
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;

    background-color: ${({ theme }) => theme.palette.background.paper};
    border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
    &:last-child {
        border-bottom: none;
    }
`;

export const Cell = styled("li")`
    margin: 0;
    border: 1px solid ${({ theme }) => theme.palette.divider};
    padding: 20px;
    width: 400px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 14px;
    font-weight: 400;
    color: ${({ theme }) => theme.palette.text.secondary};
`;
