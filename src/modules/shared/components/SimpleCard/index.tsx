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
            className={cn("border-border-brand bg-paper rounded-lg border-2 px-5 py-5 md:px-12 md:py-7", className)}
            style={{ textAlign }}
            {...props}
        >
            <div className="flex w-full flex-col gap-2.5">
                {subtitle && <p className="text-primary-brand text-xl font-semibold">{subtitle}</p>}
                {title && <p className={cn("text-foreground text-2xl font-semibold", titleClassName)}>{title}</p>}
                {text && <p className="text-foreground text-xl font-medium">{text}</p>}
            </div>
            {children}
        </article>
    );
};

export default SimpleCard;
