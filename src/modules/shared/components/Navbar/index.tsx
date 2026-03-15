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
import ThemeToggle from "../ThemeToggle";

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
        { name: t("common.navigation.donations"), path: "/donations" },
        { name: t("common.navigation.admin"), path: "/admin/", permissions: Permissions.ADMIN_DASHBOARD },
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
        <header className="bg-card/95 border-border/60 sticky top-0 z-50 w-full border-b px-4 py-2 backdrop-blur-md">
            <nav className="relative mx-auto flex w-full max-w-[1200px] items-center justify-between">
                {/* Logo + brand name */}
                <Link to="/" className="flex items-center gap-2.5 no-underline">
                    <img src={Logo} alt="Logo" className="w-10" />
                    <span className="text-foreground hidden text-lg font-bold sm:inline">Peryskop</span>
                </Link>

                {/* Mobile Menu Toggle */}
                <button
                    className="text-muted-foreground hover:bg-muted hover:text-foreground inline-flex items-center justify-center rounded-md p-2 transition-colors md:hidden"
                    onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                    aria-label="Toggle navigation menu"
                    aria-expanded={isDrawerOpen}
                >
                    {isDrawerOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                </button>

                {/* Mobile Sheet */}
                <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                    <SheetContent
                        side="top"
                        showCloseButton={false}
                        className="mt-[56px] flex min-h-[50vh] flex-col justify-between p-4"
                    >
                        <div className="flex flex-col gap-1">
                            {filteredPages.map(({ name, path }) => (
                                <div key={path}>
                                    <NavLink fullWidth name={name} to={path} />
                                </div>
                            ))}
                        </div>

                        {user ? (
                            <div className="mt-auto">
                                <NavLink to={`/profile/${user.id}`} name={t("common.navigation.my_account")} />
                                <button
                                    onClick={logout}
                                    className="bg-destructive hover:bg-destructive/80 mt-2 w-full rounded-lg px-4 py-3 text-sm font-medium text-white transition-colors"
                                >
                                    {t("common.navigation.logout")}
                                </button>
                            </div>
                        ) : (
                            <div className="mt-auto flex flex-col gap-2.5">
                                <Link to="/login">
                                    <Button className="w-full py-3">{t("common.join_us")}</Button>
                                </Link>
                                <Link to="/auth/register">
                                    <Button variant="outline" className="w-full py-3">
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
                <div className="hidden items-center gap-2 md:flex">
                    <ThemeToggle />
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
                                                <AvatarFallback className="bg-primary-brand/15 text-primary-brand rounded-md">
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
