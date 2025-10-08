import { Avatar, Box, ListItemButton, Typography, useTheme } from "@mui/material";
import { Chat } from "../../types";
import { UnreadIndicator } from "./style";

interface Props {
    chat: Chat;
    onChange: (id: string) => void;
    selected: boolean;
    readed?: boolean;
}

const ChatItem = ({ chat, onChange, selected, readed }: Props) => {
    const theme = useTheme();
    const showUnreadIndicator = chat.unread_count > 0 && !readed;
    const { is_active } = chat;

    return (
        <ListItemButton
            href={`/chat/${chat.id}`}
            sx={{
                display: "flex",
                opacity: is_active ? 1 : 0.8,
                alignItems: "center",
                justifyContent: "flex-start",
                backgroundColor: selected ? theme.palette.action.selected : "transparent",
                gap: "15px",
                padding: "10px 5px",
            }}
            onClick={() => onChange(String(chat.id))}
        >
            <Avatar
                variant="rounded"
                sx={{
                    bgcolor: is_active ? theme.palette.colors.accent : theme.palette.colors.border,
                }}
            />
            <Box
                sx={{
                    minHeight: "40px",
                }}
            >
                <Typography
                    sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        color: is_active ? theme.palette.text.secondary : theme.palette.text.disabled,
                        fontSize: "16px",
                        fontWeight: "bold",
                        maxWidth: "200px",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        textWrap: "nowrap",
                        lineHeight: "1.2",
                    }}
                >
                    {chat.name} {showUnreadIndicator && <UnreadIndicator>{chat.unread_count}</UnreadIndicator>}
                </Typography>
                {chat.last_message && (
                    <Typography
                        sx={{
                            opacity: 0.7,
                            maxWidth: "200px",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            textWrap: "nowrap",
                            color: is_active ? theme.palette.text.secondary : theme.palette.text.disabled,
                        }}
                    >
                        {chat.last_message.sender.full_name}: {chat.last_message.content}
                    </Typography>
                )}
            </Box>
        </ListItemButton>
    );
};

export default ChatItem;
