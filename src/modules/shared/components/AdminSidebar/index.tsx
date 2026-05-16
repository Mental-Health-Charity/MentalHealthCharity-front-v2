import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/useBreakpoint";
import { cn } from "@/lib/utils";
import {
    ArrowLeft,
    Bell,
    ClipboardCheck,
    ClipboardList,
    FileText,
    Flag,
    LayoutDashboard,
    Menu,
    MessageCircle,
    PlusCircle,
    UserCheck,
    Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Permissions } from "../../constants";
import usePermissions from "../../hooks/usePermissions";

const drawerWidth = 240;

interface Props {
    open: boolean;
    handleToggle: () => void;
}

type MenuItem = {
    text: string;
    icon: ReactNode;
    to: string;
    permissions: Permissions;
};

type MenuSection = {
    title: string;
    items: MenuItem[];
};

const normalizePath = (path: string) => path.replace(/\/+$/, "") || "/";

export const AdminSidebar = ({ handleToggle, open }: Props) => {
    const isMobile = useIsMobile();
    const { hasPermissions } = usePermissions();
    const { t } = useTranslation();

    const currentPath = window.location.pathname;

    const menuSections: MenuSection[] = [
        {
            title: t("admin.sidebar.sections.overview", { defaultValue: "Przegląd" }),
            items: [
                {
                    text: t("admin.sidebar.dashboard"),
                    icon: <LayoutDashboard className="size-5" />,
                    to: "/admin/",
                    permissions: Permissions.ADMIN_DASHBOARD,
                },
            ],
        },
        {
            title: t("admin.sidebar.sections.support", { defaultValue: "Obsługa wsparcia" }),
            items: [
                {
                    text: t("admin.sidebar.matching_mentees", { defaultValue: "Osoby w kryzysie" }),
                    icon: <UserCheck className="size-5" />,
                    to: "/admin/matching/mentees",
                    permissions: Permissions.MANAGE_CHATS,
                },
                {
                    text: t("admin.sidebar.matching_volunteers", { defaultValue: "Wolontariusze" }),
                    icon: <Users className="size-5" />,
                    to: "/admin/matching/volunteers",
                    permissions: Permissions.MANAGE_CHATS,
                },
                {
                    text: t("admin.sidebar.matching_alerts", { defaultValue: "Alerty parowania" }),
                    icon: <Bell className="size-5" />,
                    to: "/admin/matching/alerts",
                    permissions: Permissions.MANAGE_CHATS,
                },
                {
                    text: t("admin.sidebar.chats"),
                    icon: <MessageCircle className="size-5" />,
                    to: "/admin/chats/",
                    permissions: Permissions.MANAGE_CHATS,
                },
            ],
        },
        {
            title: t("admin.sidebar.sections.intake", { defaultValue: "Formularze i zgłoszenia" }),
            items: [
                {
                    text: t("admin.sidebar.mentee_forms"),
                    icon: <ClipboardList className="size-5" />,
                    to: "/admin/forms/mentee",
                    permissions: Permissions.MANAGE_MENTEE_FORMS,
                },
                {
                    text: t("admin.sidebar.volunteer_forms"),
                    icon: <ClipboardCheck className="size-5" />,
                    to: "/admin/forms/volunteer",
                    permissions: Permissions.MANAGE_VOLUNTEER_FORMS,
                },
                {
                    text: t("admin.sidebar.reports"),
                    icon: <Flag className="size-5" />,
                    to: "/admin/reports/",
                    permissions: Permissions.MANAGE_REPORTS,
                },
            ],
        },
        {
            title: t("admin.sidebar.sections.content", { defaultValue: "Treści" }),
            items: [
                {
                    text: t("admin.sidebar.articles"),
                    icon: <FileText className="size-5" />,
                    to: "/admin/articles/",
                    permissions: Permissions.MANAGE_ARTICLES,
                },
                {
                    text: t("articles.add_article"),
                    icon: <PlusCircle className="size-5" />,
                    to: "/articles/dashboard",
                    permissions: Permissions.CREATE_ARTICLE,
                },
            ],
        },
        {
            title: t("admin.sidebar.sections.admin", { defaultValue: "Administracja" }),
            items: [
                {
                    text: t("admin.sidebar.users"),
                    icon: <Users className="size-5" />,
                    to: "/admin/users/",
                    permissions: Permissions.MANAGE_USERS,
                },
            ],
        },
    ];

    const sidebarContent = (
        <div>
            <h2 className="text-sidebar-foreground my-4 text-center text-lg font-semibold">
                {t("admin.sidebar.title")}
            </h2>
            <hr className="border-sidebar-border" />
            <nav aria-label="Admin navigation" className="mt-3 flex flex-col pb-3">
                {menuSections.map((section) => {
                    const visibleItems = section.items.filter((item) => hasPermissions(item.permissions));

                    if (visibleItems.length === 0) {
                        return null;
                    }

                    return (
                        <section key={section.title} className="mb-4 last:mb-2">
                            <h3 className="text-sidebar-foreground/55 px-4 pb-1.5 text-[11px] font-semibold tracking-wide uppercase">
                                {section.title}
                            </h3>
                            <div className="flex flex-col">
                                {visibleItems.map((item) => {
                                    const isActive = normalizePath(currentPath) === normalizePath(item.to);
                                    return (
                                        <Link
                                            key={item.to}
                                            to={item.to}
                                            aria-current={isActive ? "page" : undefined}
                                            className={cn(
                                                "text-sidebar-foreground flex items-center gap-3 border-l-3 border-transparent px-4 py-2.5 text-sm no-underline transition-colors",
                                                isActive
                                                    ? "bg-sidebar-accent border-l-sidebar-primary font-medium"
                                                    : "hover:bg-sidebar-accent"
                                            )}
                                        >
                                            <span className="text-sidebar-foreground/70">{item.icon}</span>
                                            <span>{item.text}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </section>
                    );
                })}
                <a
                    href="/"
                    className="text-sidebar-foreground hover:bg-sidebar-accent mt-1 flex items-center gap-3 border-l-3 border-transparent px-4 py-2.5 text-sm no-underline transition-colors"
                >
                    <ArrowLeft className="text-sidebar-foreground/70 size-5" />
                    <span>{t("admin.sidebar.back")}</span>
                </a>
            </nav>
        </div>
    );

    return (
        <div className="flex">
            {isMobile && (
                <div className="bg-card fixed top-0 left-0 z-50 flex w-full items-center justify-between px-4 py-1.5">
                    <button
                        className="text-foreground hover:bg-muted rounded-md p-2 transition-colors"
                        onClick={handleToggle}
                        aria-label="Toggle admin sidebar"
                        aria-expanded={open}
                    >
                        <Menu className="size-6" />
                    </button>
                    <h2 className="text-lg font-semibold">{t("admin.sidebar.title")}</h2>
                </div>
            )}

            {isMobile ? (
                <Sheet open={open} onOpenChange={handleToggle}>
                    <SheetContent
                        side="left"
                        showCloseButton={false}
                        className="bg-sidebar p-0"
                        style={{ width: drawerWidth }}
                    >
                        {sidebarContent}
                    </SheetContent>
                </Sheet>
            ) : (
                <aside
                    aria-label="Admin navigation"
                    className="bg-sidebar text-sidebar-foreground shrink-0 overflow-y-auto"
                    style={{ width: drawerWidth }}
                >
                    {sidebarContent}
                </aside>
            )}
        </div>
    );
};

export default AdminSidebar;
