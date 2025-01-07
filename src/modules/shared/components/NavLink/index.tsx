import { Button, useTheme } from "@mui/material";
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

interface Props {
    name: string;
    to: string;
}

const reloadDocumentRoutes = ["/admin/"];

const NavLink = ({ name, to }: Props) => {
    const location = useLocation();
    const isCurrentRoute = location.pathname === to;
    const theme = useTheme();

    const reloadDocument = useMemo(
        () => reloadDocumentRoutes.includes(to),
        [to]
    );

    return (
        <Button
            href={to}
            to={to}
            component={Link}
            reloadDocument={reloadDocument}
            sx={{
                color: "text.secondary",
                display: "block",
                fontSize: "20px",
                fontWeight: 600,
                opacity: isCurrentRoute ? 1 : 0.9,
                position: "relative",

                "&::after": {
                    position: "absolute",
                    content: '""',
                    display: "block",
                    minHeight: "5px",
                    borderRadius: "5px",
                    left: 0,
                    bottom: 15,
                    zIndex: -1,
                    width: isCurrentRoute ? "100%" : 0,
                    background: isCurrentRoute
                        ? theme.palette.colors.accent
                        : "transparent",
                    transition: "width 0.3s",
                },
            }}
        >
            {name}
        </Button>
    );
};

export default NavLink;
