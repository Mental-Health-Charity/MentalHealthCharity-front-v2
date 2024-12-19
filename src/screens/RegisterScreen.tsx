import { Box, Typography, useTheme, Link } from "@mui/material";
import { RegisterFormValues } from "../modules/auth/types";
import login_background from "../assets/static/login_bg.svg";
import { useUser } from "../modules/auth/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../modules/auth/components/RegisterForm";

const RegisterScreen = () => {
    const theme = useTheme();
    const { register } = useUser();
    const navigate = useNavigate();

    const handleSubmit = (values: RegisterFormValues) => {
        register.mutate(values, {
            onSuccess: () => {
                navigate("/");
            },
        });
    };

    return (
        <Box sx={{ display: "flex" }}>
            <Box
                sx={{
                    overflow: "hidden",
                    maxWidth: "50vw",
                    boxShadow: `3px 4px 4px ${theme.palette.shadows.box}`,
                }}
            >
                <img
                    height="100%"
                    style={{ height: "100vh" }}
                    src={login_background}
                    alt="Logo"
                />
            </Box>

            <Box
                sx={{
                    minHeight: "100vh",
                    backgroundColor: theme.palette.background.default,
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
                        <Typography
                            fontWeight={500}
                            variant="body1"
                            color="textSecondary"
                        >
                            Zarejestruj się korzystając z poniższego formularza,
                            cieszymy się, że do nas dołączasz!
                        </Typography>
                    </Box>
                    <RegisterForm onSubmit={handleSubmit} />
                </Box>
                <Box
                    mt="200px"
                    display="flex"
                    width="100%"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Typography variant="body1">
                        Masz już konto?{" "}
                        <Link
                            underline="none"
                            sx={{ fontWeight: "bold" }}
                            href="/login"
                        >
                            Zaloguj się
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default RegisterScreen;
