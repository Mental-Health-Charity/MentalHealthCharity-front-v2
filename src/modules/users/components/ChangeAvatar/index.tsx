import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Form, Formik } from "formik";
import { Camera } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import Modal from "../../../shared/components/Modal";

interface Props {
    avatar?: string;
    username: string;
    disabled?: boolean;
    onSubmit: (values: { avatar: string }) => void;
}

const MAX_AVATAR_SIZE = 1024 * 1024;

const ChangeAvatar = ({ avatar, username, disabled, onSubmit }: Props) => {
    const { t } = useTranslation();
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const [showModal, setShowModal] = useState(false);

    const validationSchema = Yup.object({
        avatar: Yup.string().required(t("validation.required")),
    });

    const validateFile = (file: File | null) => {
        if (!file) return null;
        if (!file.type.startsWith("image/")) return t("validation.invalid_file_type");
        if (file.size > MAX_AVATAR_SIZE) return t("validation.file_size_limit");
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
                setFieldValue("avatar", reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="relative">
            <Avatar className="size-[165px] rounded-md">
                <AvatarImage src={avatar} alt={username} />
                <AvatarFallback className="rounded-md text-3xl">{username?.charAt(0)?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <button
                className="absolute inset-0 flex items-center justify-center rounded-md opacity-0 transition-opacity hover:bg-black/50 hover:opacity-100"
                onClick={() => {
                    setShowModal(true);
                    setTimeout(() => avatarInputRef.current?.click(), 0);
                }}
                disabled={disabled}
                type="button"
            >
                <Camera className="text-foreground size-8" />
            </button>
            <Modal open={showModal} onClose={() => setShowModal(false)} title={t("profile.change_avatar_title")}>
                <div>
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
                                <div className="relative flex w-full justify-center">
                                    <Avatar className="size-[165px] rounded-md">
                                        <AvatarImage src={values.avatar || avatar} alt={username} />
                                        <AvatarFallback className="rounded-md text-3xl">
                                            {username?.charAt(0)?.toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <button
                                        className="absolute top-0 left-1/2 flex size-[165px] -translate-x-1/2 items-center justify-center rounded-md opacity-0 transition-opacity hover:bg-black/50 hover:opacity-100"
                                        onClick={() => avatarInputRef.current?.click()}
                                        disabled={disabled}
                                        type="button"
                                    >
                                        <Camera className="text-foreground size-8" />
                                    </button>
                                </div>
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
                                    <p className="text-destructive mt-2.5 text-center text-sm">{errors.avatar}</p>
                                )}
                                <Button
                                    type="submit"
                                    className="mt-5 w-full"
                                    disabled={!values.avatar || !!errors.avatar}
                                >
                                    {t("common.save")}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </Modal>
        </div>
    );
};

export default ChangeAvatar;
