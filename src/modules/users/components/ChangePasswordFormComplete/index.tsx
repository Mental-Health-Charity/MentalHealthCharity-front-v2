import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import * as Yup from "yup";
import { validation } from "../../../shared/constants";

export interface ChangePasswordCompletePayload {
    token: string;
    new_password: string;
}

interface Props {
    onSubmit: (values: ChangePasswordCompletePayload) => void | Promise<void>;
    isLoading?: boolean;
}

interface FormValues {
    password: string;
    confirm_password: string;
    token: string;
}

const ChangePasswordFormComplete = ({ onSubmit, isLoading }: Props) => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const formik = useFormik<FormValues>({
        initialValues: {
            token: token || "",
            password: "",
            confirm_password: "",
        },
        validationSchema: Yup.object({
            token: Yup.string().required(t("validation.required")),
            password: validation.password,
            confirm_password: validation.confirmPassword,
        }),
        onSubmit: (values) => {
            const { token, password } = values;
            return onSubmit({ token, new_password: password });
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} noValidate className="flex w-full flex-col gap-4">
            {!token && (
                <div className="space-y-1.5">
                    <Label htmlFor="token">{t("form.token")}</Label>
                    <Input
                        id="token"
                        name="token"
                        value={formik.values.token}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.token && formik.errors.token && (
                        <p className="text-destructive text-sm">{formik.errors.token}</p>
                    )}
                </div>
            )}

            <div className="space-y-1.5">
                <Label htmlFor="password">{t("change_password_form_complete.new_password")}</Label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.password && formik.errors.password && (
                    <p className="text-destructive text-sm">{formik.errors.password}</p>
                )}
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="confirm_password">{t("common.password_confirmation")}</Label>
                <Input
                    id="confirm_password"
                    name="confirm_password"
                    type="password"
                    value={formik.values.confirm_password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.confirm_password && formik.errors.confirm_password && (
                    <p className="text-destructive text-sm">{formik.errors.confirm_password}</p>
                )}
            </div>

            <Button type="submit" disabled={isLoading}>
                {t("form.submit")}
            </Button>
        </form>
    );
};

export default ChangePasswordFormComplete;
