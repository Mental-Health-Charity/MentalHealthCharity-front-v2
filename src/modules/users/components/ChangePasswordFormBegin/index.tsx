import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { validation } from "../../../shared/constants";
import { ChangePasswordBeginPayload } from "../../types";

interface Props {
    onSubmit: (values: ChangePasswordBeginPayload) => void | Promise<void>;
    isLoading?: boolean;
}

const ChangePasswordBeginFormBegin = ({ onSubmit, isLoading }: Props) => {
    const { t } = useTranslation();

    const formik = useFormik<ChangePasswordBeginPayload>({
        initialValues: { email: "" },
        validationSchema: Yup.object({ email: validation.email }),
        onSubmit,
    });

    return (
        <form onSubmit={formik.handleSubmit} noValidate className="flex w-full flex-col gap-4">
            <div className="space-y-1.5">
                <Label htmlFor="email">{t("form.email")}</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email && (
                    <p className="text-destructive text-sm">{formik.errors.email}</p>
                )}
            </div>
            <Button type="submit" disabled={isLoading}>
                {t("form.submit")}
            </Button>
        </form>
    );
};

export default ChangePasswordBeginFormBegin;
