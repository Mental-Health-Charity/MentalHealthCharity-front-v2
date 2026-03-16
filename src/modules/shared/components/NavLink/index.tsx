import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { NavlinkProps } from "../../types";

const reloadDocumentRoutes = ["/admin/"];

const NavLink = ({ name, to, fullWidth, className, indicator }: NavlinkProps) => {
    const location = useLocation();
    const isCurrentRoute = location.pathname === to;
    const { t } = useTranslation();

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
            {indicator && (
                <span
                    aria-label={t("common.navigation.aria.unread_messages")}
                    className="absolute -right-0 inline-flex h-2 w-2 items-center justify-center rounded-full bg-red-500 text-xs text-white"
                />
            )}
        </Link>
    );
};

export default NavLink;
