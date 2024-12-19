import {
    Box,
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
} from "@mui/material";
import { Formik, Field, Form } from "formik";
import { LoginFormValues, RegisterFormValues } from "../../types";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";

interface Props {
    onSubmit: (values: RegisterFormValues) => void;
    initial?: LoginFormValues;
}

const RegisterForm = ({ onSubmit, initial }: Props) => {
    const { t } = useTranslation();

    const validationSchema = Yup.object({
        full_name: Yup.string().required(t("validation.required")),
        email: Yup.string()
            .email(t("validation.invalid_email"))
            .required(t("validation.required")),
        password: Yup.string()
            .min(8, t("validation.incorrect_password_format"))
            .matches(/[A-Z]/, t("validation.min_one_uppercase"))
            .required(t("validation.required")),
        confirmPassword: Yup.string()
            .oneOf(
                [Yup.ref("password"), undefined],
                t("validation.passwords_must_match")
            )
            .required(t("validation.required")),
    });

    const initialValues: RegisterFormValues = {
        email: "",
        password: "",
        confirmPassword: "",
        full_name: "",
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
                            name="full_name"
                            type="text"
                            label="Imie lub ksywka"
                            fullWidth
                            variant="outlined"
                            error={touched.email && Boolean(errors.email)}
                            helperText={touched.email && errors.email}
                        />
                    </Box>
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

                    <Box mb={1}>
                        <Field
                            as={TextField}
                            name="confirmPassword"
                            type="password"
                            label="Potwierdź Hasło"
                            fullWidth
                            variant="outlined"
                            error={
                                touched.confirmPassword &&
                                Boolean(errors.confirmPassword)
                            }
                            helperText={
                                touched.confirmPassword &&
                                errors.confirmPassword
                            }
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
                    </Box>

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={isSubmitting}
                    >
                        Zarejestruj
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default RegisterForm;
