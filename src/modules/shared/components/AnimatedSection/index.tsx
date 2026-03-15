import { type ElementType, type HTMLAttributes, type ReactNode } from "react";
import { useInView } from "../../../../hooks/useInView";
import { cn } from "../../../../lib/utils";

interface AnimatedSectionProps extends HTMLAttributes<HTMLElement> {
    children: ReactNode;
    as?: ElementType;
    delay?: number;
    className?: string;
}

const AnimatedSection = ({
    children,
    as: Tag = "section",
    delay = 0,
    className,
    style,
    ...props
}: AnimatedSectionProps) => {
    const { ref, isInView } = useInView();

    return (
        <Tag
            ref={ref}
            className={cn(
                "transition-all duration-700 ease-out",
                isInView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
                className
            )}
            style={{ transitionDelay: `${delay}ms`, ...style }}
            {...props}
        >
            {children}
        </Tag>
    );
};

export default AnimatedSection;
