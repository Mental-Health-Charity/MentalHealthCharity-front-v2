import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

interface Props {
    name: string;
    to: string;
    fullWidth?: boolean;
    className?: string;
}

const reloadDocumentRoutes = ["/admin/"];

const NavLink = ({ name, to, fullWidth, className }: Props) => {
    const location = useLocation();
    const isCurrentRoute = location.pathname === to;

    const reloadDocument = useMemo(() => reloadDocumentRoutes.includes(to), [to]);

    return (
        <Link
            to={to}
            reloadDocument={reloadDocument}
            aria-current={isCurrentRoute ? "page" : undefined}
            className={cn(
                "text-foreground relative block px-3 py-2 text-xl font-semibold whitespace-nowrap no-underline transition-colors duration-200",
                isCurrentRoute ? "text-primary-brand" : "hover:text-primary-brand opacity-90 hover:opacity-100",
                fullWidth && "w-full",
                "after:absolute after:bottom-0 after:left-0 after:block after:h-[2px] after:rounded-full after:transition-all after:duration-300",
                isCurrentRoute
                    ? "after:bg-primary-brand after:w-full"
                    : "hover:after:bg-primary-brand/50 after:w-0 after:bg-transparent hover:after:w-full",
                className
            )}
        >
            {name}
        </Link>
    );
};

export default NavLink;
