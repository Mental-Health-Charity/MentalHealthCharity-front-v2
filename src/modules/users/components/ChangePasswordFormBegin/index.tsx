import { Box, Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { validation } from "../../../shared/constants";
import { ChangePasswordBeginPayload } from "../../types";

interface Props {
    onSubmit: (values: ChangePasswordBeginPayload) => void | Promise<void>;
    isLoading?: boolean;
}

const ChangePasswordBeginFormBegin = ({ onSubmit, isLoading }: Props) => {
    const { t } = useTranslation();

    const formik = useFormik<ChangePasswordBeginPayload>({
        initialValues: {
            email: "",
        },
        validationSchema: Yup.object({
            email: validation.email,
        }),
        onSubmit,
    });

    return (
        <Box
            component="form"
            onSubmit={formik.handleSubmit}
            noValidate
            sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
        >
            <TextField
                id="email"
                name="email"
                type="email"
                label={t("form.email")}
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                fullWidth
            />

            <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
                {t("form.submit")}
            </Button>
        </Box>
    );
};

export default ChangePasswordBeginFormBegin;
