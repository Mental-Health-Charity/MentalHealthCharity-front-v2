import FavoriteIcon from '@mui/icons-material/Favorite';
import { Box, Button, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { StyledAnnouncementWrapper } from './style';

const Announcement = () => {
    const [isOpen, setIsOpen] = useState(false);
    const blacklistedRoutes = ['/support', '/chat', '/login', '/admin'];
    const shouldHide = useMemo(() => blacklistedRoutes.includes(window.location.pathname), [window.location.pathname]);

    const handleMobileOpen = () => {
        if (window.innerWidth > 768) return;
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('click', handleMobileOpen);
        } else {
            document.removeEventListener('click', handleMobileOpen);
        }

        return () => {
            document.removeEventListener('click', handleMobileOpen);
        };
    }, [isOpen]);

    if (shouldHide) {
        return null;
    }

    return (
        <StyledAnnouncementWrapper>
            <Box className="announcement-content">
                <Typography color="text.secondary">Chcesz nas wesprzeć?</Typography>
                <Link to="/support">Kliknij tutaj</Link>
            </Box>
            <Box sx={{ padding: '10px' }}>
                <Button style={{ color: 'white', padding: 0, margin: 0 }}>
                    <FavoriteIcon />
                </Button>
            </Box>
        </StyledAnnouncementWrapper>
    );
};

export default Announcement;
