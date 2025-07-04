import { Avatar, Box, ListItemButton, Typography, useTheme } from "@mui/material";
import { useUser } from "../../../auth/components/AuthProvider";
import { Chat } from "../../types";

interface Props {
    chat: Chat;
    onChange: (id: string) => void;
    selected: boolean;
}

const ChatItem = ({ chat, onChange, selected }: Props) => {
    const theme = useTheme();
    const { user } = useUser();

    const firstParticipant = user && chat.participants.find((participant) => participant.id !== user.id);

    return (
        <ListItemButton
            href={`/chat/${chat.id}`}
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: "15px",
                padding: "5px",
            }}
            disabled={selected}
            // fix
            onClick={() => onChange(chat.id as unknown as string)}
        >
            <Avatar variant="rounded" />
            <Box
                sx={{
                    minHeight: "40px",
                }}
            >
                <Typography
                    sx={{
                        color: theme.palette.text.secondary,
                        fontSize: "16px",
                        fontWeight: "bold",
                        maxWidth: "200px",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        textWrap: "nowrap",
                        lineHeight: "1.2",
                    }}
                >
                    {chat.name}
                </Typography>
                {firstParticipant && (
                    <Typography
                        sx={{
                            lineHeight: "1.2",
                        }}
                    >
                        {firstParticipant.full_name}
                    </Typography>
                )}
            </Box>
        </ListItemButton>
    );
};

export default ChatItem;
