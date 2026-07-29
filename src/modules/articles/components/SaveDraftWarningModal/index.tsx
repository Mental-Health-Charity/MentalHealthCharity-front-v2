import { Button } from "@/components/ui/button";
import { AlertTriangle, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "../../../shared/components/Modal";
import { ArticleStatus, translatedAdminArticleStatus } from "../../constants";

interface Props {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    currentStatus: ArticleStatus;
}

// Short delay before the confirm button unlocks, so the warning is actually read.
const COUNTDOWN_SECONDS = 5;

const SaveDraftWarningModal = ({ open, onClose, onConfirm, currentStatus }: Props) => {
    const { t } = useTranslation();
    const [remaining, setRemaining] = useState(COUNTDOWN_SECONDS);
    const isPublished = currentStatus === ArticleStatus.PUBLISHED;

    useEffect(() => {
        if (!open) return;
        setRemaining(COUNTDOWN_SECONDS);
        const interval = setInterval(() => {
            setRemaining((value) => (value <= 1 ? 0 : value - 1));
        }, 1000);
        return () => clearInterval(interval);
    }, [open]);

    const canConfirm = remaining === 0;

    return (
        <Modal className="sm:max-w-lg" title={t("articles.save_draft_warning.title")} open={open} onClose={onClose}>
            <div className="space-y-4">
                <p className="text-sm">
                    {t("articles.save_draft_warning.status_change", {
                        from: translatedAdminArticleStatus[currentStatus],
                        to: translatedAdminArticleStatus[ArticleStatus.DRAFT],
                    })}
                </p>

                {isPublished && (
                    <div className="border-destructive/40 bg-destructive/5 flex gap-3 rounded-lg border p-3">
                        <AlertTriangle className="text-destructive mt-0.5 size-5 shrink-0" />
                        <p className="text-destructive text-sm">{t("articles.save_draft_warning.published_warning")}</p>
                    </div>
                )}

                <div className="border-primary/30 bg-primary/5 flex gap-3 rounded-lg border p-3">
                    <Info className="text-primary mt-0.5 size-5 shrink-0" />
                    <p className="text-sm">{t("articles.save_draft_warning.autosave_hint")}</p>
                </div>

                <div className="flex flex-wrap justify-end gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={onClose}>
                        {t("articles.save_draft_warning.cancel")}
                    </Button>
                    <Button
                        type="button"
                        variant={isPublished ? "destructive" : "default"}
                        disabled={!canConfirm}
                        onClick={onConfirm}
                    >
                        {canConfirm
                            ? t("articles.save_draft_warning.confirm")
                            : `${t("articles.save_draft_warning.confirm")} (${remaining})`}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default SaveDraftWarningModal;
