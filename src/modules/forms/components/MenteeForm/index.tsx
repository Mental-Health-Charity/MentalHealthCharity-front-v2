import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useFormik } from "formik";
import { ArrowLeft, ArrowRight, CheckCircle, Clock3, Home, Mail, Phone, ShieldAlert } from "lucide-react";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { useUser } from "../../../auth/components/AuthProvider";
import InternalLink from "../../../shared/components/InternalLink";
import Loader from "../../../shared/components/Loader";
import { validation } from "../../../shared/constants";
import { MenteeFormValues } from "../../types";
import FormWrapper from "../FormWrapper";

interface Props {
    onSubmit: (values: MenteeFormValues) => void;
    step: number;
    setStep: Dispatch<SetStateAction<number>>;
    isLoading?: boolean;
}

const MenteeForm = ({ onSubmit, setStep, step, isLoading }: Props) => {
    const { t } = useTranslation();
    const { user, isFetchingUser: isLoadingUserSession } = useUser();
    const isFormDataLoading = (isLoadingUserSession && !user) || isLoading;
    const [direction, setDirection] = useState(1);
    const prevStepRef = useRef(step);

    const initialValues: MenteeFormValues = {
        age: "",
        name: user?.full_name || "",
        contacts: ["email"],
        email: user?.email || "",
        phone: "",
        description: "",
        contact_preference: "",
        source: "",
        tos: false,
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
            description: Yup.string().min(10, t("validation.description.tooShort")).required(t("validation.required")),
        }),
        Yup.object({
            contact_preference: Yup.string().oneOf(["scheduled", "asynchronous"]).required(t("validation.required")),
        }),
        Yup.object({
            source: Yup.string().required(t("validation.required")),
            tos: Yup.boolean().oneOf([true], t("validation.consent.required")),
        }),
    ];

    const LAST_STEP = validationSchemas.length - 1;

    const formik = useFormik({
        initialValues,
        validationSchema: validationSchemas[step],
        onSubmit: (values) => {
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

    const ageNum = Number(formik.values.age);
    const isUnder18 = formik.values.age !== "" && ageNum > 0 && ageNum < 18;
    const referralSourceOptions = [
        { value: "friend", label: t("form.referral_source_options.friend") },
        { value: "socialMedia", label: t("form.referral_source_options.social_media") },
        { value: "google", label: t("form.referral_source_options.google") },
    ];
    const selectedReferralSourceLabel = referralSourceOptions.find(
        (option) => option.value === formik.values.source
    )?.label;

    // Success state
    if (step > LAST_STEP) {
        const successCards = [
            {
                icon: Home,
                title: t("form.mentee.success.cards.chat.title"),
                body: t("form.mentee.success.cards.chat.body"),
            },
            {
                icon: Mail,
                title: t("form.mentee.success.cards.email.title"),
                body: t("form.mentee.success.cards.email.body"),
            },
            {
                icon: Clock3,
                title: t("form.mentee.success.cards.timing.title"),
                body: t("form.mentee.success.cards.timing.body"),
            },
        ];

        return (
            <FormWrapper subtitle="" title="" progress={100} direction={direction}>
                <div className="flex flex-col items-center py-6 text-center">
                    <div className="bg-primary-brand/10 mb-5 flex size-16 items-center justify-center rounded-full">
                        <CheckCircle className="text-primary-brand size-8" />
                    </div>
                    <h2 className="text-foreground text-2xl font-bold">
                        {t("form.mentee.title.5", { defaultValue: "Dziękujemy!" })}
                    </h2>
                    <p className="text-muted-foreground mt-3 max-w-2xl text-[15px] leading-relaxed">
                        {t("form.mentee.success.lead")}
                    </p>
                    <div className="mt-8 grid w-full gap-3 text-left">
                        {successCards.map(({ icon: Icon, title, body }) => (
                            <div
                                key={title}
                                className="border-border bg-muted/30 flex items-start gap-3 rounded-2xl border px-4 py-4"
                            >
                                <div className="bg-primary-brand/10 mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full">
                                    <Icon className="text-primary-brand size-4.5" />
                                </div>
                                <div>
                                    <p className="text-foreground text-sm font-semibold">{title}</p>
                                    <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{body}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-foreground mt-5 text-sm font-semibold">{t("form.mentee.success.closing")}</p>
                    <div className="mt-8 flex w-full flex-col gap-2.5">
                        <Button className="w-full gap-2" render={<Link to="/" />}>
                            <Home className="size-4" />
                            {t("form.homepage")}
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

                {/* Step 2: Description */}
                {step === 2 && (
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

                {/* Step 3: Contact preference */}
                {step === 3 && (
                    <div className="flex flex-col gap-5">
                        <div className="space-y-2">
                            <Label>{t("form.mentee.contact_preference_label")}</Label>
                            <p className="text-muted-foreground text-sm">{t("form.mentee.contact_preference_hint")}</p>
                        </div>

                        <div className="border-border bg-muted/40 relative grid grid-cols-2 rounded-2xl border p-1">
                            <div
                                className={cn(
                                    "bg-background absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl shadow-sm transition-transform duration-200",
                                    !formik.values.contact_preference && "opacity-0",
                                    formik.values.contact_preference === "asynchronous"
                                        ? "translate-x-[calc(100%+4px)]"
                                        : "translate-x-0"
                                )}
                            />
                            {(["scheduled", "asynchronous"] as const).map((value) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => formik.setFieldValue("contact_preference", value)}
                                    className="relative z-10 rounded-xl px-4 py-4 text-left transition-colors"
                                >
                                    <span className="text-foreground block text-sm font-semibold">
                                        {t(`form.mentee.contact_preference_options.${value}.title`)}
                                    </span>
                                    <span className="text-muted-foreground mt-1 block text-xs leading-relaxed">
                                        {t(`form.mentee.contact_preference_options.${value}.description`)}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {(formik.touched.contact_preference || formik.submitCount > 0) &&
                            formik.errors.contact_preference && (
                                <p role="alert" className="text-destructive text-sm">
                                    {formik.errors.contact_preference}
                                </p>
                            )}
                    </div>
                )}

                {/* Step 4: Account + Source + TOS */}
                {step === 4 && (
                    <div className="flex flex-col gap-5">
                        <div className="space-y-1.5">
                            <Label htmlFor="source">{t("form.referral_source_label")}</Label>
                            <Select
                                value={formik.values.source}
                                onValueChange={(value) => formik.setFieldValue("source", value)}
                                onOpenChange={(open) => {
                                    if (!open) {
                                        formik.setFieldTouched("source", true);
                                    }
                                }}
                            >
                                <SelectTrigger
                                    id="source"
                                    aria-describedby={
                                        formik.touched.source && formik.errors.source ? "source-error" : undefined
                                    }
                                    className="h-12 w-full rounded-xl bg-transparent px-4 text-sm"
                                    onBlur={() => formik.setFieldTouched("source", true)}
                                >
                                    <SelectValue>{selectedReferralSourceLabel ?? "---"}</SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {referralSourceOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
