import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import Modal from "../../../shared/components/Modal";
import { ArticleStatus } from "../../constants";
import { UpdateStatusFormValues } from "../../types";

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: UpdateStatusFormValues) => void;
}

const ManageArticleModal = ({ onClose, open, onSubmit }: Props) => {
    const { t } = useTranslation();

    const validationSchema = Yup.object({
        status: Yup.string().required(t("manage_articles.validation.status_required")),
        reject_message: Yup.string().when("status", (status: unknown) => {
            if (status === ArticleStatus.REJECTED) {
                return Yup.string();
            }
            return Yup.string();
        }),
    });

    const initialValues = {
        status: ArticleStatus.REJECTED,
        reject_message: "",
    };

    return (
        <Modal className="sm:max-w-[500px]" title={t("manage_articles.modal_title")} open={open} onClose={onClose}>
            <div>
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                    {({ values, errors, touched, handleChange, handleBlur }) => (
                        <Form>
                            <div className="flex flex-col gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="status">{t("manage_articles.fields.status")}</Label>
                                    <select
                                        id="status"
                                        name="status"
                                        value={values.status}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-8 w-full rounded-lg border bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:ring-3"
                                    >
                                        <option value={ArticleStatus.PUBLISHED}>
                                            {t("manage_articles.status.published")}
                                        </option>
                                        <option value={ArticleStatus.REJECTED}>
                                            {t("manage_articles.status.rejected")}
                                        </option>
                                    </select>
                                    {touched.status && errors.status && (
                                        <p className="text-destructive text-sm">{errors.status}</p>
                                    )}
                                </div>

                                {values.status === ArticleStatus.REJECTED && (
                                    <div className="space-y-1.5">
                                        <Label htmlFor="reject_message">
                                            {t("manage_articles.fields.reject_message")}
                                        </Label>
                                        <textarea
                                            id="reject_message"
                                            name="reject_message"
                                            value={values.reject_message}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            rows={4}
                                            className="border-input focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-3"
                                        />
                                        {touched.reject_message && errors.reject_message && (
                                            <p className="text-destructive text-sm">{errors.reject_message}</p>
                                        )}
                                    </div>
                                )}

                                <Button type="submit">{t("common.submit")}</Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
};

export default ManageArticleModal;
