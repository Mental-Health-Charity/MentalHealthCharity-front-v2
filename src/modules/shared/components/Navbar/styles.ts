import { AppBar, styled } from "@mui/material";

export const StyledAppBar = styled(AppBar)`
    padding: 8px 5px;
    background-color: ${({ theme }) => theme.palette.background.paper};
    box-shadow: 5px 2px 2px rgba(0, 0, 0, 0.1);
    position: fixed;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 1600px;
    border-radius: 10px;
    transition: all 1s;
    z-index: 100;
    color: ${({ theme }) => theme.palette.text.primary};

    @media (max-width: 600px) {
        top: 0;
        border-radius: 0;
    }
`;
