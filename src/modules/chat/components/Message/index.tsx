import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { Avatar, Box, Typography, useTheme } from "@mui/material";
import { useUser } from "../../../auth/components/AuthProvider";
import formatDate from "../../../shared/helpers/formatDate";
import { Message } from "../../types";

interface Props {
    message: Message;
}

const ChatMessage = ({ message }: Props) => {
    const theme = useTheme();
    const { user } = useUser();
    const senderIsCurrentUser = user && user.id === message.sender.id;

    return (
        <Box
            sx={{
                display: "flex",
                gap: { xs: "10px", md: "15px" },
                width: "100%",
                flexDirection: senderIsCurrentUser ? "row-reverse" : "row",
                alignItems: "flex-end",
            }}
        >
            {!senderIsCurrentUser && (
                <Avatar
                    variant="rounded"
                    src={message.sender.full_name}
                    alt={message.sender.full_name}
                    sx={{
                        fontSize: "24px",
                        width: { xs: "30px", md: "50px" },
                        height: { xs: "30px", md: "50px" },
                    }}
                />
            )}
            <Box
                sx={{
                    backgroundColor: senderIsCurrentUser
                        ? `${theme.palette.secondary.main}9A`
                        : `${theme.palette.colors.border}66`,
                    padding: { xs: "10px", md: "15px 30px" },
                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.05)",
                    borderRadius: "10px",
                    width: { xs: "100%", md: "auto" },
                    maxWidth: { xs: "100%", md: "70%" },
                    color: senderIsCurrentUser ? theme.palette.text.primary : theme.palette.text.secondary,
                    textAlign: senderIsCurrentUser ? "right" : "left",
                }}
            >
                <Box
                    sx={{
                        color: senderIsCurrentUser ? theme.palette.primary.dark : theme.palette.colors.accent,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: { xs: "space-between", md: "flex-end" },
                            alignItems: "center",
                            flexDirection: senderIsCurrentUser ? "row" : "row-reverse",
                            gap: { xs: "5px", md: "10px" },
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: { xs: "14px", md: "16px" },
                                width: { xs: "100%", md: "auto" },
                            }}
                        >
                            {formatDate(message.creation_date, "dd/MM/yyyy HH:mm")}
                        </Typography>
                        <FiberManualRecordIcon
                            sx={{
                                fontSize: "10px",
                                marginBottom: "2px",
                                display: { xs: "none", md: "block" },
                            }}
                        />
                        <Typography
                            sx={{
                                fontSize: { xs: "14px", md: "18px" },
                                fontWeight: 600,

                                marginTop: "-3px",
                            }}
                        >
                            {message.sender.full_name}
                        </Typography>
                    </Box>
                </Box>

                <Typography
                    sx={{
                        wordBreak: "break-word",
                    }}
                    fontSize="18px"
                    textAlign="start"
                >
                    {message.content}
                </Typography>
            </Box>
        </Box>
    );
};

export default ChatMessage;
