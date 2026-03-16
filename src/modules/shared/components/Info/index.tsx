import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
    children?: React.ReactNode;
    id: string;
    className?: string;
}

const Info = ({ children, id, className }: Props) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const isClosed = localStorage.getItem(`info_closed_${id}`);
        if (isClosed) {
            setVisible(false);
        }
    }, [id]);

    const handleClose = () => {
        setVisible(false);
        localStorage.setItem(`info_closed_${id}`, "true");
    };

    if (!visible) return null;

    return (
        <div
            className={cn(
                "border-info-brand/10 bg-info-brand/10 text-info-brand flex items-center justify-center gap-2 rounded-lg border-2 p-4 text-center text-base font-semibold sm:text-left sm:text-sm",
                className
            )}
        >
            {children}
            <button
                type="button"
                onClick={handleClose}
                className="text-info-brand ml-2 inline-flex shrink-0 items-center justify-center rounded-sm p-0.5 transition-opacity hover:opacity-70"
                aria-label="Close message"
            >
                <X size={16} />
            </button>
        </div>
    );
};

export default Info;
