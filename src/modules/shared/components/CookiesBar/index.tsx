import CookieIcon from '@mui/icons-material/Cookie';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useTheme from '../../../../theme';
import InternalLink from '../InternalLink/styles';

const CookiesBar = () => {
    const { t } = useTranslation();
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    const [isOpen, setIsOpen] = useState(cookiesAccepted === null);
    const theme = useTheme();

    const handleAcceptCookies = useCallback(() => {
        localStorage.setItem('cookiesAccepted', 'true');
        setIsOpen(false);
    }, []);

    return (
        <Box
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                width: '100%',
                bgcolor: theme.palette.colors.dark,
                color: 'white',
                padding: 1,
                display: isOpen ? 'block' : 'none',
                opacity: 0.9,
                zIndex: 9999,

                '&:hover': {
                    opacity: 1,
                },
            }}
        >
            <Container maxWidth="xl">
                <Stack
                    direction={{
                        md: 'row',
                        xs: 'column',
                    }}
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                >
                    <Typography
                        sx={{
                            gap: '10px',
                            display: 'inline-flex',
                            flexWrap: 'wrap',
                        }}
                        variant="body2"
                    >
                        <CookieIcon />
                        {t('common.cookies_message')}
                        <InternalLink to="/tos">{t('common.cookies_policy')} </InternalLink>
                    </Typography>
                    <Button variant="contained" size="small" color="primary" onClick={handleAcceptCookies}>
                        {t('common.accept_cookies')}
                    </Button>
                </Stack>
            </Container>
        </Box>
    );
};

export default CookiesBar;
