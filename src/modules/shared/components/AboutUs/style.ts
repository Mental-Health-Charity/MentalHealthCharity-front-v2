import { Box, styled } from '@mui/material';

export const StyledImageWrapper = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.palette.secondary.main};
    box-shadow: 0 4px 13px rgba(0, 0, 0, 0.25);
    width: 240px;
`;

export const ImageWrapperControl = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;

    & > *:first-child {
        margin-right: -120px;
        opacity: 0.5;
    }

    & > *:nth-child(2) { 
        opacity 0.1;
 
    }

    & > *:last-child {
        margin-left: -100px;
        opacity: 1;
    }

    @media (max-width: 980px) { 
        & > *:first-child {
            display: none;
        }

        & > *:nth-child(2) { 
            display: none;
    
        }
    }

    @media (max-width: 600px) { 
        display: none;
    }
`;
