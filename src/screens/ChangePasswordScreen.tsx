import { Button } from "@/components/ui/button";
import IconWrapper from "@/modules/shared/components/IconWrapper";
import { useMutation } from "@tanstack/react-query";
import { Lock } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import EmailIcon from "../assets/static/email_icon.svg";
import handleApiError from "../modules/shared/helpers/handleApiError";
import ChangePasswordBeginFormBegin from "../modules/users/components/ChangePasswordFormBegin";
import { changePasswordBegin } from "../modules/users/queries/changePasswordBeginMutation";

const ChangePasswordScreen = () => {
    const [isCodeSent, setIsCodeSent] = useState(false);
    const { t } = useTranslation();

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
        <div className="flex min-h-[90vh] flex-col items-center justify-center gap-10 px-5 py-20">
            <div className="w-full max-w-[800px]">
                {!isCodeSent && (
                    <>
                        <div className="mb-6 flex flex-col gap-6">
                            <IconWrapper size={50} color="#00D8BD">
                                <Lock />
                            </IconWrapper>
                            <div>
                                <h1 className="text-3xl leading-[45px]">{t("change_password_screen.title")}</h1>
                                <h2 className="text-lg leading-[35px] opacity-75">
                                    {t("change_password_screen.description")}
                                </h2>
                            </div>
                        </div>
                        <ChangePasswordBeginFormBegin isLoading={isPending} onSubmit={beginMutation} />
                    </>
                )}
                {isCodeSent && (
                    <div className="flex min-h-[90vh] flex-col items-center justify-center gap-10 px-5 py-20">
                        <img src={EmailIcon} alt="Email Icon" width={200} height={200} />
                        <div className="flex max-w-[600px] flex-col gap-4">
                            <h1 className="text-center text-3xl">{t("change_password_screen.email_sent_title")}</h1>
                            <p className="text-center opacity-75">
                                {t("change_password_screen.email_sent_description")}
                            </p>
                        </div>
                        <div className="border-border border-t pt-10 opacity-75">
                            <p>
                                {t("change_password_screen.footer")}{" "}
                                <Button variant="link" onClick={() => setIsCodeSent(false)}>
                                    {t("common.try_again")}
                                </Button>
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChangePasswordScreen;
