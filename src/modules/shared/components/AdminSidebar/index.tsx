import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/useBreakpoint";
import { cn } from "@/lib/utils";
import { ArrowLeft, Home, LayoutDashboard, Menu, Settings } from "lucide-react";
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

    const currentPath = window.location.pathname;

    const menuItems = [
        {
            text: "Dashboard",
            icon: <LayoutDashboard className="size-5" />,
            to: "/admin/",
            permissions: Permissions.ADMIN_DASHBOARD,
        },
        {
            text: "Użytkownicy",
            icon: <Home className="size-5" />,
            to: "/admin/users/",
            permissions: Permissions.MANAGE_USERS,
        },
        {
            text: "Artykuły",
            icon: <Settings className="size-5" />,
            to: "/admin/articles/",
            permissions: Permissions.MANAGE_ARTICLES,
        },
        {
            text: "Formularze podopiecznych",
            icon: <Settings className="size-5" />,
            to: "/admin/forms/mentee",
            permissions: Permissions.MANAGE_MENTEE_FORMS,
        },
        {
            text: "Formularze wolontariuszy",
            icon: <Settings className="size-5" />,
            to: "/admin/forms/volunteer",
            permissions: Permissions.MANAGE_VOLUNTEER_FORMS,
        },
        {
            text: "Zgłoszenia",
            icon: <Settings className="size-5" />,
            to: "/admin/reports/",
            permissions: Permissions.MANAGE_REPORTS,
        },
        {
            text: "Czaty",
            icon: <Settings className="size-5" />,
            to: "/admin/chats/",
            permissions: Permissions.MANAGE_CHATS,
        },
    ];

    const sidebarContent = (
        <div>
            <h2 className="text-sidebar-foreground my-4 text-center text-lg font-semibold">Fundacja Peryskop</h2>
            <hr className="border-sidebar-border" />
            <nav className="mt-2 flex flex-col">
                {menuItems
                    .filter((item) => hasPermissions(item.permissions))
                    .map((item) => (
                        <Link
                            key={item.text}
                            to={item.to}
                            className={cn(
                                "text-sidebar-foreground hover:bg-sidebar-accent flex items-center gap-3 rounded-md px-4 py-2.5 text-sm no-underline transition-colors",
                                currentPath === item.to && "pointer-events-none opacity-50"
                            )}
                        >
                            <span className="text-white">{item.icon}</span>
                            <span>{item.text}</span>
                        </Link>
                    ))}
                <a
                    href="/"
                    className="text-sidebar-foreground hover:bg-sidebar-accent flex items-center gap-3 rounded-md px-4 py-2.5 text-sm no-underline transition-colors"
                >
                    <ArrowLeft className="size-5 text-white" />
                    <span>Powrót</span>
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
                    >
                        <Menu className="size-6" />
                    </button>
                    <h2 className="text-lg font-semibold">Fundacja Peryskop</h2>
                </div>
            )}

            {isMobile ? (
                <Sheet open={open} onOpenChange={handleToggle}>
                    <SheetContent
                        side="left"
                        showCloseButton={false}
                        className="bg-dark p-0"
                        style={{ width: drawerWidth }}
                    >
                        {sidebarContent}
                    </SheetContent>
                </Sheet>
            ) : (
                <aside
                    className="bg-dark text-sidebar-foreground shrink-0 overflow-y-auto"
                    style={{ width: drawerWidth }}
                >
                    {sidebarContent}
                </aside>
            )}
        </div>
    );
};

export default AdminSidebar;
