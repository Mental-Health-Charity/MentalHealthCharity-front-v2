import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import Modal from "../../../shared/components/Modal";
import { Roles } from "../../../users/constants";
import convertToCreateChatPayload from "../../helpers/convertToCreateChatPayload";
import createChatMutation from "../../queries/createChatMutation";
import { CreateChatFormValues } from "../../types";

const FLAG_OPTIONS = [{ value: "autoGroupChat", label: "Automatyczny czat grupowy" }];

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const NewChatModal = ({ open, onClose, onSuccess }: Props) => {
    const { t } = useTranslation();

    const { mutate, isPending } = useMutation({
        mutationFn: createChatMutation,
        onSuccess: () => {
            onClose();
            onSuccess?.();
        },
    });

    const formik = useFormik<CreateChatFormValues>({
        initialValues: {
            name: "",
            flags: [],
            role: "",
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .min(4, t("chat.new_chat_name_min", { defaultValue: "Nazwa musi zawierać co najmniej 4 znaki" }))
                .required(t("chat.new_chat_name_required", { defaultValue: "Nazwa jest wymagana" })),
            flags: Yup.array().of(Yup.string()),
            role: Yup.string().when("flags", (flags, schema) =>
                flags.includes("autoGroupChat")
                    ? schema.required(t("chat.new_chat_role_required", { defaultValue: "Wybór roli jest wymagany" }))
                    : schema
            ),
        }),
        onSubmit: (values) => {
            mutate(convertToCreateChatPayload(values));
        },
    });

    return (
        <Modal open={open} onClose={onClose} title={t("chat.create_new_chat")}>
            <form onSubmit={formik.handleSubmit} noValidate className="flex flex-col gap-5">
                <div className="space-y-1.5">
                    <Label htmlFor="new-chat-name">{t("common.name", { defaultValue: "Nazwa" })}</Label>
                    <Input
                        id="new-chat-name"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder={t("chat.new_chat_name_placeholder", { defaultValue: "Np. Wsparcie - Jan K." })}
                    />
                    {formik.touched.name && formik.errors.name && (
                        <p className="text-destructive text-sm">{formik.errors.name}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>{t("chat.new_chat_extensions", { defaultValue: "Rozszerzenia" })}</Label>
                    {FLAG_OPTIONS.map((option) => (
                        <div key={option.value} className="flex items-center gap-2">
                            <Checkbox
                                id={`new-chat-flag-${option.value}`}
                                checked={formik.values.flags.includes(option.value)}
                                onCheckedChange={(checked) => {
                                    const flags = checked
                                        ? [...formik.values.flags, option.value]
                                        : formik.values.flags.filter((f) => f !== option.value);
                                    formik.setFieldValue("flags", flags);
                                }}
                            />
                            <Label htmlFor={`new-chat-flag-${option.value}`} className="font-normal">
                                {option.label}
                            </Label>
                        </div>
                    ))}
                </div>

                {formik.values.flags.includes("autoGroupChat") && (
                    <div className="space-y-1.5">
                        <Label htmlFor="new-chat-role">{t("chat.new_chat_role", { defaultValue: "Rola" })}</Label>
                        <select
                            id="new-chat-role"
                            name="role"
                            value={formik.values.role}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-lg border bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:ring-3"
                        >
                            <option value="">---</option>
                            {Object.values(Roles).map((role) => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </select>
                        {formik.touched.role && formik.errors.role && (
                            <p className="text-destructive text-sm">{formik.errors.role}</p>
                        )}
                    </div>
                )}

                <Button type="submit" disabled={isPending}>
                    {isPending ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        t("common.create", { defaultValue: "Utwórz" })
                    )}
                </Button>
            </form>
        </Modal>
    );
};

export default NewChatModal;
