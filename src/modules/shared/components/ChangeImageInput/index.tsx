import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import ImageIcon from "@mui/icons-material/Image";
import toast from "react-hot-toast";
import { useRef } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import useTheme from "../../../../theme";

interface Props {
    value?: File;
    onChange: (image: File | undefined) => void;
}

const ChangeImageInput = ({ onChange, value }: Props) => {
    const { t } = useTranslation();
    const inputRef = useRef<HTMLInputElement>(null);
    const theme = useTheme();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const MAX_BANNER_SIZE = 1024 * 1024 * 3;
        const file = e.target.files && e.target.files[0];

        if (!file) {
            inputRef.current!.value = "";
            return;
        }

        if (file.size > MAX_BANNER_SIZE) {
            toast.error(t("validation.max_size", { size: "3MB" }));
            return;
        }

        if (file.type !== "image/webp") {
            toast.error(t("validation.invalid_file", { type: "webp" }));
            return;
        }

        onChange(file);
    };

    return (
        <>
            <input
                type="file"
                hidden
                accept="image/*"
                ref={inputRef}
                onChange={handleChange}
            />
            {value && (
                <Button
                    variant="contained"
                    onClick={() => {
                        onChange(undefined);
                        inputRef.current!.value = "";
                    }}
                    sx={{
                        backgroundColor: theme.palette.colors.danger,
                        gap: "10px",
                    }}
                >
                    <DeleteIcon fontSize="large" />
                </Button>
            )}
            <Button
                variant="contained"
                onClick={() => inputRef.current?.click()}
                sx={{
                    gap: "10px",
                    zIndex: 1,
                    opacity: value ? 0.8 : 1,

                    "&:hover": {
                        opacity: 1,
                    },
                }}
            >
                <ImageIcon fontSize="large" />
                {value
                    ? t("articles.form.change_banner")
                    : t("articles.form.upload_banner")}
            </Button>
        </>
    );
};

export default ChangeImageInput;
