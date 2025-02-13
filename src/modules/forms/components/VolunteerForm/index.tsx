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
} from '@mui/material';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import InternalLink from '../../../shared/components/InternalLink/styles';
import { VolunteerFormValues } from '../../types';
import FormWrapper from '../FormWrapper';

interface Props {
    onSubmit: (values: VolunteerFormValues) => void;
    initStep?: number;
}

const VolunteerForm = ({ onSubmit, initStep = 0 }: Props) => {
    const { t } = useTranslation();

    const [step, setStep] = useState(initStep);

    const initialValues: VolunteerFormValues = {
        age: '',
        contacts: [],
        description: '',
        did_help: '',
        reason: '',
        education: '',
        phone: '',
        source: '',
        themes: [],
        tos: false,
    };

    const validationSchemas = [
        Yup.object({
            age: Yup.number().min(18, t('validation.age.min')).required(t('validation.required')),
        }),
        Yup.object({
            education: Yup.string().required(t('validation.required')),
        }),
        Yup.object({
            phone: Yup.string()
                .matches(/^[0-9]+$/, t('validation.phone'))
                .required(t('validation.required')),
            contacts: Yup.array().of(Yup.string()).min(1, t('validation.required')),
        }),
        Yup.object({
            description: Yup.string().min(10, t('validation.description.tooShort')).required(t('validation.required')),
        }),
        Yup.object({
            source: Yup.string().required(t('validation.required')),
            did_help: Yup.string().required(t('validation.required')),
        }),
        Yup.object({
            tos: Yup.boolean().oneOf([true], t('validation.consent.required')),
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
            subtitle={t(`form.volunteer.subtitle.${step}`, {
                contact: formik.values.phone,
            })}
            title={t(`form.volunteer.title.${step}`, {
                contact: formik.values.phone,
            })}
            progress={(step / validationSchemas.length) * 100}
        >
            <form onSubmit={formik.handleSubmit}>
                {step === 0 && (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                        }}
                    >
                        <TextField
                            label={t('form.volunteer.age_label')}
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
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                        }}
                    >
                        <TextField
                            select
                            label={t('form.volunteer.education_label')}
                            name="education"
                            value={formik.values.education}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.education && Boolean(formik.errors.education)}
                            helperText={formik.touched.education && formik.errors.education}
                            fullWidth
                        >
                            <MenuItem value="elementary">{t('form.volunteer.education.elementary')}</MenuItem>
                            <MenuItem value="high_school">{t('form.volunteer.education.high_school')}</MenuItem>
                            <MenuItem value="bachelor">{t('form.volunteer.education.bachelor')}</MenuItem>
                            <MenuItem value="master">{t('form.volunteer.education.master')}</MenuItem>
                            <MenuItem value="phd">{t('form.volunteer.education.phd')}</MenuItem>
                        </TextField>
                    </Box>
                )}

                {step === 2 && (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                        }}
                    >
                        <TextField
                            label={t('form.volunteer.phone_number_label')}
                            name="phone"
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.phone && Boolean(formik.errors.phone)}
                            helperText={formik.touched.phone && formik.errors.phone}
                            fullWidth
                        />
                        <FormControl>
                            <InputLabel id="contacts">{t('form.volunteer.contact_label')}</InputLabel>
                            <Select
                                label={t('form.volunteer.contact_label')}
                                name="contacts"
                                value={formik.values.contacts}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                multiple
                                error={formik.touched.contacts && Boolean(formik.errors.contacts)}
                                fullWidth
                            >
                                <MenuItem value="email">{t('form.volunteer.contact_options.email')}</MenuItem>
                                <MenuItem value="phone">{t('form.volunteer.contact_options.phone')}</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                )}

                {step === 3 && (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                        }}
                    >
                        <TextField
                            label={t('form.volunteer.reason_label')}
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
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                        }}
                    >
                        <TextField
                            select
                            label={t('form.referral_source_label')}
                            name="source"
                            value={formik.values.source}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.source && Boolean(formik.errors.source)}
                            helperText={formik.touched.source && formik.errors.source}
                            fullWidth
                        >
                            <MenuItem value="friend">{t('form.referral_source_options.friend')}</MenuItem>
                            <MenuItem value="socialMedia">{t('form.referral_source_options.social_media')}</MenuItem>
                            <MenuItem value="google">{t('form.referral_source_options.google')}</MenuItem>
                        </TextField>
                        <TextField
                            select
                            label={t('form.volunteer.prior_experience_label')}
                            name="did_help"
                            value={formik.values.did_help}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.did_help && Boolean(formik.errors.did_help)}
                            helperText={formik.touched.did_help && (formik.errors.did_help as string)}
                            fullWidth
                        >
                            <MenuItem value="yes_professional">
                                {t('form.volunteer.prior_experience.yes_professional')}
                            </MenuItem>
                            <MenuItem value="yes_personal">
                                {t('form.volunteer.prior_experience.yes_personal')}
                            </MenuItem>
                            <MenuItem value="no">{t('form.volunteer.prior_experience.no')}</MenuItem>
                        </TextField>
                    </Box>
                )}

                {step === 5 && (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                        }}
                    >
                        <FormControl>
                            <InputLabel id="themes">{t('form.volunteer.issues_to_avoid_label')}</InputLabel>
                            <Select
                                label={t('form.volunteer.issues_to_avoid_label')}
                                name="themes"
                                value={formik.values.themes}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                multiple
                                error={formik.touched.themes && Boolean(formik.errors.themes)}
                                fullWidth
                            >
                                <MenuItem value="academic">{t('form.volunteer.issues_to_avoid.academic')}</MenuItem>
                                <MenuItem value="personal">{t('form.volunteer.issues_to_avoid.personal')}</MenuItem>
                                <MenuItem value="carrer">{t('form.volunteer.issues_to_avoid.career')}</MenuItem>
                                <MenuItem value="other">{t('form.volunteer.issues_to_avoid.other')}</MenuItem>
                            </Select>
                        </FormControl>
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
                                    Wyrażam zgodę na{' '}
                                    <InternalLink target="_blank" to="/tos">
                                        warunki użytkowania i politykę prywatności
                                    </InternalLink>
                                </Typography>
                            }
                        />
                        {formik.touched.tos && formik.errors.tos && (
                            <span style={{ color: 'red' }}>{formik.errors.tos}</span>
                        )}
                    </Box>
                )}

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: '20px',
                    }}
                >
                    {step < 6 && (
                        <>
                            <Button onClick={handleBack} disabled={step === 0}>
                                {t('form.back')}
                            </Button>
                            <Button type="submit" variant="contained">
                                {step === validationSchemas.length - 1 ? t('form.submit') : t('form.next')}
                            </Button>
                        </>
                    )}
                    {step === 6 && (
                        <Button component={Link} fullWidth type="button" to="/" variant="contained">
                            {t('form.homepage')}
                        </Button>
                    )}
                </Box>
            </form>
        </FormWrapper>
    );
};

export default VolunteerForm;
