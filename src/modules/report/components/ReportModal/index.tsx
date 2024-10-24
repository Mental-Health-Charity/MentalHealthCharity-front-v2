import { useTranslation } from "react-i18next";
import Modal from "../../../shared/components/Modal";
import { Box, Select, TextField, MenuItem, Button } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup"; // Można dodać walidację
import { ReportPayload, ReportType } from "../../types";
import { ReportTranslationKeys } from "../../constants";
import { useMutation } from "@tanstack/react-query";
import createReportMutationOptions from "../../queries/createReportMutationOptions";
import toast from "react-hot-toast";
import readError from "../../../shared/helpers/readError";

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
    <Modal title={t("report.modal_title")} onClose={onClose} open={open}>
      <Box
        sx={{
          width: 500,
        }}
      >
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
          {({
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            touched,
            errors,
          }) => (
            <Form onSubmit={handleSubmit}>
              <Box mb={2}>
                <Field
                  as={Select}
                  name="report_type"
                  value={values.report_type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  displayEmpty
                  error={touched.report_type && Boolean(errors.report_type)}
                  helperText={touched.report_type && errors.report_type}
                >
                  <MenuItem value="" disabled>
                    {t("report.select_report_type")}
                  </MenuItem>
                  {Object.values(ReportType).map((type) => (
                    <MenuItem key={type} value={type}>
                      {t(ReportTranslationKeys[type])}
                    </MenuItem>
                  ))}
                </Field>
              </Box>

              <Box mb={2}>
                <Field
                  as={TextField}
                  name="subject"
                  label={t("report.subject")}
                  value={values.subject}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  error={touched.subject && Boolean(errors.subject)}
                  helperText={touched.subject && errors.subject}
                />
              </Box>

              <Box mb={2}>
                <Field
                  as={TextField}
                  name="description"
                  label={t("report.description")}
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  multiline
                  rows={4}
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                />
              </Box>

              <Box textAlign="right">
                <Button
                  type="submit"
                  sx={{
                    padding: "6px 20px",
                  }}
                  variant="contained"
                  color="primary"
                >
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

export default ReportModal;
