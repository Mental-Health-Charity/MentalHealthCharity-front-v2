import MenuIcon from '@mui/icons-material/Menu';
import {
    Avatar,
    Box,
    Button,
    Container,
    IconButton,
    List,
    ListItem,
    Menu,
    MenuItem,
    Link as MuiLink,
    SwipeableDrawer,
    Toolbar,
    Tooltip,
    Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Logo from '../../../../assets/static/logo_small.webp';
import useTheme from '../../../../theme';
import { useUser } from '../../../auth/components/AuthProvider';
import { getChatsQueryOptions } from '../../../chat/queries/getChatsQueryOptions';
import { Permissions } from '../../constants';
import usePermissions from '../../hooks/usePermissions';
import NavLink from '../NavLink';
import { StyledAppBar } from './styles';

const Navbar = () => {
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
    const location = window.location.pathname;
    const { user, logout } = useUser();
    const isAdminPanel = window.location.pathname.includes('/admin');
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const handleCloseUserMenu = () => setAnchorElUser(null);
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElUser(event.currentTarget);
    const { data: chats } = useQuery(
        getChatsQueryOptions(
            { size: 50, page: 1 },
            {
                enabled: !!user,
                queryKey: ['chats'],
            }
        )
    );

    const { hasPermissions } = usePermissions();
    const { t } = useTranslation();
    const theme = useTheme();

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }
        setIsDrawerOpen(open);
    };

    const pages = [
        { name: t('common.navigation.home'), path: '/' },
        { name: t('common.navigation.articles'), path: '/articles' },
        { name: t('common.navigation.admin'), path: '/admin/', permissions: Permissions.ADMIN_DASHBOARD },
    ];

    if (chats && chats.total > 0) {
        pages.push({ name: t('common.navigation.chat'), path: '/chat' });
    }

    console.log('chats', chats);

    useEffect(() => {
        toggleDrawer(false);
    }, [location]);

    if (isAdminPanel) return null;

    return (
        <StyledAppBar>
            <Container maxWidth={false}>
                <Toolbar
                    sx={{
                        position: 'relative',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                    disableGutters
                >
                    {/* Logo */}

                    <Link to="/">
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                flexGrow: { xs: 1, md: 0 },
                            }}
                        >
                            <img src={Logo} alt="Logo" style={{ width: 40 }} />
                        </Box>
                    </Link>

                    {/* Mobile Menu */}
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            sx={{ color: theme.palette.text.secondary }}
                            size="large"
                            onClick={toggleDrawer(true)}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        {isDrawerOpen && (
                            <SwipeableDrawer
                                anchor="left"
                                open={isDrawerOpen}
                                onClose={toggleDrawer(false)}
                                onOpen={toggleDrawer(true)}
                            >
                                <Box
                                    sx={{
                                        width: 250,
                                        padding: '10px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        alignItems: 'space-between',
                                        height: '100%',
                                        gap: 2,
                                    }}
                                    role="presentation"
                                    onClick={toggleDrawer(false)}
                                    onKeyDown={toggleDrawer(false)}
                                >
                                    <List>
                                        {pages
                                            .filter((page) => !page.permissions || hasPermissions(page.permissions))
                                            .map(({ name, path }) => (
                                                <ListItem key={path} disablePadding>
                                                    <NavLink name={name} to={path} />
                                                </ListItem>
                                            ))}
                                    </List>

                                    {user && (
                                        <Box>
                                            <NavLink to="/profile" name={t('common.navigation.my_account')} />
                                            <Button variant="contained" fullWidth color="error" onClick={logout}>
                                                {t('common.navigation.logout')}
                                            </Button>
                                        </Box>
                                    )}
                                </Box>
                            </SwipeableDrawer>
                        )}
                    </Box>

                    {/* Desktop Menu */}
                    <Box
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            gap: 3,
                            flexGrow: 1,
                            justifyContent: 'center',
                            position: 'absolute',
                            left: '50%',
                            transform: 'translateX(-50%)',
                        }}
                    >
                        {pages
                            .filter((page) => !page.permissions || hasPermissions(page.permissions))
                            .map(({ name, path }) => (
                                <NavLink key={path} name={name} to={path} />
                            ))}
                    </Box>

                    {/* User Menu */}
                    <Box sx={{ flexGrow: 0, display: { md: 'block', xs: 'none' } }}>
                        {user ? (
                            <Tooltip title={user.email}>
                                <Button
                                    onClick={handleOpenUserMenu}
                                    sx={{
                                        p: 1,
                                        display: 'flex',
                                        gap: 1,
                                        alignItems: 'center',
                                        backgroundColor: theme.palette.background.default,
                                        borderRadius: 2,
                                    }}
                                >
                                    <Typography>{user.full_name}</Typography>
                                    <Avatar
                                        src={user.chat_avatar_url || user.full_name}
                                        alt={user.full_name}
                                        variant="rounded"
                                    />
                                </Button>
                            </Tooltip>
                        ) : (
                            <Button variant="contained" component={Link} to="/articles/dashboard">
                                {t('common.join_us')}
                            </Button>
                        )}
                        {user && (
                            <Menu
                                anchorEl={anchorElUser}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                            >
                                <MenuItem>
                                    <MuiLink href={`/profile/${user.id}`} underline="none">
                                        {t('common.navigation.my_account')}
                                    </MuiLink>
                                </MenuItem>
                                <MenuItem onClick={logout}>
                                    <Typography textAlign="center">{t('common.navigation.logout')}</Typography>
                                </MenuItem>
                            </Menu>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </StyledAppBar>
    );
};

export default Navbar;
