import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, LogOut, Menu, Moon, Sun, X } from "lucide-react";
import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../../../assets/static/logo_small.webp";
import { useTheme } from "../../../../hooks/useTheme";
import { useUser } from "../../../auth/components/AuthProvider";
import { getChatsQueryOptions } from "../../../chat/queries/getChatsQueryOptions";
import { Permissions } from "../../constants";
import usePermissions from "../../hooks/usePermissions";
import { NavlinkProps } from "../../types";
import NavLink from "../NavLink";
import ThemeToggle from "../ThemeToggle";

const Navbar = () => {
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
    const location = useLocation();
    const { user, logout } = useUser();
    const isAdminPanel = location.pathname.includes("/admin");
    const { data: chats } = useQuery(
        getChatsQueryOptions(
            { size: 50, page: 1 },
            {
                enabled: !!user,
                queryKey: ["chats"],
            }
        )
    );
    const { resolvedTheme, setTheme } = useTheme();

    const { hasPermissions } = usePermissions();
    const { t } = useTranslation();

    const pages: NavlinkProps[] = useMemo(() => {
        const basePages: NavlinkProps[] = [
            { name: t("common.navigation.home"), to: "/" },
            { name: t("common.navigation.articles"), to: "/articles" },
            { name: t("common.navigation.donations"), to: "/donations" },
            {
                name: t("common.navigation.admin"),
                to: "/admin/",
                permissions: Permissions.ADMIN_DASHBOARD,
            },
        ];

        if (chats && chats.total > 0) {
            basePages.push({
                name: t("common.navigation.chat"),
                to: "/chat",
                indicator: chats.items.some((chat) => chat.unread_count > 0),
            });
        }

        return basePages;
    }, [chats, t]);

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
                    className="text-muted-foreground hover:bg-muted hover:text-foreground inline-flex items-center justify-center rounded-lg p-2 transition-colors md:hidden"
                    onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                    aria-label="Toggle navigation menu"
                    aria-expanded={isDrawerOpen}
                >
                    {isDrawerOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                </button>

                {/* Mobile Sheet */}
                <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                    <SheetContent
                        side="right"
                        showCloseButton={false}
                        className="flex w-[280px] flex-col gap-0 p-0 sm:max-w-[280px]"
                    >
                        {/* Mobile header */}
                        <div className="flex items-center justify-between px-5 py-4">
                            <Link to="/" className="flex items-center gap-2 no-underline">
                                <img src={Logo} alt="Logo" className="w-8" />
                                <span className="text-foreground text-base font-bold">Peryskop</span>
                            </Link>
                            <button
                                onClick={() => setIsDrawerOpen(false)}
                                className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg p-1.5 transition-colors"
                                aria-label="Close menu"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        <Separator />

                        {/* Navigation links */}
                        <div className="flex flex-col px-3 py-3">
                            {filteredPages.map(({ name, to }) => {
                                const isActive = location.pathname === to;
                                return (
                                    <Link
                                        key={to}
                                        to={to}
                                        className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium no-underline transition-colors ${
                                            isActive
                                                ? "bg-primary-brand/10 text-primary-brand"
                                                : "text-foreground hover:bg-muted"
                                        }`}
                                    >
                                        {name}
                                        <ChevronRight
                                            className={`size-4 ${isActive ? "text-primary-brand" : "text-muted-foreground"}`}
                                        />
                                    </Link>
                                );
                            })}
                        </div>

                        <Separator />

                        {/* Theme toggle */}
                        <div className="px-3 py-3">
                            <button
                                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                                className="text-foreground hover:bg-muted flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
                            >
                                {resolvedTheme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
                                {resolvedTheme === "dark"
                                    ? t("common.light_mode", {
                                          defaultValue: "Light mode",
                                      })
                                    : t("common.dark_mode", {
                                          defaultValue: "Dark mode",
                                      })}
                            </button>
                        </div>

                        {/* Bottom: user section */}
                        <div className="mt-auto">
                            <Separator />
                            {user ? (
                                <div className="flex flex-col gap-1 px-3 py-3">
                                    <Link
                                        to={`/profile/${user.id}`}
                                        className="hover:bg-muted flex items-center gap-3 rounded-lg px-3 py-2.5 no-underline transition-colors"
                                    >
                                        <Avatar className="size-8 rounded-full">
                                            <AvatarImage src={user.chat_avatar_url || undefined} alt={user.full_name} />
                                            <AvatarFallback className="bg-primary-brand/15 text-primary-brand rounded-full text-xs">
                                                {user.full_name?.charAt(0)?.toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-foreground truncate text-sm font-medium">
                                                {user.full_name}
                                            </p>
                                            <p className="text-muted-foreground truncate text-xs">{user.email}</p>
                                        </div>
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="text-destructive hover:bg-destructive/10 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
                                    >
                                        <LogOut className="size-4" />
                                        {t("common.navigation.logout")}
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2 px-5 py-4">
                                    <Link to="/login" className="no-underline">
                                        <Button className="w-full">{t("common.join_us")}</Button>
                                    </Link>
                                    <Link to="/auth/register" className="no-underline">
                                        <Button variant="outline" className="w-full">
                                            {t("common.sign_up")}
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </SheetContent>
                </Sheet>

                {/* Desktop Menu */}
                <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 md:flex">
                    {filteredPages.map((props) => (
                        <NavLink key={props.to} {...props} />
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
                                        render={<Link to={`/profile/${user.id}`} className="no-underline" />}
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
