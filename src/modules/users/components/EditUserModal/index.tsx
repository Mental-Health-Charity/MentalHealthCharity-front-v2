import { useTranslation } from "react-i18next";
import Modal from "../../../shared/components/Modal";
import { Box, Button, MenuItem, TextField, Typography } from "@mui/material";
import { User } from "../../../auth/types";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Roles } from "../../constants";
import useTheme from "../../../../theme";
import WarningIcon from "@mui/icons-material/Warning";
import { useState } from "react";
import DataComparison from "../../../shared/components/CompareChanges";
import { EditUserFormValues } from "../../types";

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: EditUserFormValues) => void;
    user: User;
}

const EditUserModal = ({ onClose, open, user }: Props) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const [step, setStep] = useState(0);

    const validationSchema = Yup.object({
        full_name: Yup.string(),
        user_role: Yup.string()
            .oneOf(Object.values(Roles), t("users.validation.invalid_role"))
            .required(t("validation.required")),
    });

    const initialValues = {
        full_name: user.full_name || "",
        user_role: user.user_role || Roles.USER,
    };

    const handleSubmit = (values: EditUserFormValues) => {
        if (step === 0) {
            setStep(1);
            console.debug(values);
        } else {
            onClose();
        }
    };

    return (
        <Modal
            onClose={onClose}
            open={open}
            title={
                step === 0
                    ? t("users.edit_modal_title")
                    : t("common.compare_changes.title")
            }
            modalContentProps={{
                width: 500,
            }}
        >
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    dirty,
                }) => (
                    <Form>
                        <Box display="flex" flexDirection="column" gap={2}>
                            {step === 0 && (
                                <>
                                    <TextField
                                        id="id"
                                        name="id"
                                        label={t("users.id")}
                                        fullWidth
                                        disabled
                                        value={user.id}
                                    />
                                    <TextField
                                        id="full_name"
                                        name="full_name"
                                        label={t("users.full_name")}
                                        fullWidth
                                        value={values.full_name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={
                                            touched.full_name &&
                                            Boolean(errors.full_name)
                                        }
                                        helperText={
                                            touched.full_name &&
                                            errors.full_name
                                        }
                                    />
                                    {values.full_name === "" && (
                                        <Box
                                            sx={{
                                                backgroundColor:
                                                    theme.palette.colors
                                                        .warning,
                                                display: "flex",
                                                alignItems: "center",
                                                padding: theme.spacing(2),
                                                borderRadius: "8px",
                                                gap: theme.spacing(2),
                                            }}
                                        >
                                            <WarningIcon
                                                sx={{
                                                    color: theme.palette.text
                                                        .secondary,
                                                }}
                                            />
                                            <Typography color="text.secondary">
                                                {t(
                                                    "users.empty_full_name_warning"
                                                )}
                                            </Typography>
                                        </Box>
                                    )}
                                    <TextField
                                        id="user_role"
                                        name="user_role"
                                        label={t("users.role")}
                                        select
                                        fullWidth
                                        value={values.user_role}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={
                                            touched.user_role &&
                                            Boolean(errors.user_role)
                                        }
                                        helperText={
                                            touched.user_role &&
                                            errors.user_role
                                        }
                                    >
                                        {Object.values(Roles).map((role) => (
                                            <MenuItem key={role} value={role}>
                                                {role}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    <TextField
                                        id="email"
                                        name="email"
                                        label={t("users.email")}
                                        fullWidth
                                        disabled
                                        value={user.email}
                                    />
                                </>
                            )}
                            {step === 1 && (
                                <DataComparison
                                    dataA={values}
                                    dataB={initialValues}
                                />
                            )}

                            <Box display="flex" justifyContent="space-between">
                                <Button
                                    size="small"
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    disabled={!dirty}
                                >
                                    {step === 0
                                        ? t("common.next")
                                        : t("common.save")}
                                </Button>
                            </Box>
                        </Box>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

export default EditUserModal;
