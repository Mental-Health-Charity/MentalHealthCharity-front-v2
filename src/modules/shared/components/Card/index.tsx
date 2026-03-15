import { useIsMobile } from "@/hooks/useBreakpoint";
import { cn } from "@/lib/utils";
import dots from "../../../../assets/static/card_dots.svg";
import dots_three from "../../../../assets/static/card_dots_three.svg";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    subtitle?: string;
    variant?: "default" | "secondary";
    textAlign?: "left" | "center" | "right" | "justify";
}

const Card = ({ title, subtitle, variant = "default", textAlign, className, children, ...props }: Props) => {
    const isMobile = useIsMobile();

    return (
        <div
            className={cn(
                "bg-paper text-foreground relative z-[1] w-fit rounded-lg p-11 shadow-[0_4px_13px_rgba(0,0,0,0.25)] sm:p-5",
                className
            )}
            style={{ textAlign, ...props.style }}
            {...props}
        >
            {/* Dot decoration top-right (default variant only) */}
            {variant === "default" && (
                <div
                    className="absolute top-5 right-5 h-[15px] w-[60px] bg-no-repeat"
                    style={{ backgroundImage: `url("${dots_three}")` }}
                />
            )}

            {title && <h2 className={cn("font-medium", isMobile ? "text-2xl" : "text-3xl")}>{title}</h2>}
            {subtitle && <h3 className={cn(isMobile ? "text-xl" : "text-2xl")}>{subtitle}</h3>}
            <div>{children}</div>

            {/* Dot decoration (bottom-left or right-center) */}
            <div
                className={cn(
                    "absolute hidden h-[86px] w-[86px] bg-no-repeat min-[650px]:block",
                    variant === "default" ? "-bottom-[43px] -left-[43px]" : "top-1/2 right-[-40px] -translate-y-1/2"
                )}
                style={{ backgroundImage: `url("${dots}")` }}
            />
        </div>
    );
};

export default Card;
