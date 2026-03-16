import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useField } from "formik";

interface FormCheckboxProps {
    name: string;
    label: React.ReactNode;
    disabled?: boolean;
    className?: string;
}

const FormCheckbox = ({ name, label, disabled = false, className }: FormCheckboxProps) => {
    const [field, meta, helpers] = useField({ name, type: "checkbox" });
    const hasError = meta.touched && Boolean(meta.error);

    return (
        <div className={cn("space-y-1", className)}>
            <div className="flex items-start gap-2">
                <Checkbox
                    id={name}
                    checked={field.value}
                    onCheckedChange={(checked) => helpers.setValue(checked)}
                    disabled={disabled}
                    className={cn(hasError && "border-danger-brand")}
                />
                <Label htmlFor={name} className="text-foreground cursor-pointer text-sm leading-snug">
                    {label}
                </Label>
            </div>
            {hasError && <p className="text-danger-brand text-sm">{meta.error}</p>}
        </div>
    );
};

export default FormCheckbox;
