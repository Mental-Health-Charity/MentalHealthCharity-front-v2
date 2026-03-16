import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import Modal from "../../../shared/components/Modal";
import { downloadFile } from "../../../shared/helpers/downloadFile";

interface Props {
    open: boolean;
    onClose: () => void;
    token: string;
}

const ResetTokenModal = ({ token, ...props }: Props) => {
    const { t } = useTranslation();

    const handleCopy = () => {
        navigator.clipboard.writeText(token);
        toast.success(t("auth.reset_token_modal.copied"));
        props.onClose();
    };

    const handleDownload = () => {
        downloadFile(token, "reset_token.txt", "text/plain");
        toast.success(t("auth.reset_token_modal.downloaded"));
        props.onClose();
    };

    return (
        <Modal {...props} title={t("auth.reset_token_modal.title")}>
            <div className="max-w-[600px]">
                <p className="text-xl">{t("auth.reset_token_modal.subtitle")}</p>
                <div className="mt-5 flex flex-col gap-2.5">
                    <Button onClick={handleDownload} className="w-full">
                        {t("auth.reset_token_modal.download")}
                    </Button>
                    <Button onClick={handleCopy} variant="outline" className="w-full">
                        {t("auth.reset_token_modal.copy")}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ResetTokenModal;
