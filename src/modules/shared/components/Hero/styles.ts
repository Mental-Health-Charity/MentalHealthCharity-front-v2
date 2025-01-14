import { styled } from '@mui/material';

export const HeroLogoContainer = styled('div')(() => ({
    width: 'auto',
    height: '565px',
    display: 'flex',
    position: 'absolute',
    right: '0',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',

    '& img': {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
}));
