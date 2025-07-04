import { Button, TextField, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { Field, Form, Formik } from "formik";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import BgImage from "../assets/static/admin_panel_bg.svg";
import { resetPasswordMutation } from "../modules/auth/queries/resetPasswordMutation";
import { ResetPasswordPayload } from "../modules/auth/types";
import Card from "../modules/shared/components/Card";
import Container from "../modules/shared/components/Container";
import { validation } from "../modules/shared/constants";

const ForgetPasswordScreen = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { mutate } = useMutation({
        mutationFn: resetPasswordMutation,
        onSuccess() {
            toast.success(t("auth.reset_password.success"));
            navigate("/login");
        },
    });

    const validationSchema = Yup.object({
        email: validation.email,
        token: validation.token,
        new_password: validation.password,
    });

    const handleSubmit = (values: ResetPasswordPayload) => {
        mutate(values);
    };

    return (
        <Container
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundImage: `url(${BgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <Card>
                <Typography variant="h5" gutterBottom>
                    {t("auth.reset_password.title")}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {t("auth.reset_password.subtitle")}
                </Typography>
                <Formik<ResetPasswordPayload>
                    initialValues={{
                        email: "",
                        token: "",
                        new_password: "",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, errors, touched, handleChange, handleBlur }) => (
                        <Form>
                            <Field
                                name="email"
                                as={TextField}
                                label="Adres e-mail"
                                fullWidth
                                margin="normal"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.email && Boolean(errors.email)}
                                helperText={touched.email && errors.email}
                            />
                            <Field
                                name="token"
                                as={TextField}
                                label="Kod odzyskiwania"
                                fullWidth
                                margin="normal"
                                value={values.token}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.token && Boolean(errors.token)}
                                helperText={touched.token && errors.token}
                            />
                            <Field
                                name="new_password"
                                as={TextField}
                                label="Nowe hasło"
                                type="password"
                                fullWidth
                                margin="normal"
                                value={values.new_password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.new_password && Boolean(errors.new_password)}
                                helperText={touched.new_password && errors.new_password}
                            />
                            <Button type="submit" fullWidth variant="contained" color="primary" sx={{ marginTop: 2 }}>
                                Zresetuj hasło
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Card>
        </Container>
    );
};

export default ForgetPasswordScreen;
