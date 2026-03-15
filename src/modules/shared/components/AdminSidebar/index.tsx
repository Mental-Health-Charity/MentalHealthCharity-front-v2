import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/useBreakpoint";
import { cn } from "@/lib/utils";
import {
    ArrowLeft,
    ClipboardCheck,
    ClipboardList,
    FileText,
    Flag,
    LayoutDashboard,
    Menu,
    MessageCircle,
    Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Permissions } from "../../constants";
import usePermissions from "../../hooks/usePermissions";

const drawerWidth = 240;

interface Props {
    open: boolean;
    handleToggle: () => void;
}

export const AdminSidebar = ({ handleToggle, open }: Props) => {
    const isMobile = useIsMobile();
    const { hasPermissions } = usePermissions();
    const { t } = useTranslation();

    const currentPath = window.location.pathname;

    const menuItems = [
        {
            text: t("admin.sidebar.dashboard"),
            icon: <LayoutDashboard className="size-5" />,
            to: "/admin/",
            permissions: Permissions.ADMIN_DASHBOARD,
        },
        {
            text: t("admin.sidebar.users"),
            icon: <Users className="size-5" />,
            to: "/admin/users/",
            permissions: Permissions.MANAGE_USERS,
        },
        {
            text: t("admin.sidebar.articles"),
            icon: <FileText className="size-5" />,
            to: "/admin/articles/",
            permissions: Permissions.MANAGE_ARTICLES,
        },
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
        {
            text: t("admin.sidebar.chats"),
            icon: <MessageCircle className="size-5" />,
            to: "/admin/chats/",
            permissions: Permissions.MANAGE_CHATS,
        },
    ];

    const sidebarContent = (
        <div>
            <h2 className="text-sidebar-foreground my-4 text-center text-lg font-semibold">
                {t("admin.sidebar.title")}
            </h2>
            <hr className="border-sidebar-border" />
            <nav aria-label="Admin navigation" className="mt-2 flex flex-col">
                {menuItems
                    .filter((item) => hasPermissions(item.permissions))
                    .map((item) => {
                        const isActive = currentPath === item.to;
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
                <a
                    href="/"
                    className="text-sidebar-foreground hover:bg-sidebar-accent flex items-center gap-3 border-l-3 border-transparent px-4 py-2.5 text-sm no-underline transition-colors"
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
