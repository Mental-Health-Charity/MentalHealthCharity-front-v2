import { Button, useTheme } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

interface Props {
    name: string;
    to: string;
}

const NavLink = ({ name, to }: Props) => {
    const location = useLocation();
    const isCurrentRoute = location.pathname === to;
    const theme = useTheme();

    return (
        <Button
            href={to}
            to={to}
            component={Link}
            sx={{
                color: "text.primary",
                display: "block",
                fontSize: "20px",
                fontWeight: 500,
                position: "relative",

                "&::after": {
                    position: "absolute",
                    content: '""',
                    display: "block",
                    minHeight: "5px",
                    borderRadius: "5px",
                    left: 0,
                    bottom: 1,
                    width: isCurrentRoute ? "100%" : 0,
                    background: isCurrentRoute
                        ? theme.palette.background.default
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
