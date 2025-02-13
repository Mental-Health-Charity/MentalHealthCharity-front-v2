import { Box } from '@mui/material';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import useTheme from '../../../../theme';
import Announcement from '../Announcement';
import CookiesBar from '../CookiesBar';
import Footer from '../Footer';

interface Props {
    children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
    const theme = useTheme();
    const isAdminScreen = window.location.pathname.includes('/admin');

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: theme.palette.background.default,
            }}
        >
            <Toaster
                toastOptions={{
                    style: {
                        fontFamily: theme.typography.fontFamily,
                        fontSize: '18px',
                    },
                }}
                position="top-center"
                reverseOrder={false}
            />
            {children}
            {!isAdminScreen && <Footer />}
            <CookiesBar />
            <Announcement />
        </Box>
    );
};

export default Layout;
