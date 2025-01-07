import AdbIcon from "@mui/icons-material/Adb";
import MenuIcon from "@mui/icons-material/Menu";
import {
    Avatar,
    Box,
    Button,
    Container,
    IconButton,
    ListItemText,
    Link as MuiLink,
    Tooltip,
} from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Logo from "../../../../assets/static/logo_small.webp";
import useTheme from "../../../../theme";
import { useUser } from "../../../auth/components/AuthProvider";
import { getChatsQueryOptions } from "../../../chat/queries/getChatsQueryOptions";
import { Roles } from "../../../users/constants";
import { Permissions } from "../../constants";
import usePermissions from "../../hooks/usePermissions";
import NavLink from "../NavLink";
import { StyledAppBar } from "./styles";

const Navbar = () => {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
        null
    );

    const isAdminPanel = window.location.pathname.includes("/admin");

    const { user, logout } = useUser();

    const { data: chats } = useQuery(
        getChatsQueryOptions(
            { size: 50, page: 1 },
            {
                enabled: !!user && user.user_role !== Roles.USER,
                queryKey: ["chats"],
            }
        )
    );

    const { hasPermissions } = usePermissions(user);

    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
        null
    );

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
            name: t("common.navigation.admin"),
            path: "/admin/",
            permissions: Permissions.ADMIN_DASHBOARD,
        },
    ];

    if (chats && chats.total > 0) {
        pages.push({
            name: t("common.navigation.chat"),
            path: "/chat",
        });
    }

    if (isAdminPanel) {
        return null;
    }

    return (
        <StyledAppBar>
            <Container disableGutters style={{ maxWidth: "1650px" }}>
                <Toolbar
                    sx={{ width: "100%", justifyContent: "space-between" }}
                    disableGutters
                >
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
                            fontSize={24}
                            textTransform="uppercase"
                            fontWeight={600}
                            color="text.secondary"
                        >
                            Fundacja Peryskop
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: "flex", md: "none" },

                            width: "100%",
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
                            position: "absolute",
                            left: "50%",
                            transform: "translateX(-50%)",
                            flexGrow: 1,
                            display: { xs: "none", md: "flex" },
                            height: "100%",
                            gap: "20px",
                            alignItems: "center",
                            justifyContent: "center",
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
                                            <MuiLink
                                                sx={{ textDecoration: "none" }}
                                                href={`/profile/${user.id}`}
                                            >
                                                {t(
                                                    "common.navigation.my_account"
                                                )}
                                            </MuiLink>
                                        </ListItemText>
                                    </MenuItem>
                                    <MenuItem onClick={logout}>
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
                            <Button
                                sx={{ margin: "0 10px" }}
                                component={Link}
                                to="/articles/dashboard"
                                variant="contained"
                            >
                                {t("common.join_us")}
                            </Button>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </StyledAppBar>
    );
};

export default Navbar;
