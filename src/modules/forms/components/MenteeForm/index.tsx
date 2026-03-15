import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { useUser } from "../../../auth/components/AuthProvider";
import InternalLink from "../../../shared/components/InternalLink";
import Loader from "../../../shared/components/Loader";
import { validation } from "../../../shared/constants";
import handleApiError from "../../../shared/helpers/handleApiError";
import { MenteeFormValues } from "../../types";
import FormWrapper from "../FormWrapper";

interface Props {
    onSubmit: (values: MenteeFormValues) => void;
    step: number;
    setStep: Dispatch<SetStateAction<number>>;
    isLoading?: boolean;
}

const THEME_OPTIONS = [
    { value: "no", key: "no" },
    { value: "depression", key: "depression" },
    { value: "alcoholism", key: "alcoholism" },
    { value: "drug_addiction", key: "drug_addiction" },
    { value: "self_harm", key: "self_harm" },
    { value: "suicidal_thoughts", key: "suicidal_thoughts" },
    { value: "eating_disorders", key: "eating_disorders" },
    { value: "domestic_violence", key: "domestic_violence" },
    { value: "homelessness", key: "homelessness" },
    { value: "sexual_assault", key: "sexual_assault" },
    { value: "grief_loss", key: "grief_loss" },
    { value: "trauma", key: "trauma" },
    { value: "anxiety", key: "anxiety" },
    { value: "burnout", key: "burnout" },
    { value: "loneliness", key: "loneliness" },
];

const MenteeForm = ({ onSubmit, setStep, step, isLoading }: Props) => {
    const { t } = useTranslation();
    const { user, register, isFetchingUser: isLoadingUserSession } = useUser();
    const isFormDataLoading = (isLoadingUserSession && !user) || isLoading;

    const initialValues: MenteeFormValues = {
        age: "",
        name: user?.full_name || "",
        contacts: ["email"],
        email: user?.email || "",
        phone: "",
        themes: [],
        description: "",
        source: "",
        tos: false,
        password: "",
        confirmPassword: "",
    };

    const validationSchemas = [
        Yup.object({
            name: Yup.string().min(2, t("validation.name.tooShort")).required(t("validation.required")),
            age: Yup.number().min(18, t("validation.age.min")).required(t("validation.required")),
        }),
        Yup.object({
            contacts: Yup.array().min(1, t("validation.contacts.min")),
            email: validation.email,
        }),
        Yup.object({
            themes: Yup.array().min(1, t("validation.issueType.min")),
        }),
        Yup.object({
            description: Yup.string().min(10, t("validation.description.tooShort")).required(t("validation.required")),
        }),
        Yup.object({
            ...(!user && {
                password: validation.password,
                confirmPassword: validation.confirmPassword,
            }),
            source: Yup.string().required(t("validation.required")),
            tos: Yup.boolean().oneOf([true], t("validation.consent.required")),
        }),
    ];

    const LAST_STEP = validationSchemas.length - 1;

    const formik = useFormik({
        initialValues,
        validationSchema: validationSchemas[step],
        onSubmit: async (values) => {
            if (step === LAST_STEP && !user) {
                try {
                    await new Promise<void>((resolve, reject) => {
                        register.mutate(
                            {
                                confirmPassword: values.confirmPassword,
                                email: values.email,
                                full_name: values.name,
                                password: values.password,
                                policy_confirm: true,
                            },
                            {
                                onSuccess: () => resolve(),
                                onError: (error) => reject(error),
                            }
                        );
                    });

                    onSubmit(values);
                    return;
                } catch (error) {
                    formik.setErrors({
                        email: t("validation.registration_failed"),
                        password: t("validation.registration_failed"),
                        confirmPassword: t("validation.registration_failed"),
                    });
                    handleApiError(error);
                    return;
                }
            }

            if (step === LAST_STEP) {
                onSubmit(values);
                return;
            }

            setStep((prev) => prev + 1);
        },
    });

    const handleBack = () => {
        setStep((prev) => (prev > 0 ? prev - 1 : prev));
    };

    const handleAgeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        const formattedText = text.replace(/[^0-9]/g, "");
        formik.setFieldValue("age", formattedText);
    };

    return (
        <FormWrapper
            subtitle={t(user ? `form.mentee.subtitle.${step}` : `form.mentee.subtitle_new_user.${step}`, {
                contact: formik.values.phone || "email",
            })}
            title={t(user ? `form.mentee.title.${step}` : `form.mentee.title_new_user.${step}`)}
            progress={(step / validationSchemas.length) * 100}
        >
            <form onSubmit={formik.handleSubmit}>
                {step === 0 && (
                    <div className="flex flex-col gap-5">
                        <div className="space-y-1.5">
                            <Label htmlFor="name">{t("form.mentee.name_label")}</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.name && formik.errors.name && (
                                <p className="text-destructive text-sm">{formik.errors.name}</p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="age">{t("form.volunteer.age_label")}</Label>
                            <Input
                                id="age"
                                name="age"
                                type="number"
                                min={0}
                                value={formik.values.age}
                                onChange={handleAgeInputChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.age && formik.errors.age && (
                                <p className="text-destructive text-sm">{formik.errors.age}</p>
                            )}
                        </div>
                    </div>
                )}

                {step === 1 && (
                    <div className="flex flex-col gap-5">
                        {formik.values.contacts.includes("phone") && (
                            <div className="space-y-1.5">
                                <Label htmlFor="phone">{t("form.mentee.contact_detail.phone")}</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={formik.values.phone}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.phone && formik.errors.phone && (
                                    <p className="text-destructive text-sm">{formik.errors.phone}</p>
                                )}
                            </div>
                        )}
                        <div className="space-y-1.5">
                            <Label htmlFor="email">{t("form.mentee.contact_detail.email")}</Label>
                            <Input
                                id="email"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <p className="text-destructive text-sm">{formik.errors.email}</p>
                            )}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="flex flex-col gap-5">
                        <div className="max-w-[85vw] space-y-1.5">
                            <Label htmlFor="themes">{t("form.mentee.issue_type_label")}</Label>
                            <select
                                id="themes"
                                name="themes"
                                multiple
                                value={formik.values.themes}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-auto min-h-[200px] w-full rounded-lg border bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:ring-3"
                            >
                                {THEME_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {t(`form.volunteer.issues_to_avoid.${opt.key}`)}
                                    </option>
                                ))}
                            </select>
                            {formik.touched.themes && formik.errors.themes && (
                                <p className="text-destructive text-sm">{formik.errors.themes as string}</p>
                            )}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="flex flex-col gap-5">
                        <div className="space-y-1.5">
                            <Label htmlFor="description">{t("form.mentee.issue_description_label")}</Label>
                            <textarea
                                id="description"
                                name="description"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                rows={4}
                                className="border-input focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-3"
                            />
                            {formik.touched.description && formik.errors.description && (
                                <p className="text-destructive text-sm">{formik.errors.description}</p>
                            )}
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="flex flex-col gap-5">
                        {!user && (
                            <>
                                <div className="space-y-1.5">
                                    <Label htmlFor="password">{t("common.password")}</Label>
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
                                    <Label htmlFor="confirmPassword">{t("common.password_confirmation")}</Label>
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        value={formik.values.confirmPassword}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                        <p className="text-destructive text-sm">{formik.errors.confirmPassword}</p>
                                    )}
                                </div>
                            </>
                        )}
                        <div className="space-y-1.5">
                            <Label htmlFor="source">{t("form.referral_source_label")}</Label>
                            <select
                                id="source"
                                name="source"
                                value={formik.values.source}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-8 w-full rounded-lg border bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:ring-3"
                            >
                                <option value="">---</option>
                                <option value="friend">{t("form.referral_source_options.friend")}</option>
                                <option value="socialMedia">{t("form.referral_source_options.social_media")}</option>
                                <option value="google">{t("form.referral_source_options.google")}</option>
                            </select>
                            {formik.touched.source && formik.errors.source && (
                                <p className="text-destructive text-sm">{formik.errors.source}</p>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="tos"
                                checked={formik.values.tos}
                                onCheckedChange={(checked) => formik.setFieldValue("tos", checked)}
                            />
                            <Label htmlFor="tos" className="font-normal">
                                Wyrażam zgodę na{" "}
                                <InternalLink target="_blank" to="/tos">
                                    warunki użytkowania i politykę prywatności
                                </InternalLink>
                            </Label>
                        </div>
                        {formik.touched.tos && formik.errors.tos && (
                            <span className="text-danger-brand text-sm">{formik.errors.tos}</span>
                        )}
                    </div>
                )}

                <div className="mt-5 flex justify-between">
                    {step <= LAST_STEP && (
                        <>
                            <Button variant="ghost" type="button" onClick={handleBack} disabled={step === 0}>
                                {t("form.back")}
                            </Button>
                            <Button className="gap-[5px]" disabled={isFormDataLoading} type="submit">
                                {step === LAST_STEP ? t("form.submit") : t("form.next")}
                                {isFormDataLoading && <Loader variant="small" size={30} />}
                            </Button>
                        </>
                    )}
                    {step > LAST_STEP && (
                        <div className="flex w-full flex-col gap-2.5">
                            <Button className="w-full" render={<Link to="/" />}>
                                {t("form.homepage")}
                            </Button>
                            <Button
                                className="w-full"
                                variant="ghost"
                                type="button"
                                onClick={() => {
                                    setStep(0);
                                    formik.resetForm();
                                }}
                            >
                                {t("form.retry")}
                            </Button>
                        </div>
                    )}
                </div>
            </form>
        </FormWrapper>
    );
};

export default MenteeForm;
