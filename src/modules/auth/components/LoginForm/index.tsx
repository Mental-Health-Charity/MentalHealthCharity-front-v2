import {
  Box,
  TextField,
  Button,
  Link,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Formik, Field, Form } from "formik";
import { LoginFormValues } from "../../types";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";

interface Props {
  onSubmit: (values: LoginFormValues) => void;
  initial?: LoginFormValues;
}

const LoginForm = ({ onSubmit, initial }: Props) => {
  const { t } = useTranslation();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t("validation.invalid_email"))
      .required(t("validation.required")),
    password: Yup.string()
      .min(8, t("validation.incorrect_password_format"))
      .required(t("validation.required")),
  });

  const initialValues = {
    email: "",
    password: "",
    ...initial,
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, errors, touched }) => (
        <Form>
          <Box mb={2}>
            <Field
              as={TextField}
              name="email"
              type="email"
              label="Email"
              fullWidth
              variant="outlined"
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
            />
          </Box>

          <Box mb={1}>
            <Field
              as={TextField}
              name="password"
              type="password"
              label="Hasło"
              fullWidth
              variant="outlined"
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
            />
          </Box>

          <Box
            mb={1}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Zapamiętaj mnie"
            />
            <Link
              underline="none"
              sx={{ fontWeight: "bold" }}
              href="/auth/forget-password"
            >
              Przypomnij hasło
            </Link>
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isSubmitting}
          >
            Login
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;