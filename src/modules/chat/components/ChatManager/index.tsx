import AddIcon from "@mui/icons-material/Add";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Box, Button, Chip, Typography, useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { CellMeasurer, Index } from "react-virtualized";
import useTheme from "../../../../theme";
import { User } from "../../../auth/types";
import ActionMenu from "../../../shared/components/ActionMenu";
import WindowListInfiniteLoader from "../../../shared/components/WindowListInfiniteLoader";
import { CachedListRowProps } from "../../../shared/components/WindowListVirtualizer";
import formatDate from "../../../shared/helpers/formatDate";
import { Pagination } from "../../../shared/types";
import UserTableItem from "../../../users/components/UserTableItem";
import { Chat } from "../../types";

interface Props {
    data?: Pagination<Chat>;
    onEditChat: (chat: Chat) => void;
    onRemoveChat: (chat: Chat) => void;
    onToggleChat: (chat: Chat) => void;
    onAddParticipant: (chat: Chat) => void;
    onRemoveParticipant: (chat: Chat, participant: User) => void;
    onLoadMore: () => void;
}

const ChatManager = ({
    data,
    onEditChat,
    onRemoveChat,
    onToggleChat,
    onAddParticipant,
    onRemoveParticipant,
    onLoadMore,
}: Props) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery("(max-width: 600px)");

    const navigate = useNavigate();
    const userHeight = isMobile ? 110 : 70;
    const padding = isMobile ? 200 : 150;

    const getRowHeight = ({ index }: Index) => {
        const chat = data && data.items[index];
        return chat ? chat.participants.length * userHeight + padding : 0;
    };

    const onRender = ({ index, key, style, cache, parent }: CachedListRowProps) => {
        const chat = data && data.items[index];
        if (!chat) return null;

        return (
            <CellMeasurer cache={cache} parent={parent} columnIndex={0} rowIndex={index} key={key}>
                <div
                    key={key}
                    style={{
                        ...style,
                        padding: "10px 0",
                    }}
                >
                    <Box
                        sx={{
                            padding: "15px 15px",
                            backgroundColor: theme.palette.background.paper,
                            border: `2px solid ${theme.palette.colors.border}`,
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "start",
                            flexDirection: "column",
                            color: theme.palette.text.secondary,
                            maxHeight: getRowHeight({ index }) - 10,
                        }}
                    >
                        <Box
                            width="100%"
                            flexWrap="wrap"
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <Box display="flex" alignItems="center" gap={2}>
                                <Box display="flex" gap={2} alignItems="center">
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        sx={{
                                            backgroundColor: theme.palette.colors.border,
                                            borderRadius: "4px",
                                            padding: "14px",
                                        }}
                                    >
                                        <ChatBubbleIcon
                                            sx={{
                                                color: theme.palette.text.primary,
                                            }}
                                        />
                                    </Box>

                                    <Typography variant="h5">{chat.name}</Typography>
                                </Box>
                            </Box>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Chip color="info" label={formatDate(chat.creation_date)} />
                                {chat.is_supervisor_chat && <Chip color="error" label={t("chat.admin_chat")} />}

                                <Chip
                                    color={chat.is_active ? "success" : "error"}
                                    label={chat.is_active ? t("common.active") : t("common.inactive")}
                                />

                                <ActionMenu
                                    actions={[
                                        {
                                            id: "edit",
                                            label: t("common.edit"),
                                            onClick: () => onEditChat(chat),
                                            icon: <EditIcon />,
                                        },

                                        {
                                            id: "go_to_chat",
                                            label: t("chat.go_to_chat"),
                                            href: `/chat/${chat.id}`,
                                            icon: <ArrowCircleRightIcon />,
                                        },

                                        {
                                            id: "disable",
                                            variant: "divider",
                                            label: chat.is_active ? t("common.disable") : t("common.enable"),
                                            onClick: () => onToggleChat(chat),
                                            icon: chat.is_active ? (
                                                <PauseIcon
                                                    sx={{
                                                        color: theme.palette.warning.main,
                                                    }}
                                                />
                                            ) : (
                                                <PlayArrowIcon
                                                    sx={{
                                                        color: theme.palette.success.main,
                                                    }}
                                                />
                                            ),
                                        },
                                        {
                                            id: "remove",
                                            variant: "divider",
                                            label: t("common.remove"),
                                            onClick: () => onRemoveChat(chat),
                                            icon: (
                                                <DeleteIcon
                                                    sx={{
                                                        color: theme.palette.error.main,
                                                    }}
                                                />
                                            ),
                                        },
                                    ]}
                                />
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "start",
                                width: "100%",
                                gap: 2,
                                marginTop: "20px",
                                position: "relative",

                                "&::before": {
                                    content: '""',
                                    display: "block",
                                    position: "absolute",
                                    width: "5px",
                                    minHeight: "calc(100% - 81px)",
                                    backgroundColor: theme.palette.colors.border,
                                    marginBottom: "20px",
                                    left: "0px",
                                },
                            }}
                        >
                            {chat.participants.length > 0 &&
                                chat.participants.map((participant) => (
                                    <UserTableItem
                                        additionalActions={[
                                            {
                                                id: "remove",
                                                label: t("chat.remove_from_chat"),
                                                variant: "divider",
                                                onClick: () => onRemoveParticipant(chat, participant),
                                                icon: (
                                                    <DeleteIcon
                                                        sx={{
                                                            color: theme.palette.error.main,
                                                        }}
                                                    />
                                                ),
                                            },
                                        ]}
                                        user={participant}
                                        sx={{
                                            padding: "0 0 0 35px",
                                            border: "none",
                                            width: "100%",

                                            "&::after": {
                                                content: '""',
                                                display: "block",
                                                position: "absolute",
                                                width: "25px",
                                                height: "4px",
                                                backgroundColor: theme.palette.colors.border,
                                                left: "00px",
                                            },
                                        }}
                                        onEdit={() => navigate(`/admin/users?search=${participant.email}`)}
                                    />
                                ))}
                            <Button onClick={() => onAddParticipant(chat)} variant="text">
                                <AddIcon /> {t("chat.add_participant")}
                            </Button>
                        </Box>
                    </Box>
                </div>
            </CellMeasurer>
        );
    };

    return (
        <div style={{ minHeight: "100vh" }}>
            <WindowListInfiniteLoader data={data} onLoadMore={onLoadMore} onRender={onRender} />
        </div>
    );
};

export default ChatManager;
