import { useState } from "react";
import {
    Box,
    Button,
    TextField,
    MenuItem,
    Checkbox,
    FormControlLabel,
    FormControl,
    InputLabel,
    Select,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import FormWrapper from "../FormWrapper";
import { MenteeFormValues } from "../../types";
import { useUser } from "../../../auth/components/AuthProvider";
import { Link } from "react-router-dom";

interface Props {
    onSubmit: (values: MenteeFormValues) => void;
}

const MenteeForm = ({ onSubmit }: Props) => {
    const { t } = useTranslation();
    const { user } = useUser();

    const [step, setStep] = useState(0);

    const initialValues: MenteeFormValues = {
        age: "",
        name: user?.full_name || "",
        contacts: [],
        phone: "",
        themes: [],
        description: "",
        source: "",
        tos: false,
    };

    const validationSchemas = [
        Yup.object({
            name: Yup.string()
                .min(2, t("validation.name.tooShort"))
                .required(t("validation.required")),
            age: Yup.number()
                .min(18, t("validation.age.min"))
                .required(t("validation.required")),
        }),
        Yup.object({
            contacts: Yup.array().min(1, t("validation.contacts.min")),
        }),
        Yup.object({
            themes: Yup.array().min(1, t("validation.issueType.min")),
        }),
        Yup.object({
            description: Yup.string()
                .min(10, t("validation.description.tooShort"))
                .required(t("validation.required")),
        }),
        Yup.object({
            source: Yup.string().required(t("validation.required")),
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

    return (
        <FormWrapper
            subtitle={t(`form.mentee.subtitle.${step}`, {
                contact: formik.values.phone || "email",
            })}
            title={t(`form.mentee.title.${step}`)}
            progress={(step / validationSchemas.length) * 100}
        >
            <form onSubmit={formik.handleSubmit}>
                {step === 0 && (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px",
                        }}
                    >
                        <TextField
                            label={t("form.mentee.name_label")}
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                                formik.touched.name &&
                                Boolean(formik.errors.name)
                            }
                            helperText={
                                formik.touched.name && formik.errors.name
                            }
                            fullWidth
                        />
                        <TextField
                            label={t("form.volunteer.age_label")}
                            name="age"
                            type="number"
                            value={formik.values.age}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                                formik.touched.age && Boolean(formik.errors.age)
                            }
                            helperText={formik.touched.age && formik.errors.age}
                            fullWidth
                        />
                    </Box>
                )}

                {step === 1 && (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px",
                        }}
                    >
                        <FormControl>
                            <InputLabel id="contacts">
                                {t("form.volunteer.contact_label")}
                            </InputLabel>
                            <Select
                                label={t("form.volunteer.contact_label")}
                                name="contacts"
                                value={formik.values.contacts}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                multiple
                                error={
                                    formik.touched.contacts &&
                                    Boolean(formik.errors.contacts)
                                }
                                fullWidth
                            >
                                <MenuItem value="email">
                                    {t("form.volunteer.contact_options.email")}
                                </MenuItem>
                                <MenuItem value="phone">
                                    {t("form.volunteer.contact_options.phone")}
                                </MenuItem>
                            </Select>
                        </FormControl>
                        {formik.values.contacts.includes("phone") && (
                            <TextField
                                label={t("form.mentee.contact_detail.phone")}
                                name="phone"
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                    formik.touched.phone &&
                                    Boolean(formik.errors.phone)
                                }
                                helperText={
                                    formik.touched.phone && formik.errors.phone
                                }
                                fullWidth
                            />
                        )}
                    </Box>
                )}

                {step === 2 && (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px",
                        }}
                    >
                        <FormControl>
                            <InputLabel id="themes">
                                {t("form.mentee.issue_type_label")}
                            </InputLabel>
                            <Select
                                label={t("form.mentee.issue_type_label")}
                                name="themes"
                                value={formik.values.themes}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                multiple
                                error={
                                    formik.touched.themes &&
                                    Boolean(formik.errors.themes)
                                }
                                fullWidth
                            >
                                <MenuItem value="academic">
                                    {t(
                                        "form.volunteer.issues_to_avoid.academic"
                                    )}
                                </MenuItem>
                                <MenuItem value="personal">
                                    {t(
                                        "form.volunteer.issues_to_avoid.personal"
                                    )}
                                </MenuItem>
                                <MenuItem value="carrer">
                                    {t("form.volunteer.issues_to_avoid.career")}
                                </MenuItem>
                                <MenuItem value="other">
                                    {t("form.volunteer.issues_to_avoid.other")}
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                )}

                {step === 3 && (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px",
                        }}
                    >
                        <TextField
                            label={t("form.mentee.issue_description_label")}
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                                formik.touched.description &&
                                Boolean(formik.errors.description)
                            }
                            helperText={
                                formik.touched.description &&
                                formik.errors.description
                            }
                            fullWidth
                            multiline
                            rows={4}
                        />
                    </Box>
                )}

                {step === 5 && (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px",
                        }}
                    ></Box>
                )}
                {step === 4 && (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px",
                        }}
                    >
                        <TextField
                            select
                            label={t("form.referral_source_label")}
                            name="source"
                            value={formik.values.source}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                                formik.touched.source &&
                                Boolean(formik.errors.source)
                            }
                            helperText={
                                formik.touched.source && formik.errors.source
                            }
                            fullWidth
                        >
                            <MenuItem value="friend">
                                {t("form.referral_source_options.friend")}
                            </MenuItem>
                            <MenuItem value="socialMedia">
                                {t("form.referral_source_options.social_media")}
                            </MenuItem>
                            <MenuItem value="google">
                                {t("form.referral_source_options.google")}
                            </MenuItem>
                        </TextField>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="tos"
                                    checked={formik.values.tos}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    color="primary"
                                />
                            }
                            label={t("form.consent_label")}
                        />
                        {formik.touched.tos && formik.errors.tos && (
                            <span style={{ color: "red" }}>
                                {formik.errors.tos}
                            </span>
                        )}
                    </Box>
                )}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "20px",
                    }}
                >
                    {step < 5 && (
                        <>
                            <Button onClick={handleBack} disabled={step === 0}>
                                {t("form.back")}
                            </Button>
                            <Button type="submit" variant="contained">
                                {step === validationSchemas.length - 1
                                    ? t("form.submit")
                                    : t("form.next")}
                            </Button>
                        </>
                    )}
                    {step === 5 && (
                        <Button
                            fullWidth
                            type="button"
                            component={Link}
                            to="/"
                            variant="contained"
                        >
                            {t("form.homepage")}
                        </Button>
                    )}
                </Box>
            </form>
        </FormWrapper>
    );
};

export default MenteeForm;
