import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { LoginFormValues } from "../../types";

interface Props {
    onSubmit: (values: LoginFormValues) => void;
    disabled?: boolean;
    initial?: LoginFormValues;
}

const LoginForm = ({ onSubmit, initial, disabled }: Props) => {
    const { t } = useTranslation();

    const validationSchema = Yup.object({
        email: Yup.string().email(t("validation.invalid_email")).required(t("validation.required")),
        password: Yup.string().min(8, t("validation.incorrect_password_format")).required(t("validation.required")),
    });

    const initialValues = {
        email: "",
        password: "",
        ...initial,
    };

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ errors, touched, handleChange, handleBlur, values }) => (
                <Form className="flex flex-col gap-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        {touched.email && errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="password">Hasło</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        {touched.password && errors.password && (
                            <p className="text-destructive text-sm">{errors.password}</p>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Checkbox id="remember" defaultChecked />
                            <Label htmlFor="remember" className="cursor-pointer text-sm">
                                Zapamiętaj mnie
                            </Label>
                        </div>
                        <Link
                            to="/auth/forget-password"
                            className="text-primary-brand text-sm font-medium no-underline hover:underline"
                        >
                            Przypomnij hasło
                        </Link>
                    </div>

                    <Button type="submit" className="w-full" disabled={disabled}>
                        Zaloguj
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default LoginForm;
