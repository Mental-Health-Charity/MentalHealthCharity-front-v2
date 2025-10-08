import DeleteIcon from "@mui/icons-material/Delete";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { Avatar, Box, Typography, useTheme } from "@mui/material";
import { t } from "i18next";
import { useUser } from "../../../auth/components/AuthProvider";
import ActionMenu from "../../../shared/components/ActionMenu";
import { Permissions } from "../../../shared/constants";
import formatDate from "../../../shared/helpers/formatDate";
import usePermissions from "../../../shared/hooks/usePermissions";
import { Message } from "../../types";
import { StyledMessageWrapper } from "./style";

interface Props {
    message: Message;
    onDeleteMessage: (id: number) => void;
}

const ChatMessage = ({ message, onDeleteMessage }: Props) => {
    const theme = useTheme();
    const { user } = useUser();
    const senderIsCurrentUser = user && user.id === message.sender.id;
    const { hasPermissions } = usePermissions();
    const canDeleteMessage = senderIsCurrentUser || hasPermissions(Permissions.DELETE_OTHERS_CHAT_MESSAGES);

    return (
        <StyledMessageWrapper senderIsUser={senderIsCurrentUser || false}>
            {!senderIsCurrentUser && (
                <Avatar
                    variant="rounded"
                    src={message.sender.full_name}
                    alt={message.sender.full_name}
                    sx={{
                        fontSize: "24px",
                        marginTop: "auto",
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
                    opacity: message.isPending ? 0.5 : 1,
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
                {message.isPending && (
                    <Box>
                        <Typography
                            sx={{
                                fontSize: "14px",
                                textAlign: "start",
                            }}
                            color="info"
                        >
                            Wysyłanie...
                        </Typography>
                    </Box>
                )}
            </Box>
            {canDeleteMessage && (
                <div className="message-actions">
                    <ActionMenu
                        actions={[
                            {
                                label: t("common.remove"),
                                id: "delete",
                                disabled: !canDeleteMessage,
                                variant: "default",
                                onClick: () => onDeleteMessage(message.id),
                                icon: <DeleteIcon />,
                            },
                        ]}
                    />
                </div>
            )}
        </StyledMessageWrapper>
    );
};

export default ChatMessage;
