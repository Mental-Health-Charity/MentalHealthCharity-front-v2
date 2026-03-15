import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowRightCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import Modal from "../../../shared/components/Modal";
import formatDate from "../../../shared/helpers/formatDate";
import { ReportTranslationKeys } from "../../constants";
import changeStatusMutationOptions from "../../queries/changeStatusMutationOptions";
import { getReportsQueryOptions } from "../../queries/getReportsQueryOptions";
import { Report } from "../../types";

interface Props {
    report: Report;
}

const ReportCard = ({ report }: Props) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const { refetch } = useQuery(
        getReportsQueryOptions({
            page: 1,
            size: 100,
            is_considered: false,
        })
    );
    const { mutate } = useMutation({
        mutationFn: changeStatusMutationOptions,
        onMutate: () => {
            setLoading(true);
        },
        onSuccess: () => {
            refetch();
            setLoading(false);
            setShowConfirmationModal(false);
        },
        onError: () => {
            toast.error(t("common.error"));
        },
    });

    return (
        <>
            <div className="bg-paper rounded-[10px] border-2 border-black/10 px-5 pb-5 shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-5 py-4">
                    <div className="max-w-[800px] flex-grow">
                        <h6 className="text-dark font-bold">{report.subject}</h6>
                        <p className="text-dark text-sm break-words">{report.description}</p>
                    </div>

                    <div className="flex min-w-[200px] flex-col">
                        <p className="text-dark text-sm">{formatDate(report.creation_date)}</p>
                        <p className="text-dark text-xs">Autor: {report.created_by.full_name}</p>
                        <p className="text-dark text-xs">Email: {report.created_by.email}</p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                    <div className="flex gap-2.5 max-md:w-full md:ml-[15px]">
                        <Button
                            className="w-full gap-2.5 px-5 py-[5px] text-base"
                            onClick={() => setShowConfirmationModal(true)}
                        >
                            Rozstrzygnij
                            <ArrowRightCircle className="size-5" />
                        </Button>
                    </div>
                    <Badge variant="destructive" className="gap-2.5 px-3 py-1">
                        <AlertCircle className="size-4" />
                        {t(ReportTranslationKeys[report.report_type])}
                    </Badge>
                </div>
            </div>
            <Modal
                title={t("report.confirmation_modal_title")}
                open={showConfirmationModal}
                onClose={() => setShowConfirmationModal(false)}
            >
                <div className="flex flex-col gap-5">
                    <p className="max-w-[700px]">{t("report.confirmation_modal_text")}</p>
                    {loading && <p>{t("common.loading")}</p>}
                    <div className="flex gap-5">
                        <Button
                            onClick={() =>
                                mutate({
                                    user_report_id: report.id,
                                })
                            }
                        >
                            {t("common.confirm")}
                        </Button>
                        <Button variant="outline">{t("common.cancel")}</Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ReportCard;
