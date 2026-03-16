import { cn } from "@/lib/utils";
import { Link, LinkProps } from "react-router-dom";

interface InternalLinkProps extends LinkProps {
    color?: "primary" | "secondary";
}

const InternalLink = ({ color = "primary", className, ...props }: InternalLinkProps) => {
    return (
        <Link
            className={cn(
                "font-ubuntu no-underline transition-colors hover:underline",
                color === "secondary" ? "text-text-primary" : "text-primary-brand-dark",
                className
            )}
            {...props}
        />
    );
};

export default InternalLink;

interface ExternalLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    color?: "primary" | "secondary";
}

export const ExternalLink = ({ color = "primary", className, ...props }: ExternalLinkProps) => {
    return (
        <a
            className={cn(
                "font-ubuntu text-base no-underline transition-colors hover:underline",
                color === "secondary" ? "text-text-primary" : "text-primary-brand-dark",
                className
            )}
            {...props}
        />
    );
};
