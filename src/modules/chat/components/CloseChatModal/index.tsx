import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "../../../shared/components/Modal";

interface Props {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const WAIT_TIME = 5_000;

const CloseChatModal = ({ onConfirm, open, onClose }: Props) => {
    const { t } = useTranslation();
    const [progress, setProgress] = useState(0);
    const [canConfirm, setCanConfirm] = useState(false);

    useEffect(() => {
        if (!open) return;
        setProgress(0);
        setCanConfirm(false);

        const start = Date.now();
        const timer = setInterval(() => {
            const elapsed = Date.now() - start;
            const percent = Math.min((elapsed / WAIT_TIME) * 100, 100);
            setProgress(percent);

            if (percent >= 100) {
                clearInterval(timer);
                setCanConfirm(true);
            }
        }, 100);

        return () => clearInterval(timer);
    }, [open]);

    return (
        <Modal open={open} onClose={onClose} title={t("chat.close_chat_confirmation")}>
            <div className="flex max-w-[500px] flex-col gap-6">
                <p className="opacity-70">{t("chat.close_chat_confirmation_text_1")}</p>

                <div>
                    <p className="font-semibold">{t("chat.close_chat_when_title")}</p>
                    <ul className="mt-2 list-disc space-y-1 pl-8 opacity-70">
                        <li>{t("chat.close_reasons.close_chat_reason_1")}</li>
                        <li>{t("chat.close_reasons.close_chat_reason_2")}</li>
                        <li>{t("chat.close_reasons.close_chat_reason_3")}</li>
                    </ul>
                </div>

                <div className="relative mt-4">
                    <div className="bg-muted mb-2 h-1 w-full overflow-hidden rounded-full">
                        <div
                            className="bg-primary h-full transition-[width] duration-100 ease-linear"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <Button
                        className="w-full font-semibold"
                        variant="destructive"
                        disabled={!canConfirm}
                        onClick={onConfirm}
                        style={{ opacity: canConfirm ? 1 : 0.6 }}
                    >
                        {canConfirm
                            ? t("chat.close_chat_button_confirm", "Zamknij czat")
                            : t("chat.close_chat_button_wait", "Poczekaj...")}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default CloseChatModal;
