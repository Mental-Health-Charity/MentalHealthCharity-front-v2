import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";

import Button from "@mui/material/Button";

import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { useTranslation } from "react-i18next";
import useTheme from "../../../../theme";
import Logo from "../../../../assets/static/logo_small.webp";
import useWindowScroll from "../../hooks/useWindowScroll";
import NavLink from "../NavLink";
import { useUser } from "../../../auth/components/AuthProvider";
import { Avatar, Link, ListItemText, Tooltip } from "@mui/material";
import { Permissions } from "../../constants";
import usePermissions from "../../hooks/usePermissions";

const Navbar = () => {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
        null
    );

    const isAdminPanel = window.location.pathname.includes("/admin");

    const { user } = useUser();

    const { hasPermissions } = usePermissions(user);

    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
        null
    );

    const { isScrolled } = useWindowScroll();

    const { t } = useTranslation();
    const theme = useTheme();

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const pages = [
        {
            name: t("common.navigation.home"),
            path: "/",
        },
        {
            name: t("common.navigation.articles"),
            path: "/articles",
        },
        {
            name: t("common.navigation.chat"),
            path: "/chat/",
        },
        {
            name: t("common.navigation.admin"),
            path: "/admin/",
            permissions: Permissions.ADMIN_DASHBOARD,
        },
    ];

    if (isAdminPanel) {
        return null;
    }

    return (
        <AppBar
            sx={{
                padding: "10px",
                backgroundColor: theme.palette.primary.main,
                boxShadow: isScrolled ? "5px 2px 2px rgba(0,0,0,0.1)" : "none",
                position: "fixed",
                top: 0,
                width: "100%",
                transition: "all 1s",
                zIndex: 100,
            }}
            position="static"
        >
            <Container style={{ maxWidth: "1650px" }}>
                <Toolbar disableGutters>
                    <Box
                        sx={{
                            backgroundColor: theme.palette.background.default,
                            padding: "10px 20px",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "15px",
                            marginRight: "20px",
                        }}
                    >
                        <img src={Logo} width={40} />
                        <Typography
                            fontSize={20}
                            textTransform="uppercase"
                            fontWeight={600}
                            color="secondary.main"
                        >
                            Fundacja Peryskop
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: "flex", md: "none" },
                        }}
                    >
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: "block", md: "none" } }}
                        >
                            {pages
                                .filter(
                                    (page) =>
                                        !page.permissions ||
                                        hasPermissions(page.permissions)
                                )
                                .map(({ name, path }) => (
                                    <MenuItem
                                        key={path}
                                        onClick={handleCloseNavMenu}
                                    >
                                        <Typography
                                            sx={{
                                                textAlign: "center",
                                                color: theme.palette.text
                                                    .primary,
                                            }}
                                        >
                                            {name}
                                        </Typography>
                                    </MenuItem>
                                ))}
                        </Menu>
                    </Box>
                    <AdbIcon
                        sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
                    />
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: "none", md: "flex" },
                            height: "100%",
                            gap: "20px",
                            alignItems: "center",
                        }}
                    >
                        {pages
                            .filter(
                                (page) =>
                                    !page.permissions ||
                                    hasPermissions(page.permissions)
                            )
                            .map((page) => (
                                <NavLink
                                    name={page.name}
                                    to={page.path}
                                    key={page.path}
                                />
                            ))}
                    </Box>
                    <Box sx={{ flexGrow: 0 }}>
                        {user && (
                            <>
                                <Tooltip title={user.email}>
                                    <Button
                                        onClick={handleOpenUserMenu}
                                        sx={{
                                            p: "6px 10px 6px 15px",
                                            gap: "10px",
                                            borderRadius: "8px",
                                            background:
                                                theme.palette.background.paper,
                                        }}
                                    >
                                        <Typography
                                            fontSize={18}
                                            color="accent.primary"
                                            fontWeight="bold"
                                        >
                                            {user.full_name}
                                        </Typography>
                                        <Avatar
                                            variant="rounded"
                                            alt={user.full_name.toUpperCase()}
                                            src={
                                                user.chat_avatar_url ||
                                                user.full_name
                                            }
                                        />
                                    </Button>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: "55px", width: "100%" }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    <MenuItem>
                                        <ListItemText>
                                            <Link
                                                sx={{ textDecoration: "none" }}
                                                href={`/profile/${user.id}`}
                                            >
                                                {t(
                                                    "common.navigation.my_account"
                                                )}
                                            </Link>
                                        </ListItemText>
                                    </MenuItem>
                                    <MenuItem onClick={handleCloseUserMenu}>
                                        <Typography
                                            sx={{ textAlign: "center" }}
                                        >
                                            {t("common.navigation.logout")}
                                        </Typography>
                                    </MenuItem>
                                </Menu>
                            </>
                        )}
                        {!user && (
                            <NavLink name={t("common.login")} to="/login" />
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;
