import { useState } from "react";
import BgImage from "../../../../assets/static/admin_panel_bg.svg";
import { AdminSidebar } from "../AdminSidebar";

interface Props {
    children: React.ReactNode;
}

const AdminLayout = ({ children }: Props) => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div
            className="bg-background flex min-h-full w-full items-start justify-center p-2.5 pt-10"
            style={{
                backgroundImage: `url(${BgImage})`,
            }}
        >
            <AdminSidebar open={isSidebarOpen} handleToggle={() => setSidebarOpen(!isSidebarOpen)} />
            <div className="mt-5 flex w-full max-w-[1650px] flex-col items-center justify-center gap-5">{children}</div>
        </div>
    );
};

export default AdminLayout;
