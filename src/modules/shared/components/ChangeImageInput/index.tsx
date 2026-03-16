import { Button } from "@/components/ui/button";
import { Image, Loader2, Trash2 } from "lucide-react";
import { useRef } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

interface Props {
    value?: File;
    onChange: (image: File | undefined) => void;
    isLoading?: boolean;
}

const ChangeImageInput = ({ onChange, value, isLoading }: Props) => {
    const { t } = useTranslation();
    const inputRef = useRef<HTMLInputElement>(null);

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

        if (!file.type.includes("image/")) {
            toast.error(t("validation.invalid_file", { type: "webp/jpeg/jpg/png/svg" }));
            return;
        }

        onChange(file);
    };

    return (
        <>
            <input type="file" hidden accept="image/*" ref={inputRef} onChange={handleChange} />
            {value && (
                <Button
                    variant="destructive"
                    disabled={isLoading}
                    onClick={() => {
                        onChange(undefined);
                        inputRef.current!.value = "";
                    }}
                    className="gap-2.5"
                >
                    <Trash2 className="size-6" />
                </Button>
            )}
            <Button
                disabled={isLoading}
                onClick={() => inputRef.current?.click()}
                className="z-[1] gap-2.5"
                style={{ opacity: value ? 0.8 : 1 }}
            >
                {isLoading ? <Loader2 className="size-6 animate-spin" /> : <Image className="size-6" />}
                {value ? t("articles.form.change_banner") : t("articles.form.upload_banner")}
            </Button>
        </>
    );
};

export default ChangeImageInput;
