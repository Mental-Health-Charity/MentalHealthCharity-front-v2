import { styled } from '@mui/material';

export const StyledAnnouncementWrapper = styled('div')`
    position: fixed;
    top: 100px;
    background-color: ${({ theme }) => theme.palette.primary.main};
    display: flex;
    transition: 0.5s;
    z-index: 1000;
    box-shadow: 0px 0px 10px ${({ theme }) => theme.palette.shadows.box};
    border-radius: 10px;
    transform: translateX(-78%);

    @media (max-width: 768px) {
        bottom: 20px;
        top: auto;
    }

    .announcement-content {
        padding: 10px;
        display: flex;
        gap: 10px;
        align-items: center;
        background-color: ${({ theme }) => theme.palette.background.default};
    }

    &:hover {
        transform: translateX(0);
    }
`;
