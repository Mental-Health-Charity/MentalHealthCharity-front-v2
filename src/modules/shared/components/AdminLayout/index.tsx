import { Box } from "@mui/material";
import { AdminSidebar } from "../AdminSidebar";
import { useState } from "react";
import useTheme from "../../../../theme";
import BgImage from "../../../,./../../assets/static/admin_panel_bg.svg";

interface Props {
    children: React.ReactNode;
}

const AdminLayout = ({ children }: Props) => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const theme = useTheme();
    return (
        <Box
            sx={{
                width: "100%",
                backgroundImage: `url(${BgImage})`,
                // opacity of bg
                minHeight: "100vh",
                backgroundColor: theme.palette.background.default,
                display: "flex",
                alignItems: "start",
                justifyContent: "center",
            }}
        >
            <AdminSidebar
                open={isSidebarOpen}
                handleToggle={() => setSidebarOpen(!isSidebarOpen)}
            />
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px",
                    maxWidth: "1400px",
                    gap: "20px",
                    flexDirection: "column",
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default AdminLayout;
