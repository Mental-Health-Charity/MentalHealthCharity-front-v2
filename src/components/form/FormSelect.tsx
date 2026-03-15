import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useField } from "formik";

interface SelectOption {
    value: string;
    label: string;
}

interface FormSelectProps {
    name: string;
    label?: string;
    placeholder?: string;
    options: SelectOption[];
    disabled?: boolean;
    className?: string;
    fullWidth?: boolean;
}

const FormSelect = ({
    name,
    label,
    placeholder,
    options,
    disabled = false,
    className,
    fullWidth = true,
}: FormSelectProps) => {
    const [field, meta, helpers] = useField(name);
    const hasError = meta.touched && Boolean(meta.error);

    return (
        <div className={cn("space-y-2", fullWidth && "w-full", className)}>
            {label && (
                <Label htmlFor={name} className={cn(hasError && "text-danger-brand")}>
                    {label}
                </Label>
            )}
            <Select
                value={field.value?.toString() ?? ""}
                onValueChange={(value) => helpers.setValue(value)}
                disabled={disabled}
            >
                <SelectTrigger
                    id={name}
                    className={cn(
                        "bg-card text-foreground",
                        fullWidth && "w-full",
                        hasError && "border-danger-brand focus:ring-danger-brand"
                    )}
                    onBlur={() => helpers.setTouched(true)}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {hasError && <p className="text-danger-brand text-sm">{meta.error}</p>}
        </div>
    );
};

export default FormSelect;
