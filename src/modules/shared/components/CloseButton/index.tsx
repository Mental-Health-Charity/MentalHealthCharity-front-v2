import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface CloseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    size?: number;
}

const CloseButton = ({ className, size = 20, ...props }: CloseButtonProps) => {
    return (
        <button
            type="button"
            className={cn(
                "bg-danger-brand inline-flex items-center justify-center rounded-sm p-0.5 text-white transition-opacity hover:opacity-80",
                className
            )}
            {...props}
        >
            <X size={size} />
        </button>
    );
};

export default CloseButton;
