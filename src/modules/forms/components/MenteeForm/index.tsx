import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useFormik } from "formik";
import { ArrowLeft, ArrowRight, CheckCircle, Home, Phone, RefreshCw, ShieldAlert } from "lucide-react";
import { Dispatch, SetStateAction, useRef, useState } from "react";
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
    { value: "anxiety", key: "anxiety" },
    { value: "eating_disorders", key: "eating_disorders" },
    { value: "burnout", key: "burnout" },
    { value: "loneliness", key: "loneliness" },
    { value: "grief_loss", key: "grief_loss" },
    { value: "homelessness", key: "homelessness" },
    { value: "trauma", key: "trauma" },
    { value: "self_harm", key: "self_harm", sensitive: true },
    { value: "suicidal_thoughts", key: "suicidal_thoughts", sensitive: true },
    { value: "domestic_violence", key: "domestic_violence", sensitive: true },
    { value: "sexual_assault", key: "sexual_assault", sensitive: true },
    { value: "other", key: "other", sensitive: false },
];

const MenteeForm = ({ onSubmit, setStep, step, isLoading }: Props) => {
    const { t } = useTranslation();
    const { user, register, isFetchingUser: isLoadingUserSession } = useUser();
    const isFormDataLoading = (isLoadingUserSession && !user) || isLoading;
    const [direction, setDirection] = useState(1);
    const prevStepRef = useRef(step);

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
            age: Yup.number().min(18, t("crisis.under_18_title")).required(t("validation.required")),
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

            setDirection(1);
            prevStepRef.current = step;
            setStep((prev) => prev + 1);
        },
    });

    const handleBack = () => {
        setDirection(-1);
        prevStepRef.current = step;
        setStep((prev) => (prev > 0 ? prev - 1 : prev));
    };

    const handleAgeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        const formattedText = text.replace(/[^0-9]/g, "");
        formik.setFieldValue("age", formattedText);
    };

    const handleThemeToggle = (value: string) => {
        const current = formik.values.themes;
        const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
        formik.setFieldValue("themes", next);
    };

    const ageNum = Number(formik.values.age);
    const isUnder18 = formik.values.age !== "" && ageNum > 0 && ageNum < 18;

    // Success state
    if (step > LAST_STEP) {
        return (
            <FormWrapper subtitle="" title="" progress={100} direction={direction}>
                <div className="flex flex-col items-center py-6 text-center">
                    <div className="bg-primary-brand/10 mb-5 flex size-16 items-center justify-center rounded-full">
                        <CheckCircle className="text-primary-brand size-8" />
                    </div>
                    <h2 className="text-foreground text-2xl font-bold">
                        {t("form.mentee.title.5", { defaultValue: "Dziękujemy!" })}
                    </h2>
                    <p className="text-muted-foreground mt-2 max-w-sm text-[15px]">
                        {t("form.mentee.subtitle.5", {
                            defaultValue: "Twoje zgłoszenie zostało wysłane. Skontaktujemy się z Tobą wkrótce.",
                        })}
                    </p>
                    <div className="mt-8 flex w-full flex-col gap-2.5">
                        <Button className="w-full gap-2" render={<Link to="/" />}>
                            <Home className="size-4" />
                            {t("form.homepage")}
                        </Button>
                        <Button
                            className="w-full gap-2"
                            variant="ghost"
                            type="button"
                            onClick={() => {
                                setStep(0);
                                formik.resetForm();
                            }}
                        >
                            <RefreshCw className="size-4" />
                            {t("form.retry")}
                        </Button>
                    </div>
                </div>
            </FormWrapper>
        );
    }

    return (
        <FormWrapper
            subtitle={t(user ? `form.mentee.subtitle.${step}` : `form.mentee.subtitle_new_user.${step}`, {
                contact: formik.values.phone || "email",
            })}
            title={t(user ? `form.mentee.title.${step}` : `form.mentee.title_new_user.${step}`)}
            progress={((step + 1) / (LAST_STEP + 2)) * 100}
            stepIndicator={`${step + 1} / ${validationSchemas.length}`}
            direction={direction}
        >
            <form onSubmit={formik.handleSubmit}>
                {/* Step 0: Name + Age */}
                {step === 0 && (
                    <div className="flex flex-col gap-5">
                        <div className="space-y-1.5">
                            <Label htmlFor="name">{t("form.mentee.name_label")}</Label>
                            <Input
                                id="name"
                                name="name"
                                autoFocus
                                aria-describedby={formik.touched.name && formik.errors.name ? "name-error" : undefined}
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="h-12"
                            />
                            {formik.touched.name && formik.errors.name && (
                                <p id="name-error" role="alert" className="text-destructive text-sm">
                                    {formik.errors.name}
                                </p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="age">{t("form.volunteer.age_label")}</Label>
                            <Input
                                id="age"
                                name="age"
                                type="number"
                                min={0}
                                aria-describedby={
                                    formik.touched.age && formik.errors.age
                                        ? "age-error"
                                        : isUnder18
                                          ? "age-info"
                                          : undefined
                                }
                                value={formik.values.age}
                                onChange={handleAgeInputChange}
                                onBlur={formik.handleBlur}
                                className="h-12"
                            />
                            {formik.touched.age && formik.errors.age && !isUnder18 && (
                                <p id="age-error" role="alert" className="text-destructive text-sm">
                                    {formik.errors.age}
                                </p>
                            )}
                            {isUnder18 && (
                                <div
                                    id="age-info"
                                    className="border-destructive/20 bg-destructive/5 mt-3 flex flex-col gap-2 rounded-xl border p-4"
                                >
                                    <div className="flex items-center gap-2">
                                        <ShieldAlert className="text-destructive size-5 shrink-0" />
                                        <p className="text-foreground text-sm font-semibold">
                                            {t("crisis.under_18_title")}
                                        </p>
                                    </div>
                                    <p className="text-muted-foreground text-sm">{t("crisis.under_18_text")}</p>
                                    <a
                                        href="tel:116111"
                                        className="text-primary-brand mt-1 inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
                                    >
                                        <Phone className="size-3.5" />
                                        116 111 — {t("crisis.youth_helpline")}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Step 1: Contact */}
                {step === 1 && (
                    <div className="flex flex-col gap-5">
                        {formik.values.contacts.includes("phone") && (
                            <div className="space-y-1.5">
                                <Label htmlFor="phone">{t("form.mentee.contact_detail.phone")}</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    autoFocus
                                    aria-describedby={
                                        formik.touched.phone && formik.errors.phone ? "phone-error" : undefined
                                    }
                                    value={formik.values.phone}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="h-12"
                                />
                                {formik.touched.phone && formik.errors.phone && (
                                    <p id="phone-error" role="alert" className="text-destructive text-sm">
                                        {formik.errors.phone}
                                    </p>
                                )}
                            </div>
                        )}
                        <div className="space-y-1.5">
                            <Label htmlFor="email">{t("form.mentee.contact_detail.email")}</Label>
                            <Input
                                id="email"
                                name="email"
                                autoFocus={!formik.values.contacts.includes("phone")}
                                aria-describedby={
                                    formik.touched.email && formik.errors.email ? "email-error" : undefined
                                }
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="h-12"
                            />
                            {formik.touched.email && formik.errors.email && (
                                <p id="email-error" role="alert" className="text-destructive text-sm">
                                    {formik.errors.email}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Step 2: Themes */}
                {step === 2 && (
                    <div className="flex flex-col gap-4">
                        <div className="space-y-3">
                            <Label>{t("form.mentee.issue_type_label")}</Label>
                            <p className="text-muted-foreground -mt-1 text-sm">{t("crisis.content_warning")}</p>

                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                {THEME_OPTIONS.map((opt) => (
                                    <label
                                        key={opt.value}
                                        className={cn(
                                            "border-border hover:bg-muted/50 flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-3 transition-all",
                                            formik.values.themes.includes(opt.value) &&
                                                "border-primary-brand bg-primary-brand/5 ring-primary-brand/20 ring-1"
                                        )}
                                    >
                                        <Checkbox
                                            checked={formik.values.themes.includes(opt.value)}
                                            onCheckedChange={() => handleThemeToggle(opt.value)}
                                        />
                                        <span className="text-sm">
                                            {t(`form.volunteer.issues_to_avoid.${opt.key}`)}
                                        </span>
                                    </label>
                                ))}
                            </div>

                            {formik.touched.themes && formik.errors.themes && (
                                <p role="alert" className="text-destructive text-sm">
                                    {formik.errors.themes as string}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Step 3: Description */}
                {step === 3 && (
                    <div className="flex flex-col gap-5">
                        <div className="space-y-1.5">
                            <Label htmlFor="description">{t("form.mentee.issue_description_label")}</Label>
                            <textarea
                                id="description"
                                name="description"
                                autoFocus
                                aria-describedby={
                                    formik.touched.description && formik.errors.description
                                        ? "description-error"
                                        : undefined
                                }
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                rows={5}
                                className="border-input focus-visible:border-ring focus-visible:ring-ring/30 w-full rounded-xl border bg-transparent px-4 py-3 text-sm leading-relaxed transition-colors outline-none focus-visible:ring-2"
                            />
                            {formik.touched.description && formik.errors.description && (
                                <p id="description-error" role="alert" className="text-destructive text-sm">
                                    {formik.errors.description}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Step 4: Account + Source + TOS */}
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
                                        autoFocus
                                        aria-describedby={
                                            formik.touched.password && formik.errors.password
                                                ? "password-error"
                                                : undefined
                                        }
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="h-12"
                                    />
                                    {formik.touched.password && formik.errors.password && (
                                        <p id="password-error" role="alert" className="text-destructive text-sm">
                                            {formik.errors.password}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="confirmPassword">{t("common.password_confirmation")}</Label>
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        aria-describedby={
                                            formik.touched.confirmPassword && formik.errors.confirmPassword
                                                ? "confirmPassword-error"
                                                : undefined
                                        }
                                        value={formik.values.confirmPassword}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="h-12"
                                    />
                                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                        <p id="confirmPassword-error" role="alert" className="text-destructive text-sm">
                                            {formik.errors.confirmPassword}
                                        </p>
                                    )}
                                </div>
                            </>
                        )}
                        <div className="space-y-1.5">
                            <Label htmlFor="source">{t("form.referral_source_label")}</Label>
                            <select
                                id="source"
                                name="source"
                                aria-describedby={
                                    formik.touched.source && formik.errors.source ? "source-error" : undefined
                                }
                                value={formik.values.source}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="border-input focus-visible:border-ring focus-visible:ring-ring/30 h-12 w-full rounded-xl border bg-transparent px-3 py-1 text-sm transition-colors outline-none focus-visible:ring-2"
                            >
                                <option value="">---</option>
                                <option value="friend">{t("form.referral_source_options.friend")}</option>
                                <option value="socialMedia">{t("form.referral_source_options.social_media")}</option>
                                <option value="google">{t("form.referral_source_options.google")}</option>
                            </select>
                            {formik.touched.source && formik.errors.source && (
                                <p id="source-error" role="alert" className="text-destructive text-sm">
                                    {formik.errors.source}
                                </p>
                            )}
                        </div>
                        <label className="flex cursor-pointer items-start gap-3 rounded-xl p-0">
                            <Checkbox
                                id="tos"
                                checked={formik.values.tos}
                                onCheckedChange={(checked) => formik.setFieldValue("tos", checked)}
                                className="mt-0.5"
                            />
                            <span className="text-muted-foreground text-sm leading-relaxed">
                                {t("crisis.tos_label", { defaultValue: "Wyrażam zgodę na" })}{" "}
                                <InternalLink target="_blank" to="/tos">
                                    {t("crisis.tos_link", {
                                        defaultValue: "warunki użytkowania i politykę prywatności",
                                    })}
                                </InternalLink>
                            </span>
                        </label>
                        {formik.touched.tos && formik.errors.tos && (
                            <span role="alert" className="text-danger-brand text-sm">
                                {formik.errors.tos}
                            </span>
                        )}
                    </div>
                )}

                {/* Navigation */}
                <div className="mt-8 flex items-center justify-between gap-3">
                    <Button variant="ghost" type="button" onClick={handleBack} disabled={step === 0} className="gap-2">
                        <ArrowLeft className="size-4" />
                        {t("form.back")}
                    </Button>
                    <Button type="submit" disabled={isFormDataLoading || isUnder18} className="gap-2">
                        {step === LAST_STEP ? t("form.submit") : t("form.next")}
                        {isFormDataLoading ? (
                            <Loader variant="small" size={20} />
                        ) : (
                            step < LAST_STEP && <ArrowRight className="size-4" />
                        )}
                    </Button>
                </div>
            </form>
        </FormWrapper>
    );
};

export default MenteeForm;
