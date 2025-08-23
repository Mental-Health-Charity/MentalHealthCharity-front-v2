import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import EmailIcon from "../assets/static/email_icon.svg";
import { StyledLink } from "../modules/shared/components/StyledLink/styles";
import useTheme from "../theme";

const ConfirmEmailScreen = () => {
    const { t } = useTranslation();
    const theme = useTheme();

    return (
        <Box
            display="flex"
            minHeight="90vh"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap={5}
            padding="80px 20px"
        >
            <img src={EmailIcon} alt="Email Icon" width={200} height={200} />

            <Box maxWidth={600} gap={2} display="flex" flexDirection="column">
                <Typography textAlign="center" component="h1" variant="h4">
                    {t("confirm_email_begin.title")}
                </Typography>
                <Typography
                    sx={{
                        opacity: 0.75,
                    }}
                    textAlign="center"
                    component="h2"
                    variant="body1"
                >
                    {t("confirm_email_begin.description")}
                </Typography>
            </Box>
            <Box sx={{ opacity: 0.75 }} padding="40px 0 0 0" borderTop={`1px solid ${theme.palette.divider}`}>
                <Typography>
                    {t("confirm_email_begin.footer")}{" "}
                    <StyledLink to="/auth/register">{t("confirm_email_begin.change_email")}</StyledLink>{" "}
                    <StyledLink to="/login">{t("confirm_email_begin.login")}</StyledLink>
                </Typography>
            </Box>
        </Box>
    );
};

export default ConfirmEmailScreen;
