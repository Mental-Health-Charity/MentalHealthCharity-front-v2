import { cn } from "@/lib/utils";
import loading_icon from "../../../../assets/static/loading.svg";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "small" | "fullscreen";
    text?: string;
    size?: number;
}

const Loader = ({ variant = "small", text, size = 60, className, ...props }: Props) => {
    if (variant === "fullscreen") {
        return (
            <div
                className={cn("bg-background fixed inset-0 z-10 flex items-center justify-center", className)}
                {...props}
            >
                <div className="flex flex-col items-center gap-5">
                    <img src={loading_icon} alt="Loading icon" width="60" height="60" />
                    {text && <p className="text-foreground text-center text-xl">{text}</p>}
                </div>
            </div>
        );
    }

    return (
        <div className={cn("mx-auto", className)} style={{ height: size, width: size }} {...props}>
            <img src={loading_icon} alt="Loading icon" width="100%" height="auto" />
        </div>
    );
};

export default Loader;
