import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const drawerWidth = 240;

interface Props {
    open: boolean;
    handleToggle: () => void;
}

export const AdminSidebar = ({ open }: Props) => {
    const theme = useTheme();
    const currentPath = window.location.pathname;

    const menuItems = [
        { text: "Dashboard", icon: <DashboardIcon />, to: "/admin/" },
        { text: "Użytkownicy", icon: <HomeIcon />, to: "/admin/users/" },
        { text: "Artykuły", icon: <SettingsIcon />, to: "/admin/articles/" },
        {
            text: "Formularze podopiecznych",
            icon: <SettingsIcon />,
            to: "/admin/forms/mentee",
        },
        {
            text: "Formularze wolontariuszy",
            icon: <SettingsIcon />,
            to: "/admin/forms/volunteer",
        },
        { text: "Zgłoszenia", icon: <SettingsIcon />, to: "/admin/reports/" },
        { text: "Czaty", icon: <SettingsIcon />, to: "/admin/chats/" },
    ];

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                        backgroundColor: theme.palette.colors.dark,
                        color: theme.palette.text.primary,
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <Typography variant="h6" sx={{ my: 2, textAlign: "center" }}>
                    Fundacja peryskop
                </Typography>
                <Divider />
                <List>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton
                                disabled={currentPath === item.to}
                                to={item.to}
                                component={Link}
                            >
                                <ListItemIcon sx={{ color: "#fff" }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                    <ListItem disablePadding>
                        <ListItemButton
                            reloadDocument
                            to={"/"}
                            component={Link}
                        >
                            <ListItemIcon sx={{ color: "#fff" }}>
                                <ArrowBackIcon />
                            </ListItemIcon>
                            <ListItemText primary="Powrót" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
        </Box>
    );
};
