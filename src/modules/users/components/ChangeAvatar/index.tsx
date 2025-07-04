import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { Avatar, Box, Button, Typography, useTheme } from "@mui/material";
import { Form, Formik } from "formik";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import Modal from "../../../shared/components/Modal";
import { ChangeAvatarButton } from "./styles";

interface Props {
    avatar?: string;
    username: string;
    disabled?: boolean;
    onSubmit: (values: { avatar: string }) => void;
}

const MAX_AVATAR_SIZE = 1024 * 1024;

const ChangeAvatar = ({ avatar, username, disabled, onSubmit }: Props) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const [showModal, setShowModal] = useState(false);

    const validationSchema = Yup.object({
        avatar: Yup.string().required(t("validation.required")),
    });

    const validateFile = (file: File | null) => {
        if (!file) return null;

        if (!file.type.startsWith("image/")) {
            return t("validation.invalid_file_type");
        }

        if (file.size > MAX_AVATAR_SIZE) {
            return t("validation.file_size_limit");
        }

        return null;
    };

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        setFieldValue: (field: string, value: unknown) => void
    ) => {
        const file = event.target.files?.[0] ?? null;
        const error = validateFile(file);

        if (!error && file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // Set Base64 string as avatar
                setFieldValue("avatar", reader.result as string);
            };
            reader.readAsDataURL(file); // Read file as Base64
        }
    };

    return (
        <Box sx={{ position: "relative" }}>
            <Avatar sx={{ width: "165px", height: "165px" }} src={avatar} variant="rounded" alt={username} />
            <ChangeAvatarButton
                onClick={() => {
                    setShowModal(true);
                    setTimeout(() => {
                        if (avatarInputRef.current) {
                            avatarInputRef.current.click();
                        }
                    }, 0);
                }}
                disabled={disabled}
            >
                <CameraAltIcon fontSize="large" sx={{ color: theme.palette.text.primary }} />
            </ChangeAvatarButton>
            <Modal open={showModal} onClose={() => setShowModal(false)} title={t("profile.change_avatar_title")}>
                <Box>
                    <Formik
                        initialValues={{ avatar: avatar || "" }}
                        onSubmit={(values) => {
                            if (values.avatar) {
                                onSubmit({ avatar: values.avatar });
                                setShowModal(false);
                            }
                        }}
                        validationSchema={validationSchema}
                    >
                        {({ setFieldValue, values, errors, touched }) => (
                            <Form>
                                <Box
                                    sx={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                        position: "relative",
                                    }}
                                >
                                    <Avatar
                                        sx={{ width: "165px", height: "165px" }}
                                        src={values.avatar || avatar}
                                        variant="rounded"
                                        alt={username}
                                    />
                                    <ChangeAvatarButton
                                        onClick={() => avatarInputRef.current?.click()}
                                        disabled={disabled}
                                    >
                                        <CameraAltIcon fontSize="large" sx={{ color: theme.palette.text.primary }} />
                                    </ChangeAvatarButton>
                                </Box>
                                <input
                                    ref={avatarInputRef}
                                    hidden
                                    id="avatar"
                                    name="avatar"
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) => handleFileChange(event, setFieldValue)}
                                />
                                {errors.avatar && touched.avatar && (
                                    <Typography sx={{ color: "red", textAlign: "center", marginTop: "10px" }}>
                                        {errors.avatar}
                                    </Typography>
                                )}

                                <Button
                                    type="submit"
                                    fullWidth
                                    sx={{ padding: "3px 0", marginTop: "20px" }}
                                    variant="contained"
                                    disabled={!values.avatar || !!errors.avatar}
                                >
                                    {t("common.save")}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </Box>
            </Modal>
        </Box>
    );
};

export default ChangeAvatar;
