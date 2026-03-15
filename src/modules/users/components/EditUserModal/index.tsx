import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, Formik } from "formik";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { User } from "../../../auth/types";
import DataComparison from "../../../shared/components/CompareChanges";
import Modal from "../../../shared/components/Modal";
import { Roles, translatedRoles } from "../../constants";
import { EditUserFormValues } from "../../types";

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: EditUserFormValues) => void;
    user: User;
}

const EditUserModal = ({ onClose, open, user, onSubmit }: Props) => {
    const { t } = useTranslation();
    const [step, setStep] = useState(0);

    const validationSchema = Yup.object({
        full_name: Yup.string(),
        user_role: Yup.string()
            .oneOf(Object.values(Roles), t("users.validation.invalid_role"))
            .required(t("validation.required")),
    });

    const initialValues = {
        full_name: user.full_name || "",
        user_role: user.user_role || Roles.USER,
    };

    const handleSubmit = (values: EditUserFormValues) => {
        if (step === 0) {
            setStep(1);
        } else {
            onSubmit(values);
            onClose();
        }
    };

    return (
        <Modal
            onClose={onClose}
            open={open}
            title={step === 0 ? t("users.edit_modal_title") : t("common.compare_changes.title")}
            className="sm:max-w-[500px]"
        >
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ values, errors, touched, handleChange, handleBlur, dirty }) => (
                    <Form className="flex flex-col gap-4">
                        {step === 0 && (
                            <>
                                <div className="space-y-1.5">
                                    <Label>{t("users.id")}</Label>
                                    <Input disabled value={user.id} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="full_name">{t("users.full_name")}</Label>
                                    <Input
                                        id="full_name"
                                        name="full_name"
                                        value={values.full_name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {touched.full_name && errors.full_name && (
                                        <p className="text-destructive text-sm">{errors.full_name}</p>
                                    )}
                                </div>
                                {values.full_name === "" && (
                                    <div className="bg-warning-brand/20 flex items-center gap-4 rounded-lg p-4">
                                        <AlertTriangle className="text-muted-foreground size-5" />
                                        <p className="text-muted-foreground">{t("users.empty_full_name_warning")}</p>
                                    </div>
                                )}
                                <div className="space-y-1.5">
                                    <Label htmlFor="user_role">{t("users.role")}</Label>
                                    <select
                                        id="user_role"
                                        name="user_role"
                                        value={values.user_role}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
                                    >
                                        {Object.values(Roles).map((role) => (
                                            <option key={role} value={role}>
                                                {translatedRoles[role]}
                                            </option>
                                        ))}
                                    </select>
                                    {touched.user_role && errors.user_role && (
                                        <p className="text-destructive text-sm">{errors.user_role}</p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <Label>{t("users.email")}</Label>
                                    <Input disabled value={user.email} />
                                </div>
                            </>
                        )}
                        {step === 1 && <DataComparison dataA={initialValues} dataB={values} />}

                        <Button type="submit" className="w-full" size="sm" disabled={!dirty}>
                            {step === 0 ? t("common.next") : t("common.save")}
                        </Button>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

export default EditUserModal;
