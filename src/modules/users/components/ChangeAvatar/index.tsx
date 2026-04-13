import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "../../../shared/components/Modal";

interface Props {
    avatar?: string;
    username: string;
    disabled?: boolean;
    onSubmit: (values: { avatar: File }) => void;
}

const MAX_AVATAR_SIZE = 1024 * 1024;

const ChangeAvatar = ({ avatar, username, disabled, onSubmit }: Props) => {
    const { t } = useTranslation();
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState(avatar || "");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!showModal) {
            setSelectedFile(null);
            setPreview(avatar || "");
            setError(null);
            if (avatarInputRef.current) {
                avatarInputRef.current.value = "";
            }
        }
    }, [avatar, showModal]);

    const validateFile = (file: File | null) => {
        if (!file) return null;
        if (!file.type.startsWith("image/")) return t("validation.invalid_file_type");
        if (file.size > MAX_AVATAR_SIZE) return t("validation.file_size_limit");
        return null;
    };

    const handleOpenModal = () => {
        setShowModal(true);
        setTimeout(() => avatarInputRef.current?.click(), 0);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        const validationError = validateFile(file);

        if (validationError || !file) {
            setSelectedFile(null);
            setPreview(avatar || "");
            setError(validationError || t("validation.required"));
            event.target.value = "";
            return;
        }

        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
        setError(null);
    };

    const handleSubmit = () => {
        if (!selectedFile) {
            setError(t("validation.required"));
            return;
        }

        onSubmit({ avatar: selectedFile });
        setShowModal(false);
    };

    return (
        <div className="relative">
            <Avatar className="size-[165px] rounded-md">
                <AvatarImage src={avatar} alt={username} />
                <AvatarFallback className="rounded-md text-3xl">{username?.charAt(0)?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <button
                className="absolute inset-0 flex items-center justify-center rounded-md opacity-0 transition-opacity hover:bg-black/50 hover:opacity-100"
                onClick={handleOpenModal}
                disabled={disabled}
                type="button"
            >
                <Camera className="text-foreground size-8" />
            </button>
            <Modal open={showModal} onClose={handleCloseModal} title={t("profile.change_avatar_title")}>
                <div>
                    <div className="relative flex w-full justify-center">
                        <Avatar className="size-[165px] rounded-md">
                            <AvatarImage src={preview || avatar} alt={username} />
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
                        onChange={handleFileChange}
                    />
                    {error && <p className="text-destructive mt-2.5 text-center text-sm">{error}</p>}
                    <Button type="button" className="mt-5 w-full" disabled={!selectedFile || !!error} onClick={handleSubmit}>
                        {t("common.save")}
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default ChangeAvatar;
