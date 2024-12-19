import { useTranslation } from "react-i18next";
import Modal from "../../../shared/components/Modal";
import { Box, MenuItem, TextField, Button } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
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
        status: Yup.string().required(
            t("manage_articles.validation.status_required")
        ),
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
        <Modal
            modalContentProps={{
                sx: {
                    width: "100%",
                    maxWidth: "500px",
                },
            }}
            title={t("manage_articles.modal_title")}
            open={open}
            onClose={onClose}
        >
            <Box>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                    }) => (
                        <Form>
                            <Box display="flex" flexDirection="column" gap={2}>
                                <TextField
                                    select
                                    label={t("manage_articles.fields.status")}
                                    name="status"
                                    value={values.status}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={
                                        touched.status && Boolean(errors.status)
                                    }
                                    helperText={touched.status && errors.status}
                                >
                                    <MenuItem value={ArticleStatus.PUBLISHED}>
                                        {t("manage_articles.status.published")}
                                    </MenuItem>
                                    <MenuItem value={ArticleStatus.REJECTED}>
                                        {t("manage_articles.status.rejected")}
                                    </MenuItem>
                                </TextField>

                                {values.status === ArticleStatus.REJECTED && (
                                    <TextField
                                        label={t(
                                            "manage_articles.fields.reject_message"
                                        )}
                                        name="reject_message"
                                        value={values.reject_message}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        multiline
                                        rows={4}
                                        error={
                                            touched.reject_message &&
                                            Boolean(errors.reject_message)
                                        }
                                        helperText={
                                            touched.reject_message &&
                                            errors.reject_message
                                        }
                                    />
                                )}

                                <Button type="submit" variant="contained">
                                    {t("common.submit")}
                                </Button>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Modal>
    );
};

export default ManageArticleModal;
