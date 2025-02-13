import { Box, Button, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import InternalLink from '../../../shared/components/InternalLink/styles';
import { validation } from '../../../shared/constants';
import { LoginFormValues, RegisterFormValues } from '../../types';

interface Props {
    onSubmit: (values: RegisterFormValues) => void;
    initial?: LoginFormValues;
}

const RegisterForm = ({ onSubmit, initial }: Props) => {
    const { t } = useTranslation();

    const validationSchema = Yup.object({
        full_name: Yup.string().required(t('validation.required')),
        email: validation.email,
        password: validation.password,
        confirmPassword: validation.confirmPassword,
        policy_confirm: Yup.boolean()
            .oneOf([true], t('validation.required')) // Checkbox musi być zaznaczony
            .required(t('validation.required')),
    });

    const initialValues: RegisterFormValues = {
        email: '',
        password: '',
        confirmPassword: '',
        policy_confirm: false,
        full_name: '',
        ...initial,
    };

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ isSubmitting, errors, touched }) => (
                <Form>
                    <Box mb={2}>
                        <Field
                            as={TextField}
                            name="full_name"
                            type="text"
                            label="Imie lub ksywka"
                            fullWidth
                            variant="outlined"
                            error={touched.full_name && Boolean(errors.full_name)}
                            helperText={touched.full_name && errors.full_name}
                        />
                    </Box>
                    <Box mb={2}>
                        <Field
                            as={TextField}
                            name="email"
                            type="email"
                            label="Email"
                            fullWidth
                            variant="outlined"
                            error={touched.email && Boolean(errors.email)}
                            helperText={touched.email && errors.email}
                        />
                    </Box>

                    <Box mb={1}>
                        <Field
                            as={TextField}
                            name="password"
                            type="password"
                            label="Hasło"
                            fullWidth
                            variant="outlined"
                            error={touched.password && Boolean(errors.password)}
                            helperText={touched.password && errors.password}
                        />
                    </Box>

                    <Box mb={1}>
                        <Field
                            as={TextField}
                            name="confirmPassword"
                            type="password"
                            label="Potwierdź Hasło"
                            fullWidth
                            variant="outlined"
                            error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                            helperText={touched.confirmPassword && errors.confirmPassword}
                        />
                    </Box>

                    <Box mb={1} alignItems="start" display="flex" flexDirection="column">
                        <FormControlLabel control={<Checkbox defaultChecked />} label="Zapamiętaj mnie" />
                        <FormControlLabel
                            control={<Field as={Checkbox} name="policy_confirm" color="primary" />}
                            label={
                                <Typography>
                                    Rejestrując się wyrażam zgodę na{' '}
                                    <InternalLink to="/tos">warunki użytkowania i politykę prywatności</InternalLink>
                                </Typography>
                            }
                        />
                        {errors.policy_confirm && touched.policy_confirm && (
                            <Typography color="error" variant="caption">
                                {errors.policy_confirm}
                            </Typography>
                        )}
                    </Box>

                    <Button type="submit" variant="contained" color="primary" fullWidth disabled={isSubmitting}>
                        Zarejestruj
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default RegisterForm;
