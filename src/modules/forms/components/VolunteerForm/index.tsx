import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { useUser } from "../../../auth/components/AuthProvider";
import { DateTimePicker } from "../../../shared/components/DatePicker";
import InternalLink from "../../../shared/components/InternalLink";
import { VolunteerFormValues } from "../../types";
import FormWrapper from "../FormWrapper";

interface Props {
    onSubmit: (values: VolunteerFormValues) => void;
    initStep?: number;
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

const VolunteerForm = ({ onSubmit, initStep = 0 }: Props) => {
    const { t } = useTranslation();
    const { user } = useUser();

    const [step, setStep] = useState(initStep);

    const initialValues: VolunteerFormValues = {
        age: "",
        contacts: ["-"],
        description: "",
        did_help: "",
        reason: "",
        education: "",
        phone: "",
        source: "",
        themes: [],
        tos: false,
        interview_meeting_dates: [],
    };

    const validationSchemas = [
        Yup.object({
            age: Yup.number().min(18, t("validation.age.min")).required(t("validation.required")),
        }),
        Yup.object({
            education: Yup.string().required(t("validation.required")),
        }),
        Yup.object({
            phone: Yup.string()
                .matches(/^[0-9]+$/, t("validation.phone"))
                .required(t("validation.required")),
            contacts: Yup.array().of(Yup.string()).min(1, t("validation.required")),
        }),
        Yup.object({
            description: Yup.string().min(10, t("validation.description.tooShort")).required(t("validation.required")),
        }),
        Yup.object({
            interview_meeting_dates: Yup.array().min(1, t("validation.required")),
        }),
        Yup.object({
            source: Yup.string().required(t("validation.required")),
            did_help: Yup.string().required(t("validation.required")),
        }),
        Yup.object({
            themes: Yup.array(),
            tos: Yup.boolean().oneOf([true], t("validation.consent.required")),
        }),
    ];

    const formik = useFormik({
        initialValues,
        validationSchema: validationSchemas[step],
        onSubmit: (values) => {
            if (step === validationSchemas.length - 1) {
                onSubmit(values);
                setStep(validationSchemas.length);
            } else {
                setStep((prevStep) => prevStep + 1);
            }
        },
    });

    const handleBack = () => {
        setStep((prevStep) => (prevStep > 0 ? prevStep - 1 : prevStep));
    };

    const handleAgeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        const formattedText = text.replace(/[^0-9]/g, "");
        formik.setFieldValue("age", formattedText);
    };

    return (
        <FormWrapper
            subtitle={t(`form.volunteer.subtitle.${step}`, {
                contact: user?.email,
            })}
            title={t(`form.volunteer.title.${step}`, {
                contact: user?.email,
            })}
            progress={(step / validationSchemas.length) * 100}
        >
            <form onSubmit={formik.handleSubmit}>
                {step === 0 && (
                    <div className="flex flex-col gap-5">
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
                        <div className="space-y-1.5">
                            <Label htmlFor="education">{t("form.volunteer.education_label")}</Label>
                            <select
                                id="education"
                                name="education"
                                value={formik.values.education}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-8 w-full rounded-lg border bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:ring-3"
                            >
                                <option value="">---</option>
                                <option value="elementary">{t("form.volunteer.education.elementary")}</option>
                                <option value="high_school">{t("form.volunteer.education.high_school")}</option>
                                <option value="bachelor">{t("form.volunteer.education.bachelor")}</option>
                                <option value="master">{t("form.volunteer.education.master")}</option>
                                <option value="phd">{t("form.volunteer.education.phd")}</option>
                            </select>
                            {formik.touched.education && formik.errors.education && (
                                <p className="text-destructive text-sm">{formik.errors.education}</p>
                            )}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="flex flex-col gap-5">
                        <div className="space-y-1.5">
                            <Label htmlFor="phone">{t("form.volunteer.phone_number_label")}</Label>
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
                    </div>
                )}

                {step === 3 && (
                    <div className="flex flex-col gap-5">
                        <div className="space-y-1.5">
                            <Label htmlFor="description">{t("form.volunteer.reason_label")}</Label>
                            <textarea
                                id="description"
                                name="description"
                                value={formik.values.description}
                                autoComplete="off"
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
                    <div className="flex w-full flex-col items-center gap-5">
                        <DateTimePicker
                            values={formik.values.interview_meeting_dates}
                            onChange={(newValue) => formik.setFieldValue("interview_meeting_dates", newValue)}
                        />
                        {formik.touched.interview_meeting_dates && formik.errors.interview_meeting_dates && (
                            <span className="text-destructive text-sm">
                                {formik.errors.interview_meeting_dates as string}
                            </span>
                        )}
                    </div>
                )}

                {step === 5 && (
                    <div className="flex flex-col gap-5">
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

                        <div className="space-y-1.5">
                            <Label htmlFor="did_help">{t("form.volunteer.prior_experience_label")}</Label>
                            <select
                                id="did_help"
                                name="did_help"
                                value={formik.values.did_help}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-8 w-full rounded-lg border bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:ring-3"
                            >
                                <option value="">---</option>
                                <option value="yes_professional">
                                    {t("form.volunteer.prior_experience.yes_professional")}
                                </option>
                                <option value="yes_personal">
                                    {t("form.volunteer.prior_experience.yes_personal")}
                                </option>
                                <option value="no">{t("form.volunteer.prior_experience.no")}</option>
                            </select>
                            {formik.touched.did_help && formik.errors.did_help && (
                                <p className="text-destructive text-sm">{formik.errors.did_help as string}</p>
                            )}
                        </div>
                    </div>
                )}

                {step === 6 && (
                    <div className="flex flex-col gap-5">
                        <div className="max-w-[85vw] space-y-1.5">
                            <Label htmlFor="themes">{t("form.volunteer.issues_to_avoid_label")}</Label>
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
                            <span className="text-destructive text-sm">{formik.errors.tos}</span>
                        )}
                    </div>
                )}

                <div className="mt-5 flex justify-between">
                    {step < 7 && (
                        <>
                            <Button variant="ghost" type="button" onClick={handleBack} disabled={step === 0}>
                                {t("form.back")}
                            </Button>
                            <Button type="submit">
                                {step === validationSchemas.length - 1 ? t("form.submit") : t("form.next")}
                            </Button>
                        </>
                    )}
                    {step === 7 && (
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

export default VolunteerForm;
