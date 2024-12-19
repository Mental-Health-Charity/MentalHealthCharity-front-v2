import {
    Divider,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    MenuList,
} from "@mui/material";
import { ComponentAction } from "../../types";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { MouseEvent, useMemo, useState } from "react";
import { Link } from "react-router-dom";

interface Props {
    actions: ComponentAction[];
}

const ActionMenu = ({ actions }: Props) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();

        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const { defaultActions, dividerActions } = useMemo(() => {
        return actions.reduce(
            (acc, action) => {
                if (action.variant === "divider") {
                    acc.dividerActions.push(action);
                } else {
                    acc.defaultActions.push(action);
                }
                return acc;
            },
            {
                defaultActions: [] as ComponentAction[],
                dividerActions: [] as ComponentAction[],
            }
        );
    }, [actions]);

    return (
        <>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    "aria-labelledby": "basic-button",
                }}
            >
                <MenuList>
                    {defaultActions.map((action) =>
                        action.href ? (
                            <Link
                                reloadDocument
                                to={action.href}
                                key={action.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                                style={{
                                    textDecoration: "none",
                                    color: "inherit",
                                }}
                            >
                                <MenuItem {...action}>
                                    <ListItemIcon>{action.icon}</ListItemIcon>
                                    <ListItemText>{action.label}</ListItemText>
                                </MenuItem>
                            </Link>
                        ) : (
                            <MenuItem {...action} key={action.id}>
                                <ListItemIcon>{action.icon}</ListItemIcon>
                                <ListItemText>{action.label}</ListItemText>
                            </MenuItem>
                        )
                    )}
                    {dividerActions.length > 0 && (
                        <Divider
                            sx={{
                                margin: "8px 0 6px 0",
                            }}
                        />
                    )}
                    {dividerActions.map((action) =>
                        action.href ? (
                            <Link
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                                to={action.href}
                                key={action.id}
                                style={{
                                    textDecoration: "none",
                                    color: "inherit",
                                }}
                            >
                                <MenuItem {...action}>
                                    <ListItemIcon>{action.icon}</ListItemIcon>
                                    <ListItemText>{action.label}</ListItemText>
                                </MenuItem>
                            </Link>
                        ) : (
                            <MenuItem
                                {...action}
                                key={action.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    action.onClick && action.onClick(e);
                                }}
                            >
                                <ListItemIcon>{action.icon}</ListItemIcon>
                                <ListItemText>{action.label}</ListItemText>
                            </MenuItem>
                        )
                    )}
                </MenuList>
            </Menu>
            <IconButton
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
            >
                <MoreHorizIcon />
            </IconButton>
        </>
    );
};

export default ActionMenu;
