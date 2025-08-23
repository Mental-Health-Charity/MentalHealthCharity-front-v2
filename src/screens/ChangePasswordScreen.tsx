import LockIcon from "@mui/icons-material/Lock";
import { Box, Button, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import EmailIcon from "../assets/static/email_icon.svg";
import IconWrapper from "../modules/shared/components/IconWrapper/style";
import handleApiError from "../modules/shared/helpers/handleApiError";
import ChangePasswordBeginFormBegin from "../modules/users/components/ChangePasswordFormBegin";
import { changePasswordBegin } from "../modules/users/queries/changePasswordBeginMutation";
import useTheme from "../theme";

const ChangePasswordScreen = () => {
    const [isCodeSent, setIsCodeSent] = useState(false);
    const { t } = useTranslation();
    const theme = useTheme();

    const { mutate: beginMutation, isPending } = useMutation({
        mutationFn: changePasswordBegin,
        onSuccess: () => {
            setIsCodeSent(true);
        },
        onError: (err) => {
            handleApiError(err);
        },
    });

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
            <Box maxWidth={800} width="100%">
                {!isCodeSent && (
                    <>
                        <Box sx={{ display: "flex", gap: 3, flexDirection: "column", mb: 3 }}>
                            <IconWrapper size={50} color={theme.palette.primary.main}>
                                <LockIcon />
                            </IconWrapper>
                            <Box>
                                <Typography component="h1" sx={{ lineHeight: "45px" }} variant="h4">
                                    {t("change_password_screen.title")}
                                </Typography>
                                <Typography component="h2" sx={{ lineHeight: "35px", opacity: 0.75 }} variant="h6">
                                    {t("change_password_screen.description")}
                                </Typography>
                            </Box>
                        </Box>
                        <ChangePasswordBeginFormBegin isLoading={isPending} onSubmit={beginMutation} />
                    </>
                )}
                {isCodeSent && (
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
                                {t("change_password_screen.email_sent_title")}
                            </Typography>
                            <Typography
                                sx={{
                                    opacity: 0.75,
                                }}
                                textAlign="center"
                                component="h2"
                                variant="body1"
                            >
                                {t("change_password_screen.email_sent_description")}
                            </Typography>
                        </Box>
                        <Box
                            sx={{ opacity: 0.75 }}
                            padding="40px 0 0 0"
                            borderTop={`1px solid ${theme.palette.divider}`}
                        >
                            <Typography>
                                {t("change_password_screen.footer")}{" "}
                                <Button onClick={() => setIsCodeSent(false)} variant="text">
                                    {t("common.try_again")}
                                </Button>
                            </Typography>
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default ChangePasswordScreen;
