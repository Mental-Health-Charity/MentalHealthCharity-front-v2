import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getFormByIdQueryOptions } from "../../queries/getFormsQueryOptions";
import { FormResponse, MenteeForm, VolunteerForm } from "../../types";
import FormTableItem from "../FormTableItem";

interface Props {
    form?: FormResponse<MenteeForm | VolunteerForm> | null;
    formId: number | null;
    open: boolean;
    onClose: () => void;
}

const MenteeFormPreviewModal = ({ form, formId, open, onClose }: Props) => {
    const { t } = useTranslation();
    const formQuery = useQuery({
        ...getFormByIdQueryOptions({ id: formId ?? 0 }),
        enabled: open && !form && Boolean(formId),
    });
    const previewForm = form ?? formQuery.data;

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-5xl">
                <DialogHeader className="pr-10">
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="text-primary-brand size-5" />
                        {t("matching.form_preview_title", { defaultValue: "Formularz zgłoszenia" })}
                    </DialogTitle>
                    <DialogDescription>
                        {t("matching.form_preview_description", {
                            defaultValue: "Podgląd formularza powiązanego z osobą w kryzysie.",
                        })}
                    </DialogDescription>
                </DialogHeader>

                {formQuery.isLoading && !previewForm && (
                    <div className="flex flex-col gap-3">
                        {Array.from({ length: 5 }, (_, idx) => (
                            <Skeleton key={idx} className="h-16 w-full" />
                        ))}
                    </div>
                )}

                {formQuery.isError && (
                    <div className="border-destructive/30 bg-destructive/10 text-destructive rounded-lg border p-4 text-sm">
                        {t("matching.form_preview_error", {
                            defaultValue: "Nie udało się pobrać formularza.",
                        })}
                    </div>
                )}

                {previewForm && <FormTableItem form={previewForm} className="max-w-full" />}
            </DialogContent>
        </Dialog>
    );
};

export default MenteeFormPreviewModal;
