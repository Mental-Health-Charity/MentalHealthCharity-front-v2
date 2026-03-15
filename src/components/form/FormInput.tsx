import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useField } from "formik";

interface FormInputProps {
    name: string;
    label?: string;
    type?: string;
    placeholder?: string;
    multiline?: boolean;
    rows?: number;
    disabled?: boolean;
    className?: string;
    maxLength?: number;
    fullWidth?: boolean;
    autoFocus?: boolean;
}

const FormInput = ({
    name,
    label,
    type = "text",
    placeholder,
    multiline = false,
    rows = 4,
    disabled = false,
    className,
    maxLength,
    fullWidth = true,
    autoFocus,
}: FormInputProps) => {
    const [field, meta] = useField(name);
    const hasError = meta.touched && Boolean(meta.error);

    return (
        <div className={cn("space-y-2", fullWidth && "w-full", className)}>
            {label && (
                <Label htmlFor={name} className={cn(hasError && "text-danger-brand")}>
                    {label}
                </Label>
            )}
            {multiline ? (
                <Textarea
                    id={name}
                    placeholder={placeholder}
                    rows={rows}
                    disabled={disabled}
                    maxLength={maxLength}
                    autoFocus={autoFocus}
                    className={cn(
                        "bg-paper text-foreground",
                        hasError && "border-danger-brand focus-visible:ring-danger-brand"
                    )}
                    {...field}
                />
            ) : (
                <Input
                    id={name}
                    type={type}
                    placeholder={placeholder}
                    disabled={disabled}
                    maxLength={maxLength}
                    autoFocus={autoFocus}
                    className={cn(
                        "bg-paper text-foreground",
                        hasError && "border-danger-brand focus-visible:ring-danger-brand"
                    )}
                    {...field}
                />
            )}
            {hasError && <p className="text-danger-brand text-sm">{meta.error}</p>}
        </div>
    );
};

export default FormInput;
