import { Box, Typography, useTheme } from '@mui/material';
import login_background from '../assets/static/login_bg.svg';
import toast from 'react-hot-toast';
import ChangePasswordForm from '../modules/users/components/ChangePassword';
import { useState } from 'react';
import { ChangePasswordValues } from '../modules/users/types.ts';
import { ChangePasswordMutation } from '../modules/users/queries/changePasswordMutation.ts';
import { useTranslation } from 'react-i18next';

const ChangePasswordScreen = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (values: ChangePasswordValues) => {
        setLoading(true);
        await ChangePasswordMutation(values)
            .then(() => {
                toast.success(t('profile.changed_password'));
                setLoading(false);
            })
    }
    return (
        <Box sx={{ display: 'flex' }}>
            <Box
                sx={{
                    overflow: 'hidden',
                    maxWidth: '50%',
                    display: { xs: 'none', md: 'block' },
                    boxShadow: `3px 4px 4px ${theme.palette.shadows.box}`,
                }}
            >
                <img height="100%" style={{ height: '100vh' }} src={login_background} alt="Logo" />
            </Box>

            <Box
                sx={{
                    minHeight: '100vh',
                    backgroundColor: theme.palette.background.default,
                    padding: '90px 20px',
                }}
                width="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
            >
                <Box maxWidth={500} width="100%">
                    <Box width="100%" textAlign="center" marginBottom={3}>
                        <Typography fontWeight="bold" variant="h4" gutterBottom>
                            Zmień hasło
                        </Typography>
                        <Typography fontWeight={500} variant="body1" color="textSecondary">
                            Wprowadź stare oraz nowe hasło
                        </Typography>
                    </Box>
                    <ChangePasswordForm disabled={loading} onSubmit={handleSubmit} />
                </Box>
                
            </Box>
        </Box>
    );
};
export default ChangePasswordScreen;
