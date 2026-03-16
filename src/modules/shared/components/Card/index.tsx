import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    subtitle?: string;
    variant?: "default" | "secondary";
    textAlign?: "left" | "center" | "right" | "justify";
}

const Card = ({ title, subtitle, variant = "default", textAlign, className, children, ...props }: Props) => {
    return (
        <div
            className={cn(
                "bg-card text-foreground border-border/50 rounded-xl border p-6 shadow-sm sm:p-8",
                variant === "secondary" && "bg-bg-raised",
                className
            )}
            style={{ textAlign, ...props.style }}
            {...props}
        >
            {title && <h2 className="text-2xl font-semibold md:text-3xl">{title}</h2>}
            {subtitle && <h3 className="text-muted-foreground mt-2 text-lg md:text-xl">{subtitle}</h3>}
            <div>{children}</div>
        </div>
    );
};

export default Card;
