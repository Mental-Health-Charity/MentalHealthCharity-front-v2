import { Box, Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import Modal from "../../../shared/components/Modal";
import { Chat, EditChatPayload } from "../../types";

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (val: EditChatPayload) => void;
    chat: Chat;
}

const validationSchema = Yup.object({
    name: Yup.string().min(4, "Nazwa musi zawierać co najmniej 4 znaki").required("Nazwa jest wymagana"),
    is_active: Yup.boolean().required("Status jest wymagany"),
    id: Yup.number().required("Id jest wymagane"),
});

const EditChatModal = ({ onSubmit, chat, ...props }: Props) => {
    const { t } = useTranslation();

    const formik = useFormik<EditChatPayload>({
        initialValues: {
            name: chat.name,
            is_active: chat.is_active,
            id: chat.id,
        },
        validationSchema,
        onSubmit,
    });

    return (
        <Modal {...props} title={t("chat.edit_chat")}>
            <Box>
                <Box
                    component="form"
                    onSubmit={formik.handleSubmit}
                    noValidate
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        width: "400px",
                    }}
                >
                    <TextField
                        fullWidth
                        id="name"
                        name="name"
                        label="Nazwa"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                    />
                    <Button disabled={!formik.dirty} type="submit" variant="contained">
                        {!formik.dirty ? t("common.make_changes_to_save") : t("chat.edit_chat")}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default EditChatModal;
