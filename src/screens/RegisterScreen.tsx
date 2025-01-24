import { Box, Link, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import login_background from '../assets/static/login_bg.svg';
import { useUser } from '../modules/auth/components/AuthProvider';
import RegisterForm from '../modules/auth/components/RegisterForm';
import ResetTokenModal from '../modules/auth/components/ResetTokenModal';
import { RegisterFormValues } from '../modules/auth/types';

const RegisterScreen = () => {
    const theme = useTheme();
    const { register } = useUser();
    const navigate = useNavigate();
    const [restoreToken, setRestoreToken] = useState<string | null>(null);

    const handleSubmit = (values: RegisterFormValues) => {
        register.mutate(values, {
            onSuccess: ({ reset_token }) => {
                setRestoreToken(reset_token);
            },
        });
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Box
                sx={{
                    overflow: 'hidden',
                    maxWidth: { xs: '0%', md: '50%' },
                    boxShadow: `3px 4px 4px ${theme.palette.shadows.box}`,
                }}
            >
                <img height="100%" style={{ height: '100vh' }} src={login_background} alt="Logo" />
            </Box>

            <Box
                sx={{
                    minHeight: '100vh',
                    backgroundColor: theme.palette.background.default,
                    padding: '120px 20px',
                }}
                width="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
            >
                <Box maxWidth={500}>
                    <Box width="100%" textAlign="center" marginBottom={3}>
                        <Typography fontWeight="bold" variant="h4" gutterBottom>
                            Utwórz nowe konto!
                        </Typography>
                        <Typography fontWeight={500} variant="body1" color="textSecondary">
                            Zarejestruj się korzystając z poniższego formularza, cieszymy się, że do nas dołączasz!
                        </Typography>
                    </Box>
                    <RegisterForm onSubmit={handleSubmit} />
                </Box>
                <Box mt="200px" display="flex" width="100%" alignItems="center" justifyContent="center">
                    <Typography variant="body1">
                        Masz już konto?{' '}
                        <Link underline="none" sx={{ fontWeight: 'bold' }} href="/login">
                            Zaloguj się
                        </Link>
                    </Typography>
                </Box>
            </Box>
            <ResetTokenModal token={restoreToken || ''} open={!!restoreToken} onClose={() => navigate('/')} />
        </Box>
    );
};

export default RegisterScreen;
