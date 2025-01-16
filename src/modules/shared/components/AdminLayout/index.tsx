import { Box } from '@mui/material';
import { useState } from 'react';
import BgImage from '../../../,./../../assets/static/admin_panel_bg.svg';
import useTheme from '../../../../theme';
import { AdminSidebar } from '../AdminSidebar';

interface Props {
    children: React.ReactNode;
}

const AdminLayout = ({ children }: Props) => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const theme = useTheme();
    return (
        <Box
            sx={{
                width: '100%',
                backgroundImage: `url(${BgImage})`,
                minHeight: '100%',
                backgroundColor: theme.palette.background.default,
                display: 'flex',
                padding: '40px 10px',
                alignItems: 'start',
                justifyContent: 'center',
            }}
        >
            <AdminSidebar open={isSidebarOpen} handleToggle={() => setSidebarOpen(!isSidebarOpen)} />
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '20px',
                    maxWidth: '1400px',
                    gap: '20px',
                    flexDirection: 'column',
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default AdminLayout;
