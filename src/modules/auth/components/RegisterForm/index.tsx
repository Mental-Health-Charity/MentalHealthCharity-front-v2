import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field, Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import InternalLink from "../../../shared/components/InternalLink";
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
        policy_confirm: Yup.boolean().oneOf([true], t("validation.required")).required(t("validation.required")),
    });

    const initialValues: RegisterFormValues = {
        email: "",
        password: "",
        confirmPassword: "",
        policy_confirm: false,
        full_name: "",
        ...initial,
    };

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ isSubmitting, errors, touched, handleChange, handleBlur, values, setFieldValue }) => (
                <Form className="flex flex-col gap-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="full_name">Imię lub ksywka</Label>
                        <Input
                            id="full_name"
                            name="full_name"
                            type="text"
                            value={values.full_name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        {touched.full_name && errors.full_name && (
                            <p className="text-destructive text-sm">{errors.full_name}</p>
                        )}
                    </div>

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

                    <div className="space-y-1.5">
                        <Label htmlFor="confirmPassword">Potwierdź hasło</Label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={values.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        {touched.confirmPassword && errors.confirmPassword && (
                            <p className="text-destructive text-sm">{errors.confirmPassword}</p>
                        )}
                    </div>

                    <div className="flex flex-col items-start gap-3">
                        <div className="flex items-center gap-2">
                            <Checkbox id="remember" defaultChecked />
                            <Label htmlFor="remember" className="cursor-pointer text-sm">
                                Zapamiętaj mnie
                            </Label>
                        </div>
                        <div className="flex items-start gap-2">
                            <Field name="policy_confirm">
                                {({ field }: { field: { value: boolean } }) => (
                                    <Checkbox
                                        id="policy_confirm"
                                        checked={field.value}
                                        onCheckedChange={(checked) => setFieldValue("policy_confirm", checked)}
                                    />
                                )}
                            </Field>
                            <Label
                                htmlFor="policy_confirm"
                                className="inline cursor-pointer text-sm leading-relaxed font-normal"
                            >
                                Rejestrując się, akceptuję{" "}
                                <InternalLink to="/tos">warunki użytkowania i politykę prywatności</InternalLink>
                            </Label>
                        </div>
                        {errors.policy_confirm && touched.policy_confirm && (
                            <p className="text-destructive text-sm">{errors.policy_confirm}</p>
                        )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        Zarejestruj
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default RegisterForm;
