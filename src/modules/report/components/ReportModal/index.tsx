import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import Modal from "../../../shared/components/Modal";
import readError from "../../../shared/helpers/readError";
import { ReportTranslationKeys } from "../../constants";
import createReportMutationOptions from "../../queries/createReportMutationOptions";
import { ReportPayload, ReportType } from "../../types";

interface Props {
    onClose: () => void;
    open: boolean;
}

const ReportModal = ({ open, onClose }: Props) => {
    const { t } = useTranslation();

    const validationSchema = Yup.object({
        report_type: Yup.string().required(t("validation.required")),
        subject: Yup.string().required(t("validation.required")),
        description: Yup.string().required(t("validation.required")),
    });

    const { mutate } = useMutation({
        mutationFn: createReportMutationOptions,
        onError: (error) => {
            toast.error(readError(error));
        },
        onSuccess: () => {
            toast.success(t("common.success"));
        },
    });

    return (
        <Modal title={t("report.modal_title")} onClose={onClose} open={open} className="sm:max-w-lg">
            <div>
                <Formik
                    initialValues={{
                        report_type: "",
                        subject: "",
                        description: "",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        mutate(values as ReportPayload);
                        setSubmitting(false);
                        onClose();
                    }}
                >
                    {({ values, handleChange, handleBlur, handleSubmit, touched, errors }) => (
                        <Form onSubmit={handleSubmit}>
                            <div className="mb-4 space-y-1.5">
                                <Label htmlFor="report_type">{t("report.select_report_type")}</Label>
                                <select
                                    id="report_type"
                                    name="report_type"
                                    value={values.report_type}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-8 w-full rounded-lg border bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:ring-3"
                                >
                                    <option value="" disabled>
                                        {t("report.select_report_type")}
                                    </option>
                                    {Object.values(ReportType).map((type) => (
                                        <option key={type} value={type}>
                                            {t(ReportTranslationKeys[type])}
                                        </option>
                                    ))}
                                </select>
                                {touched.report_type && errors.report_type && (
                                    <p className="text-destructive text-sm">{errors.report_type}</p>
                                )}
                            </div>

                            <div className="mb-4 space-y-1.5">
                                <Label htmlFor="subject">{t("report.subject")}</Label>
                                <Input
                                    id="subject"
                                    name="subject"
                                    value={values.subject}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {touched.subject && errors.subject && (
                                    <p className="text-destructive text-sm">{errors.subject}</p>
                                )}
                            </div>

                            <div className="mb-4 space-y-1.5">
                                <Label htmlFor="description">{t("report.description")}</Label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={values.description}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    rows={4}
                                    className="border-input focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-3"
                                />
                                {touched.description && errors.description && (
                                    <p className="text-destructive text-sm">{errors.description}</p>
                                )}
                            </div>

                            <div className="text-right">
                                <Button type="submit" className="px-5 py-1.5">
                                    {t("common.submit")}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
};

export default ReportModal;
