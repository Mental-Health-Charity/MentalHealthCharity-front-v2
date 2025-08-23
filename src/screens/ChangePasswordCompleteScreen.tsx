import LockIcon from "@mui/icons-material/Lock";
import { Box, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import IconWrapper from "../modules/shared/components/IconWrapper/style";
import handleApiError from "../modules/shared/helpers/handleApiError";
import ChangePasswordFormComplete from "../modules/users/components/ChangePasswordFormComplete";
import { changePasswordCompleteMutation } from "../modules/users/queries/changePasswordCompleteMutation";
import useTheme from "../theme";

const ChangePasswordCompleteScreen = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const theme = useTheme();

    const { mutate, isPending } = useMutation({
        mutationFn: changePasswordCompleteMutation,
        onSuccess: () => {
            navigate("/login");
            toast.success(t("change_password_complete.success_toast"));
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
                <Box sx={{ display: "flex", gap: 3, flexDirection: "column", mb: 1 }}>
                    <IconWrapper size={50} color={theme.palette.primary.main}>
                        <LockIcon />
                    </IconWrapper>
                    <Box>
                        <Typography component="h1" sx={{ lineHeight: "45px" }} variant="h4">
                            {t("change_password_form_complete.title")}
                        </Typography>
                        <Typography component="h2" sx={{ lineHeight: "35px", opacity: 0.75 }} variant="h6">
                            {t("change_password_form_complete.description")}
                        </Typography>
                    </Box>
                </Box>
                <ChangePasswordFormComplete isLoading={isPending} onSubmit={mutate} />
            </Box>
        </Box>
    );
};

export default ChangePasswordCompleteScreen;
