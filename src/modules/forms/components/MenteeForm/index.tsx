import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { useUser } from "../../../auth/components/AuthProvider";
import InternalLink from "../../../shared/components/InternalLink/styles";
import { validation } from "../../../shared/constants";
import { MenteeFormValues } from "../../types";
import FormWrapper from "../FormWrapper";

interface Props {
    onSubmit: (values: MenteeFormValues) => void;
    step: number;
    setStep: Dispatch<SetStateAction<number>>;
}

const MenteeForm = ({ onSubmit, setStep, step }: Props) => {
    const { t } = useTranslation();
    const { user, register } = useUser();

    const initialValues: MenteeFormValues = {
        age: "",
        name: user?.full_name || "",
        contacts: [],
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

    const formik = useFormik({
        initialValues,
        validationSchema: validationSchemas[step],
        onSubmit: async (values) => {
            if (step === 4 && !user) {
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
                                onSuccess: () => {
                                    resolve();
                                },
                                onError: (error) => reject(error),
                                onSettled: () => {
                                    onSubmit(values);
                                },
                            }
                        );
                    });
                } catch (error) {
                    formik.setErrors({
                        email: t("validation.registration_failed"),
                        password: t("validation.registration_failed"),
                        confirmPassword: t("validation.registration_failed"),
                    });
                }
            } else if (step === validationSchemas.length - 1) {
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
            subtitle={t(user ? `form.mentee.subtitle.${step}` : `form.mentee.subtitle_new_user.${step}`, {
                contact: formik.values.phone || "email",
            })}
            title={t(user ? `form.mentee.title.${step}` : `form.mentee.title_new_user.${step}`)}
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
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                            fullWidth
                        />
                        <TextField
                            label={t("form.volunteer.age_label")}
                            name="age"
                            type="number"
                            value={formik.values.age}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.age && Boolean(formik.errors.age)}
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
                            <InputLabel id="contacts">{t("form.volunteer.contact_label")}</InputLabel>
                            <Select
                                label={t("form.volunteer.contact_label")}
                                name="contacts"
                                value={formik.values.contacts}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                multiple
                                error={formik.touched.contacts && Boolean(formik.errors.contacts)}
                                fullWidth
                            >
                                <MenuItem value="email">{t("form.volunteer.contact_options.email")}</MenuItem>
                                <MenuItem value="phone">{t("form.volunteer.contact_options.phone")}</MenuItem>
                            </Select>
                        </FormControl>
                        {formik.values.contacts.includes("phone") && (
                            <TextField
                                label={t("form.mentee.contact_detail.phone")}
                                name="phone"
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.phone && Boolean(formik.errors.phone)}
                                helperText={formik.touched.phone && formik.errors.phone}
                                fullWidth
                            />
                        )}
                        <TextField
                            label={t("form.mentee.contact_detail.email")}
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                            fullWidth
                        />
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
                        <FormControl sx={{ maxWidth: "85vw" }}>
                            <InputLabel id="themes">{t("form.mentee.issue_type_label")}</InputLabel>
                            <Select
                                label={t("form.mentee.issue_type_label")}
                                name="themes"
                                value={formik.values.themes}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                multiple
                                error={formik.touched.themes && Boolean(formik.errors.themes)}
                                fullWidth
                            >
                                <MenuItem value="no">{t("form.volunteer.issues_to_avoid.no")}</MenuItem>
                                <MenuItem value="depression">{t("form.volunteer.issues_to_avoid.depression")}</MenuItem>
                                <MenuItem value="alcoholism">{t("form.volunteer.issues_to_avoid.alcoholism")}</MenuItem>
                                <MenuItem value="drug_addiction">
                                    {t("form.volunteer.issues_to_avoid.drug_addiction")}
                                </MenuItem>
                                <MenuItem value="self_harm">{t("form.volunteer.issues_to_avoid.self_harm")}</MenuItem>
                                <MenuItem value="suicidal_thoughts">
                                    {t("form.volunteer.issues_to_avoid.suicidal_thoughts")}
                                </MenuItem>
                                <MenuItem value="eating_disorders">
                                    {t("form.volunteer.issues_to_avoid.eating_disorders")}
                                </MenuItem>
                                <MenuItem value="domestic_violence">
                                    {t("form.volunteer.issues_to_avoid.domestic_violence")}
                                </MenuItem>
                                <MenuItem value="homelessness">
                                    {t("form.volunteer.issues_to_avoid.homelessness")}
                                </MenuItem>
                                <MenuItem value="sexual_assault">
                                    {t("form.volunteer.issues_to_avoid.sexual_assault")}
                                </MenuItem>
                                <MenuItem value="grief_loss">{t("form.volunteer.issues_to_avoid.grief_loss")}</MenuItem>
                                <MenuItem value="trauma">{t("form.volunteer.issues_to_avoid.trauma")}</MenuItem>
                                <MenuItem value="anxiety">{t("form.volunteer.issues_to_avoid.anxiety")}</MenuItem>
                                <MenuItem value="burnout">{t("form.volunteer.issues_to_avoid.burnout")}</MenuItem>
                                <MenuItem value="loneliness">{t("form.volunteer.issues_to_avoid.loneliness")}</MenuItem>
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
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
                            fullWidth
                            multiline
                            rows={4}
                        />
                    </Box>
                )}

                {step === 4 && (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px",
                        }}
                    >
                        {!user && (
                            <>
                                <TextField
                                    label={t("common.password")}
                                    name="password"
                                    type="password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                    helperText={formik.touched.password && formik.errors.password}
                                    fullWidth
                                />
                                <TextField
                                    label={t("common.password_confirmation")}
                                    name="confirmPassword"
                                    type="password"
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                                    fullWidth
                                />
                            </>
                        )}
                        <TextField
                            select
                            label={t("form.referral_source_label")}
                            name="source"
                            value={formik.values.source}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.source && Boolean(formik.errors.source)}
                            helperText={formik.touched.source && formik.errors.source}
                            fullWidth
                        >
                            <MenuItem value="friend">{t("form.referral_source_options.friend")}</MenuItem>
                            <MenuItem value="socialMedia">{t("form.referral_source_options.social_media")}</MenuItem>
                            <MenuItem value="google">{t("form.referral_source_options.google")}</MenuItem>
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
                            label={
                                <Typography>
                                    Wyrażam zgodę na{" "}
                                    <InternalLink target="_blank" to="/tos">
                                        warunki użytkowania i politykę prywatności
                                    </InternalLink>
                                </Typography>
                            }
                        />
                        {formik.touched.tos && formik.errors.tos && (
                            <span style={{ color: "red" }}>{formik.errors.tos}</span>
                        )}
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
                                {step === validationSchemas.length - 1 ? t("form.submit") : t("form.next")}
                            </Button>
                        </>
                    )}
                    {step === 5 && (
                        <Box width="100%" display="flex" flexDirection="column" gap="10px">
                            <Button fullWidth type="button" component={Link} to="/" variant="contained">
                                {t("form.homepage")}
                            </Button>
                            <Button
                                fullWidth
                                type="button"
                                onClick={() => {
                                    setStep(0);
                                    formik.resetForm();
                                }}
                                variant="text"
                            >
                                {t("form.retry")}
                            </Button>
                        </Box>
                    )}
                </Box>
            </form>
        </FormWrapper>
    );
};

export default MenteeForm;
