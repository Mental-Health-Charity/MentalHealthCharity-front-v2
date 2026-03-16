import IconWrapper from "@/modules/shared/components/IconWrapper";
import { useMutation } from "@tanstack/react-query";
import { Lock } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import handleApiError from "../modules/shared/helpers/handleApiError";
import ChangePasswordFormComplete from "../modules/users/components/ChangePasswordFormComplete";
import { changePasswordCompleteMutation } from "../modules/users/queries/changePasswordCompleteMutation";

const ChangePasswordCompleteScreen = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

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
        <div className="flex min-h-[90vh] flex-col items-center justify-center gap-10 px-5 py-20">
            <div className="w-full max-w-[800px]">
                <div className="mb-2 flex flex-col gap-6">
                    <IconWrapper size={50} color="#00D8BD">
                        <Lock />
                    </IconWrapper>
                    <div>
                        <h1 className="text-3xl leading-[45px]">{t("change_password_form_complete.title")}</h1>
                        <h2 className="text-lg leading-[35px] opacity-75">
                            {t("change_password_form_complete.description")}
                        </h2>
                    </div>
                </div>
                <ChangePasswordFormComplete isLoading={isPending} onSubmit={mutate} />
            </div>
        </div>
    );
};

export default ChangePasswordCompleteScreen;
