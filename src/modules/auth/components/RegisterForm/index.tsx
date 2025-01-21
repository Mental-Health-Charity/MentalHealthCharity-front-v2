import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    TextField,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { validation } from "../../../shared/constants";
import { LoginFormValues, RegisterFormValues } from "../../types";

interface Props {
    onSubmit: (values: RegisterFormValues) => void;
    initial?: LoginFormValues;
}

const RegisterForm = ({ onSubmit, initial }: Props) => {
    const { t } = useTranslation();

    const validationSchema = Yup.object({
        full_name: Yup.string().required(t("validation.required")),
        email: validation.email,
        password: validation.password,
        confirmPassword: validation.confirmPassword,
        policy_confirm: Yup.boolean().default(false).required(t("policy.confirm"))
        
    });

    const initialValues: RegisterFormValues = {
        email: "",
        password: "",
        confirmPassword: "",
        full_name: "",
        policy_confirm: false,
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
                    <FormControlLabel
                        style={{marginBottom: "20px"}}
                        control={<Checkbox />}
                        label={t("validation.policy_confirm")}
                        
                    />

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
