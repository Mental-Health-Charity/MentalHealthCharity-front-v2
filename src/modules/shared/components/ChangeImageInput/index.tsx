import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ImagePlus, Loader2, Pencil, Trash2, UploadCloud } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import resolveAssetUrl from "../../helpers/resolveAssetUrl";

interface Props {
    /** Currently selected file, or an existing (server) image URL. */
    value?: File | string;
    onChange: (image: File | undefined) => void;
    isLoading?: boolean;
    className?: string;
    /** Maximum accepted file size in bytes. Defaults to 5MB (matches backend). */
    maxSize?: number;
}

const ALLOWED_BANNER_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ACCEPTED_BANNER_TYPES = ALLOWED_BANNER_TYPES.join(",");
const DEFAULT_MAX_SIZE = 5 * 1024 * 1024; // 5MB, aligned with backend MAX_UPLOAD_SIZE

const formatSize = (bytes: number) => `${Math.round(bytes / (1024 * 1024))}MB`;

const ChangeImageInput = ({ onChange, value, isLoading, className, maxSize = DEFAULT_MAX_SIZE }: Props) => {
    const { t } = useTranslation();
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Build a preview URL. For a freshly picked File we create an object URL and
    // revoke it on change/unmount to avoid leaking memory; for an existing string
    // URL we resolve it against the API base.
    const previewUrl = useMemo(() => {
        if (value instanceof File) {
            return URL.createObjectURL(value);
        }
        if (typeof value === "string" && value) {
            return resolveAssetUrl(value);
        }
        return undefined;
    }, [value]);

    useEffect(() => {
        return () => {
            if (value instanceof File && previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [value, previewUrl]);

    const validateAndEmit = (file: File | null | undefined) => {
        if (!file) return;

        if (!ALLOWED_BANNER_TYPES.includes(file.type)) {
            toast.error(t("validation.invalid_file", { type: "JPG / PNG / WEBP" }));
            return;
        }

        if (file.size > maxSize) {
            toast.error(t("validation.max_size", { size: formatSize(maxSize) }));
            return;
        }

        onChange(file);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        validateAndEmit(file);
        // Allow re-selecting the same file again later.
        if (inputRef.current) inputRef.current.value = "";
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (isLoading) return;
        validateAndEmit(e.dataTransfer.files?.[0]);
    };

    const openPicker = () => {
        if (isLoading) return;
        inputRef.current?.click();
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(undefined);
        if (inputRef.current) inputRef.current.value = "";
    };

    const hasImage = !!previewUrl;

    return (
        <div
            role="button"
            tabIndex={0}
            aria-label={hasImage ? t("articles.form.change_banner") : t("articles.form.upload_banner")}
            aria-busy={isLoading}
            onClick={openPicker}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openPicker();
                }
            }}
            onDragOver={(e) => {
                e.preventDefault();
                if (!isLoading) setIsDragging(true);
            }}
            onDragLeave={(e) => {
                e.preventDefault();
                setIsDragging(false);
            }}
            onDrop={handleDrop}
            className={cn(
                "group border-border-brand bg-muted/40 relative flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[10px] border-2 border-dashed bg-cover bg-center transition-colors outline-none",
                "hover:border-primary focus-visible:border-ring focus-visible:ring-ring/30 focus-visible:ring-2",
                isDragging && "border-primary bg-primary/5",
                className
            )}
            style={previewUrl ? { backgroundImage: `url("${previewUrl}")` } : undefined}
        >
            <input
                type="file"
                hidden
                accept={ACCEPTED_BANNER_TYPES}
                ref={inputRef}
                onChange={handleInputChange}
                disabled={isLoading}
            />

            {/* Empty state */}
            {!hasImage && !isLoading && (
                <div className="text-muted-foreground pointer-events-none flex flex-col items-center gap-2 px-6 text-center">
                    <div className="bg-background/70 flex size-14 items-center justify-center rounded-full">
                        <ImagePlus className="text-primary size-7" />
                    </div>
                    <p className="text-foreground text-sm font-medium">{t("articles.form.banner_dropzone_title")}</p>
                    <p className="text-xs">{t("articles.form.banner_dropzone_hint", { size: formatSize(maxSize) })}</p>
                </div>
            )}

            {/* Drag overlay hint when an image already exists */}
            {isDragging && hasImage && (
                <div className="bg-primary/20 text-primary-foreground pointer-events-none absolute inset-0 flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-primary flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium">
                        <UploadCloud className="size-5" />
                        {t("articles.form.banner_drop_here")}
                    </div>
                </div>
            )}

            {/* Loading overlay */}
            {isLoading && (
                <div className="bg-background/60 absolute inset-0 flex items-center justify-center backdrop-blur-sm">
                    <Loader2 className="text-primary size-8 animate-spin" />
                </div>
            )}

            {/* Controls when an image is present */}
            {hasImage && !isLoading && (
                <div className="absolute right-3 bottom-3 flex gap-2">
                    <Button
                        type="button"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            openPicker();
                        }}
                        className="gap-1.5 shadow-md"
                    >
                        <Pencil className="size-4" />
                        {t("articles.form.change_banner")}
                    </Button>
                    <Button
                        type="button"
                        size="icon-sm"
                        variant="destructive"
                        aria-label={t("articles.form.remove_banner")}
                        onClick={handleRemove}
                        className="shadow-md"
                    >
                        <Trash2 className="size-4" />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ChangeImageInput;
