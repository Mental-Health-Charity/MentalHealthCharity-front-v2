import { Box, Button, Checkbox, FormControlLabel, TextField } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { StyledLink } from '../../../shared/components/StyledLink/styles';
import { LoginFormValues } from '../../types';

interface Props {
    onSubmit: (values: LoginFormValues) => void;
    disabled?: boolean;
    initial?: LoginFormValues;
}

const LoginForm = ({ onSubmit, initial, disabled }: Props) => {
    const { t } = useTranslation();

    const validationSchema = Yup.object({
        email: Yup.string().email(t('validation.invalid_email')).required(t('validation.required')),
        password: Yup.string().min(8, t('validation.incorrect_password_format')).required(t('validation.required')),
    });

    const initialValues = {
        email: '',
        password: '',
        ...initial,
    };

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ errors, touched }) => (
                <Form>
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

                    <Box mb={1} display="flex" justifyContent="space-between" alignItems="center">
                        <FormControlLabel control={<Checkbox defaultChecked />} label="Zapamiętaj mnie" />
                        <StyledLink to="/auth/forget-password">Przypomnij hasło</StyledLink>
                    </Box>

                    <Button type="submit" variant="contained" color="primary" fullWidth disabled={disabled}>
                        Login
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default LoginForm;
