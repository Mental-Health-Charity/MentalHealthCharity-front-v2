import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import { useMediaQuery, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { Permissions } from '../../constants';
import usePermissions from '../../hooks/usePermissions';

const drawerWidth = 240;

interface Props {
    open: boolean;
    handleToggle: () => void;
}

export const AdminSidebar = ({ handleToggle, open }: Props) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { hasPermissions } = usePermissions();

    const currentPath = window.location.pathname;

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, to: '/admin/', permissions: Permissions.ADMIN_DASHBOARD },
        { text: 'Użytkownicy', icon: <HomeIcon />, to: '/admin/users/', permissions: Permissions.MANAGE_USERS },
        { text: 'Artykuły', icon: <SettingsIcon />, to: '/admin/articles/', permissions: Permissions.MANAGE_ARTICLES },
        {
            text: 'Formularze podopiecznych',
            icon: <SettingsIcon />,
            to: '/admin/forms/mentee',
            permissions: Permissions.MANAGE_MENTEE_FORMS,
        },
        {
            text: 'Formularze wolontariuszy',
            icon: <SettingsIcon />,
            to: '/admin/forms/volunteer',
            permissions: Permissions.MANAGE_VOLUNTEER_FORMS,
        },
        { text: 'Zgłoszenia', icon: <SettingsIcon />, to: '/admin/reports/', permissions: Permissions.MANAGE_REPORTS },
        { text: 'Czaty', icon: <SettingsIcon />, to: '/admin/chats/', permissions: Permissions.MANAGE_CHATS },
    ];

    const drawerContent = (
        <Box>
            <Typography variant="h6" sx={{ my: 2, textAlign: 'center' }}>
                Fundacja Peryskop
            </Typography>
            <Divider />
            <List>
                {menuItems
                    .filter((item) => hasPermissions(item.permissions))
                    .map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton disabled={currentPath === item.to} to={item.to} component={Link}>
                                <ListItemIcon sx={{ color: '#fff' }}>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                <ListItem disablePadding>
                    <ListItemButton reloadDocument to={'/'} component={Link}>
                        <ListItemIcon sx={{ color: '#fff' }}>
                            <ArrowBackIcon />
                        </ListItemIcon>
                        <ListItemText primary="Powrót" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            {isMobile && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        backgroundColor: theme.palette.background.paper,
                        zIndex: theme.zIndex.drawer + 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '6px 16px',
                    }}
                >
                    <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleToggle}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6">Fundacja Peryskop</Typography>
                </Box>
            )}

            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        backgroundColor: theme.palette.colors.dark,
                        color: theme.palette.text.primary,
                    },
                }}
                variant={isMobile ? 'temporary' : 'persistent'}
                anchor="left"
                open={isMobile ? open : true}
                onClose={handleToggle}
            >
                {drawerContent}
            </Drawer>
        </Box>
    );
};

export default AdminSidebar;
