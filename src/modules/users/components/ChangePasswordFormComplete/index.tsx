import { Box, Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import * as Yup from "yup";
import { validation } from "../../../shared/constants";

export interface ChangePasswordCompletePayload {
    token: string;
    new_password: string;
}

interface Props {
    onSubmit: (values: ChangePasswordCompletePayload) => void | Promise<void>;
    isLoading?: boolean;
}

interface FormValues {
    password: string;
    confirm_password: string;
    token: string;
}

const ChangePasswordFormComplete = ({ onSubmit, isLoading }: Props) => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const formik = useFormik<FormValues>({
        initialValues: {
            token: token || "",
            password: "",
            confirm_password: "",
        },
        validationSchema: Yup.object({
            token: Yup.string().required(t("validation.required")),
            password: validation.password,
            confirm_password: validation.confirmPassword,
        }),
        onSubmit: (values) => {
            const { token, password } = values;
            return onSubmit({ token, new_password: password });
        },
    });

    return (
        <Box
            component="form"
            onSubmit={formik.handleSubmit}
            noValidate
            sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
        >
            {!token && (
                <TextField
                    id="token"
                    name="token"
                    label={t("form.token")}
                    value={formik.values.token}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.token && Boolean(formik.errors.token)}
                    helperText={formik.touched.token && formik.errors.token}
                    fullWidth
                />
            )}

            <TextField
                id="password"
                name="password"
                type="password"
                label={t("change_password_form_complete.new_password")}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                fullWidth
            />

            <TextField
                id="confirm_password"
                name="confirm_password"
                type="password"
                label={t("common.password_confirmation")}
                value={formik.values.confirm_password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.confirm_password && Boolean(formik.errors.confirm_password)}
                helperText={formik.touched.confirm_password && formik.errors.confirm_password}
                fullWidth
            />

            <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
                {t("form.submit")}
            </Button>
        </Box>
    );
};

export default ChangePasswordFormComplete;
