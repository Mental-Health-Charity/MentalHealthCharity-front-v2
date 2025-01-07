import { Box, styled } from '@mui/material';
import dots from '../../../../assets/static/card_dots.svg';
import dots_three from '../../../../assets/static/card_dots_three.svg';

export const StyledCard = styled(Box)<{
    variant: 'default' | 'secondary';
}>`
    background-color: ${({ theme }) => theme.palette.background.paper};
    z-index: 1;
    padding: 45px;
    border-radius: 8px;
    box-shadow: 0 4px 13px rgba(0, 0, 0, 0.25);
    color: ${({ theme }) => theme.palette.text.secondary};
    width: fit-content;
    position: relative;

    &::before {
        display: ${({ variant }) => (variant === 'secondary' ? 'block' : 'none')};
        content: '';
        position: absolute;
        right: 20px;
        top: 20px;
        width: 60px;
        height: 15px;
        background-image: url(${dots_three});
        background-repeat: no-repeat;
    }

    &::after {
        content: '';
        position: absolute;
        width: 86px;
        height: 86px;
        background-image: url(${dots});
        background-repeat: no-repeat;
        ${({ variant }) =>
            variant === 'default'
                ? `
            left: 20px;
            bottom: 20px;
        `
                : `
            right: -40px;
            top: 50%;
            transform: translateY(-50%);
        `}
    }
`;
