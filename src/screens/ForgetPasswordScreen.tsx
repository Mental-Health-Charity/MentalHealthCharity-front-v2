import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { Form, Formik } from "formik";
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
            className="flex items-center justify-center"
            style={{
                backgroundImage: `url(${BgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <Card>
                <h2 className="mb-2 text-xl font-semibold">{t("auth.reset_password.title")}</h2>
                <p className="mb-4">{t("auth.reset_password.subtitle")}</p>
                <Formik<ResetPasswordPayload>
                    initialValues={{ email: "", token: "", new_password: "" }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, errors, touched, handleChange, handleBlur }) => (
                        <Form className="flex flex-col gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="email">Adres e-mail</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {touched.email && errors.email && (
                                    <p className="text-destructive text-sm">{errors.email}</p>
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="token">Kod odzyskiwania</Label>
                                <Input
                                    id="token"
                                    name="token"
                                    value={values.token}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {touched.token && errors.token && (
                                    <p className="text-destructive text-sm">{errors.token}</p>
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="new_password">Nowe hasło</Label>
                                <Input
                                    id="new_password"
                                    name="new_password"
                                    type="password"
                                    value={values.new_password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {touched.new_password && errors.new_password && (
                                    <p className="text-destructive text-sm">{errors.new_password}</p>
                                )}
                            </div>
                            <Button type="submit" className="mt-2 w-full">
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
