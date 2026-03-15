import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { Menu, X } from "lucide-react";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Logo from "../../../../assets/static/logo_small.webp";
import { useUser } from "../../../auth/components/AuthProvider";
import { getChatsQueryOptions } from "../../../chat/queries/getChatsQueryOptions";
import { Permissions } from "../../constants";
import usePermissions from "../../hooks/usePermissions";
import NavLink from "../NavLink";

const Navbar = () => {
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
    const location = window.location.pathname;
    const { user, logout } = useUser();
    const isAdminPanel = window.location.pathname.includes("/admin");
    const { data: chats } = useQuery(
        getChatsQueryOptions(
            { size: 50, page: 1 },
            {
                enabled: !!user,
                queryKey: ["chats"],
            }
        )
    );

    const { hasPermissions } = usePermissions();
    const { t } = useTranslation();

    const pages = [
        { name: t("common.navigation.home"), path: "/" },
        { name: t("common.navigation.articles"), path: "/articles" },
        { name: t("common.navigation.admin"), path: "/admin/", permissions: Permissions.ADMIN_DASHBOARD },
        ...(!user ? [{ name: t("common.navigation.chat_with_volunteer"), path: "/about-chat" }] : []),
    ];

    if (chats && chats.total > 0) {
        pages.push({ name: t("common.navigation.chat"), path: "/chat" });
    }

    useEffect(() => {
        setIsDrawerOpen(false);
    }, [location]);

    if (isAdminPanel) return null;

    const filteredPages = pages.filter((page) => !page.permissions || hasPermissions(page.permissions));

    return (
        <header className="bg-card fixed top-2.5 left-1/2 z-[100] w-full max-w-[1600px] -translate-x-1/2 rounded-[10px] px-3 py-2 shadow-[5px_2px_2px_rgba(0,0,0,0.1)] transition-all duration-1000 max-sm:top-0 max-sm:rounded-none">
            <nav className="relative flex w-full items-center justify-between">
                {/* Logo */}
                <Link to="/">
                    <div className="flex items-center gap-4">
                        <img src={Logo} alt="Logo" className="w-10" />
                    </div>
                </Link>

                {/* Mobile Menu Toggle */}
                <button
                    className="text-muted-foreground hover:bg-muted hover:text-foreground inline-flex items-center justify-center rounded-md p-2 transition-colors md:hidden"
                    onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                >
                    {isDrawerOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                </button>

                {/* Mobile Sheet */}
                <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                    <SheetContent
                        side="top"
                        showCloseButton={false}
                        className="mt-[70px] flex min-h-[50vh] flex-col justify-between p-4"
                    >
                        <div className="flex flex-col gap-2">
                            {filteredPages.map(({ name, path }) => (
                                <div key={path} className="bg-border-brand/30 rounded-md">
                                    <NavLink fullWidth name={name} to={path} />
                                </div>
                            ))}
                        </div>

                        {user ? (
                            <div className="mt-auto">
                                <NavLink to={`/profile/${user.id}`} name={t("common.navigation.my_account")} />
                                <button
                                    onClick={logout}
                                    className="bg-destructive hover:bg-destructive/80 mt-2 w-full rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
                                >
                                    {t("common.navigation.logout")}
                                </button>
                            </div>
                        ) : (
                            <div className="mt-auto flex flex-col gap-2.5">
                                <Link to="/login">
                                    <Button className="w-full">{t("common.join_us")}</Button>
                                </Link>
                                <Link to="/auth/register">
                                    <Button variant="outline" className="w-full">
                                        {t("common.sign_up")}
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </SheetContent>
                </Sheet>

                {/* Desktop Menu */}
                <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 md:flex">
                    {filteredPages.map(({ name, path }) => (
                        <NavLink key={path} name={name} to={path} />
                    ))}
                </div>

                {/* User Menu (Desktop) */}
                <div className="hidden md:block">
                    {user ? (
                        <TooltipProvider>
                            <DropdownMenu>
                                <Tooltip>
                                    <TooltipTrigger render={<span />}>
                                        <DropdownMenuTrigger
                                            render={
                                                <button className="bg-background hover:bg-muted flex items-center gap-2 rounded-lg p-2 transition-colors" />
                                            }
                                        >
                                            <span className="text-foreground text-sm font-medium">
                                                {user.full_name}
                                            </span>
                                            <Avatar className="rounded-md">
                                                <AvatarImage
                                                    src={user.chat_avatar_url || undefined}
                                                    alt={user.full_name}
                                                />
                                                <AvatarFallback className="rounded-md">
                                                    {user.full_name?.charAt(0)?.toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </DropdownMenuTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>{user.email}</TooltipContent>
                                </Tooltip>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                        render={<a href={`/profile/${user.id}`} className="no-underline" />}
                                    >
                                        {t("common.navigation.my_account")}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={logout}>
                                        {t("common.navigation.logout")}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TooltipProvider>
                    ) : (
                        <div className="flex gap-4">
                            <Link to="/login">
                                <Button>{t("common.join_us")}</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
