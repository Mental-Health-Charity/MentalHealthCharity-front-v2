import * as Yup from "yup";
import { validation } from "../../../shared/constants";
import { ChangePasswordValues } from '../../../users/types.ts';
import { Field, Form, Formik } from 'formik';
import { Box, Button, TextField } from '@mui/material';

type Props = {
    onSubmit: (values: ChangePasswordValues) => void;
    disabled?: boolean;
    initial?: ChangePasswordValues;
    
};
const ChangePasswordForm = ({...props}: Props) => {
    const validationSchema = Yup.object({
        old_password: validation.password,
        new_password: validation.password,
        
    })
    
    const initialValues = {
        old_password: "",
        new_password: "",
        ...props.initial
    }
    
    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={props.onSubmit}>
            {({isSubmitting, errors, touched }) => (
                <Form>
                    <Box mb={2}>
                        <Field
                            as={TextField}
                            name="old_password"
                            type="password"
                            label="Stare Hasło"
                            fullWidth
                            variant="outlined"
                            error={touched.old_password && Boolean(errors.old_password )}
                            helperText={touched.old_password  && errors.old_password }
                        />
                    </Box>

                    <Box mb={1}>
                        <Field
                            as={TextField}
                            name="new_password"
                            type="password"
                            label="Nowe hasło"
                            fullWidth
                            variant="outlined"
                            error={touched.new_password && Boolean(errors.new_password)}
                            helperText={touched.new_password && errors.new_password}
                        />
                    </Box>
                    <Button type="submit" disabled={isSubmitting} variant="contained" color="primary" fullWidth>
                        Zmień hasło
                    </Button>
                </Form>
            )}
        </Formik>
    );
};
export default ChangePasswordForm;
