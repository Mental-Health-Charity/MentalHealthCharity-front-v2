import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import Modal from "../../../shared/components/Modal";
import { parseApiDate } from "../../../shared/helpers/dateTime";
import formatDate from "../../../shared/helpers/formatDate";

interface Props {
    currentAutoCloseAt: string;
    extensionDays: number;
    isPending: boolean;
    onClose: () => void;
    onConfirm: () => void;
    open: boolean;
}

const SnoozeAutoCloseModal = ({ currentAutoCloseAt, extensionDays, isPending, onClose, onConfirm, open }: Props) => {
    const { t } = useTranslation();
    const currentDeadline = parseApiDate(currentAutoCloseAt);
    const extensionMs = extensionDays * 24 * 60 * 60 * 1000;
    const nextDeadline = new Date(Math.max(currentDeadline.getTime(), Date.now()) + extensionMs);

    return (
        <Modal open={open} onClose={onClose} title={t("chat.snooze_confirmation")}>
            <div className="flex max-w-[500px] flex-col gap-6">
                <p className="text-muted-foreground text-sm">
                    {t("chat.snooze_confirmation_description", { count: extensionDays })}
                </p>

                <div className="grid items-stretch gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                    <div className="border-border bg-muted/40 rounded-lg border p-4">
                        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                            {t("chat.snooze_current_deadline")}
                        </p>
                        <p className="text-foreground mt-1 font-semibold">{formatDate(currentDeadline)}</p>
                    </div>

                    <ArrowRight className="text-muted-foreground mx-auto size-5 rotate-90 sm:rotate-0" aria-hidden />

                    <div className="border-warning-brand/40 bg-warning-brand/10 rounded-lg border p-4">
                        <p className="text-warning-brand text-xs font-medium tracking-wide uppercase">
                            {t("chat.snooze_new_deadline")}
                        </p>
                        <p className="text-foreground mt-1 font-semibold">{formatDate(nextDeadline)}</p>
                    </div>
                </div>

                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <Button type="button" variant="outline" disabled={isPending} onClick={onClose}>
                        {t("common.cancel")}
                    </Button>
                    <Button type="button" disabled={isPending} onClick={onConfirm}>
                        {isPending ? t("chat.snooze_pending") : t("chat.snooze_confirm", { count: extensionDays })}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default SnoozeAutoCloseModal;
