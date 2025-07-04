import CloseIcon from "@mui/icons-material/Close";
import { Avatar, Box, IconButton, List, ListItemButton, Typography, useTheme } from "@mui/material";
import formatDate from "../../../shared/helpers/formatDate";
import { translatedRoles } from "../../../users/constants";
import { Chat } from "../../types";

interface Props {
    chat: Chat;
    onClose: () => void;
}

const ChatDetails = ({ chat, onClose }: Props) => {
    const theme = useTheme();
    return (
        <Box
            sx={{
                backgroundColor: theme.palette.background.default,
                borderRadius: "8px",
                boxShadow: `0 0 10px 5px ${theme.palette.shadows.box}`,
                height: "fit-content",
                display: "flex",
                justifyContent: "center",
                padding: "15px",
                flexDirection: "column",
                minWidth: "300px",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    alignItems: "center",
                    gap: "15px",
                }}
            >
                <Typography
                    sx={{
                        textAlign: "start",
                        backgroundColor: theme.palette.colors.dark,
                        padding: "3px 15px",
                        borderRadius: "8px",
                        width: "fit-content",
                        color: theme.palette.text.primary,
                        fontSize: "20px",
                        fontWeight: 600,
                        minWidth: "130px",
                    }}
                >
                    {chat.name}
                </Typography>
                <IconButton
                    onClick={onClose}
                    sx={{
                        backgroundColor: theme.palette.colors.danger,
                        color: theme.palette.text.primary,
                        padding: "2px",
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </Box>
            <Typography
                sx={{
                    width: "100%",
                    textAlign: "start",
                    fontSize: "20px",
                    fontWeight: 600,
                }}
                color="text.secondary"
            >
                Uczestnicy ({chat.participants.length})
            </Typography>
            <List>
                {chat.participants.map((participant) => (
                    <ListItemButton
                        sx={{
                            display: "flex",
                            gap: "15px",
                            padding: "5px",
                        }}
                        key={participant.id}
                    >
                        <Avatar src={participant.chat_avatar_url} alt={participant.full_name} variant="rounded" />
                        <Box>
                            <Typography>{participant.full_name}</Typography>
                            <Typography>{translatedRoles[participant.user_role]}</Typography>
                        </Box>
                    </ListItemButton>
                ))}
            </List>
            <Typography
                sx={{
                    width: "100%",
                    textAlign: "start",
                    fontSize: "20px",
                    fontWeight: 600,
                }}
                color="text.secondary"
            >
                Utworzony w dniu
            </Typography>
            <Typography>{formatDate(chat.creation_date)}</Typography>
        </Box>
    );
};

export default ChatDetails;
