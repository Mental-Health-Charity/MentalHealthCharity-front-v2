import { Button } from "@/components/ui/button";
import { Clock, MessageSquareOff, MessageSquareText } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "../../../shared/components/Modal";

const STORAGE_KEY = "chat_info_dismissed_at";
const REMINDER_INTERVAL_MS = 14 * 24 * 60 * 60 * 1000; // 2 weeks

const shouldShowModal = (): boolean => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return true;
    const dismissedAt = Number(raw);
    return Date.now() - dismissedAt >= REMINDER_INTERVAL_MS;
};

const ChatInfoModal = () => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(shouldShowModal());
    }, []);

    const handleClose = () => {
        localStorage.setItem(STORAGE_KEY, String(Date.now()));
        setOpen(false);
    };

    return (
        <Modal open={open} onClose={handleClose} title={t("chat.info_modal.title")}>
            <div className="flex max-w-[480px] flex-col gap-5">
                <div className="flex items-center gap-2.5">
                    <Clock className="text-info-brand mt-0.5 size-4 shrink-0" />
                    <p className="text-muted-foreground text-sm">{t("chat.info_modal.intro")}</p>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="border-border bg-muted/40 flex items-start gap-3 rounded-xl border p-4">
                        <MessageSquareText className="text-primary-brand mt-0.5 size-5 shrink-0" />
                        <div>
                            <p className="text-foreground text-sm font-semibold">
                                {t("chat.info_modal.with_messages_title")}
                            </p>
                            <p className="text-muted-foreground mt-0.5 text-sm">
                                {t("chat.info_modal.with_messages_body")}
                            </p>
                        </div>
                    </div>

                    <div className="border-border bg-muted/40 flex items-start gap-3 rounded-xl border p-4">
                        <MessageSquareOff className="text-warning-brand mt-0.5 size-5 shrink-0" />
                        <div>
                            <p className="text-foreground text-sm font-semibold">
                                {t("chat.info_modal.no_messages_title")}
                            </p>
                            <p className="text-muted-foreground mt-0.5 text-sm">
                                {t("chat.info_modal.no_messages_body")}
                            </p>
                        </div>
                    </div>
                </div>

                <Button className="mt-1 w-full" onClick={handleClose}>
                    {t("chat.info_modal.dismiss")}
                </Button>
            </div>
        </Modal>
    );
};

export default ChatInfoModal;
