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
            <div className="flex min-h-screen w-full max-w-[600px] flex-col items-center justify-center gap-4">
                <h1 className="text-center text-3xl">{t("confirm_email_complete.error_title")}</h1>
                <p className="text-center opacity-75">{t("confirm_email_complete.error_description")}</p>
            </div>
        );
    }

    return <Loader text={t("confirm_email_complete.loading_text")} title={t("confirm_email_complete.loading_title")} />;
};

export default ConfirmEmailCompleteScreen;
