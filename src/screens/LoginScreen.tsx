import { Box, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import login_background from "../assets/static/login_bg.svg";
import { useUser } from "../modules/auth/components/AuthProvider";
import LoginForm from "../modules/auth/components/LoginForm";
import { LoginFormValues } from "../modules/auth/types";
import InternalLink from "../modules/shared/components/InternalLink/styles";

const LoginScreen = () => {
    const theme = useTheme();
    const { login } = useUser();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = (values: LoginFormValues) => {
        setLoading(true);
        login.mutate(values, {
            onSuccess: () => {
                navigate("/");
                setLoading(false);
            },
            onError: () => {
                setLoading(false);
            },
        });
    };

    return (
        <Box sx={{ display: "flex" }}>
            <Box
                sx={{
                    overflow: "hidden",
                    maxWidth: "50%",
                    display: { xs: "none", md: "block" },
                    boxShadow: `3px 4px 4px ${theme.palette.shadows.box}`,
                }}
            >
                <img height="100%" style={{ height: "100vh" }} src={login_background} alt="Logo" />
            </Box>

            <Box
                sx={{
                    minHeight: "100vh",
                    backgroundColor: theme.palette.background.default,
                    padding: "90px 20px",
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
                            Witaj ponownie!
                        </Typography>
                        <Typography fontWeight={500} variant="body1" color="textSecondary">
                            Zaloguj się korzystając z poniższego formularza, cieszymy się, że wróciłeś!
                        </Typography>
                    </Box>
                    <LoginForm disabled={loading} onSubmit={handleSubmit} />
                </Box>
                <Box mt="50px" display="flex" width="100%" alignItems="center" justifyContent="center">
                    <Typography variant="body1">
                        Nie masz konta?{" "}
                        <InternalLink sx={{ fontWeight: "bold" }} to="/auth/register">
                            Zarejestruj się
                        </InternalLink>
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default LoginScreen;
