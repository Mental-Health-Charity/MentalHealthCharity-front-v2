import { useState } from "react";
import { AdminSidebar } from "../AdminSidebar";

interface Props {
    children: React.ReactNode;
}

const AdminLayout = ({ children }: Props) => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="bg-background flex min-h-screen w-full">
            <AdminSidebar open={isSidebarOpen} handleToggle={() => setSidebarOpen(!isSidebarOpen)} />
            <div className="flex w-full min-w-0 flex-1 flex-col items-center justify-start gap-5 p-4 pt-10">
                <div className="w-full max-w-[1650px] min-w-0">{children}</div>
            </div>
        </div>
    );
};

export default AdminLayout;
