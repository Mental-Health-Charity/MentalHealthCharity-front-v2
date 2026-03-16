import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLElement> {
    subtitle?: string;
    title?: string;
    text?: string;
    titleClassName?: string;
    textAlign?: "left" | "center" | "right" | "justify";
}

const SimpleCard = ({ text, title, subtitle, className, titleClassName, textAlign, children, ...props }: Props) => {
    return (
        <article
            className={cn("bg-card border-border/50 rounded-xl border px-5 py-5 shadow-sm md:px-10 md:py-7", className)}
            style={{ textAlign }}
            {...props}
        >
            <div className="flex w-full flex-col gap-2.5">
                {subtitle && <p className="text-primary-brand text-lg font-semibold">{subtitle}</p>}
                {title && (
                    <p className={cn("text-foreground text-xl font-semibold md:text-2xl", titleClassName)}>{title}</p>
                )}
                {text && <p className="text-muted-foreground text-base leading-relaxed md:text-lg">{text}</p>}
            </div>
            {children}
        </article>
    );
};

export default SimpleCard;
