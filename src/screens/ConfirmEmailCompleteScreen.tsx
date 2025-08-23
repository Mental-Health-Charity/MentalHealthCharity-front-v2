import { Box, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Loader from "../modules/shared/components/Loader";
import { confirmEmailCompleteQueryOptions } from "../modules/users/queries/confirmEmailCompleteQueryOptions";

const ConfirmEmailCompleteScreen = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const { isSuccess, isError } = useQuery(
        confirmEmailCompleteQueryOptions({
            token: token || "",
        })
    );

    if (isSuccess) {
        navigate("/login");
    }

    if (isError) {
        return (
            <Box maxWidth={600} gap={2} display="flex" flexDirection="column">
                <Typography textAlign="center" component="h1" variant="h4">
                    {t("confirm_email_complete.error_title")}
                </Typography>
                <Typography
                    sx={{
                        opacity: 0.75,
                    }}
                    textAlign="center"
                    component="h2"
                    variant="body1"
                >
                    {t("confirm_email_complete.error_description")}
                </Typography>
            </Box>
        );
    }

    return <Loader text={t("confirm_email_complete.loading_text")} title={t("confirm_email_complete.loading_title")} />;
};

export default ConfirmEmailCompleteScreen;
