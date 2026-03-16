import { cn } from "@/lib/utils";
import { Link, LinkProps } from "react-router-dom";

interface StyledLinkProps extends LinkProps {
    color?: string;
}

export const StyledLink = ({ color, className, style, ...props }: StyledLinkProps) => {
    return (
        <Link
            className={cn("font-ubuntu no-underline hover:underline", className)}
            style={{ color: color || "var(--color-primary-brand-dark)", ...style }}
            {...props}
        />
    );
};

interface StyledExternalLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    color?: "primary" | "secondary";
}

export const StyledExternalLink = ({ color = "primary", className, ...props }: StyledExternalLinkProps) => {
    return (
        <a
            className={cn(
                "font-ubuntu no-underline hover:underline",
                color === "secondary" ? "text-accent-brand" : "text-primary-brand-dark",
                className
            )}
            {...props}
        />
    );
};
