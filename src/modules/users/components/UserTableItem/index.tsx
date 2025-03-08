import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import Person2Icon from "@mui/icons-material/Person2";
import { Avatar, Box, BoxProps, Button, Chip, Typography } from "@mui/material";
import { t } from "i18next";
import toast from "react-hot-toast";
import useTheme from "../../../../theme";
import { User } from "../../../auth/types";
import ActionMenu from "../../../shared/components/ActionMenu";
import { downloadFile } from "../../../shared/helpers/downloadFile";
import { ComponentAction } from "../../../shared/types";
import { Roles, translatedRoles } from "../../constants";

interface Props extends BoxProps {
    user: User;
    onEdit: (user: User) => void;
    additionalActions?: ComponentAction[];
}

const UserTableItem = ({ onEdit, user, additionalActions, ...props }: Props) => {
    const theme = useTheme();

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success(t("common.copied_to_clipboard"));
    };

    return (
        <Box
            {...props}
            sx={{
                padding: " 15px",
                backgroundColor: theme.palette.background.paper,
                border: `2px solid ${theme.palette.colors.border}`,
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                ...props.sx,
            }}
        >
            <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
                <Avatar
                    sx={{ width: 50, height: 50 }}
                    src={user.chat_avatar_url}
                    alt={user.full_name}
                    variant="rounded"
                />
                <Box>
                    <Typography variant="h6" color="textSecondary">
                        {user.full_name} ({user.id})
                    </Typography>
                    <Button
                        variant="text"
                        onClick={() => handleCopy(user.email)}
                        sx={{
                            padding: 0,
                            color: theme.palette.text.secondary,
                            gap: "10px",
                        }}
                    >
                        {user.email}
                        <ContentCopyIcon fontSize="small" />
                    </Button>
                </Box>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                }}
            >
                <Chip
                    color={user.is_assigned_to_chat ? "info" : "default"}
                    sx={{
                        color: theme.palette.text.primary,
                    }}
                    label={
                        user.is_assigned_to_chat ? t("users.is_assigned_to_chat") : t("users.is_not_assigned_to_chat")
                    }
                />
                <Chip
                    color={user.user_role === Roles.USER ? "secondary" : "error"}
                    sx={{
                        color: theme.palette.text.primary,
                    }}
                    label={translatedRoles[user.user_role]}
                />

                <ActionMenu
                    actions={[
                        {
                            id: "edit",
                            label: t("common.edit"),
                            onClick: () => onEdit(user),
                            icon: <EditIcon />,
                        },
                        {
                            id: "go_to_profile",
                            label: t("common.go_to_profile"),
                            href: `/profile/${user?.id}`,
                            icon: <Person2Icon />,
                        },
                        {
                            id: "connected_chats_to_user",
                            label: t("common.check_connected_chats"),
                            href: `/admin/chats/?search=${user?.email}`,
                            icon: <ChatBubbleIcon />,
                        },
                        {
                            id: "download",
                            label: t("common.download"),
                            onClick: () => {
                                downloadFile(user, user.full_name + ".json", "application/json");
                            },
                            variant: "divider",
                            icon: <DownloadIcon />,
                        },
                        ...(additionalActions || []),
                    ]}
                />
            </Box>
        </Box>
    );
};

export default UserTableItem;
