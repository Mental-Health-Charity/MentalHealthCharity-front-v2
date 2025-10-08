import EventNoteIcon from "@mui/icons-material/EventNote";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import MenuIcon from "@mui/icons-material/Menu";
import ReportIcon from "@mui/icons-material/Report";
import TuneIcon from "@mui/icons-material/Tune";
import { Box, IconButton, Tooltip, useTheme } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import Logo from "../../../../assets/static/logo_small.webp";
import { useUser } from "../../../auth/components/AuthProvider";
import ReportModal from "../../../report/components/ReportModal";
import Info from "../../../shared/components/Info";
import { Permissions } from "../../../shared/constants";
import usePermissions from "../../../shared/hooks/usePermissions";
import useChat from "../../hooks/useChat";
import { getChatsQueryOptions } from "../../queries/getChatsQueryOptions";
import { Chat as ChatType } from "../../types";
import Chat from "../Chat";
import ChatDetails from "../ChatDetails";
import ChatSidebar from "../ChatSidebar";
import ContractModal from "../ContractModal/ContractModal";
import CustomizeChatModal from "../CustomizeChatModal";
import Note from "../Note";

interface Props {
    onChangeWallpaper?: (wallpaper: string) => void;
}

const ChatWindow = ({ onChangeWallpaper }: Props) => {
    const theme = useTheme();
    const { id } = useParams<{ id: string }>();
    const { data, isLoading } = useQuery(getChatsQueryOptions({ size: 100, page: 1 }));
    const [showDetails, setShowDetails] = useState(false);
    const [showNote, setShowNote] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const { user } = useUser();
    const [showCustomizeModal, setShowCustomizeModal] = useState(false);
    const [showContractModal, setShowContractModal] = useState(false);
    const { t } = useTranslation();
    const [chatId, setChatId] = useState(id || (data && data.items[0].id) || "");
    const navigate = useNavigate();
    const [showSidebar, setShowSidebar] = useState(false);
    const { hasPermissions } = usePermissions();

    const { messages, connectionStatus, send, selectedChat, handleDeleteMessage, handleCloseChat, reloadChat } =
        useChat(Number(chatId), {
            shouldReconnect: (closeEvent) => {
                const isParticipant = selectedChat && user && selectedChat.participants.some((p) => p.id === user.id);

                if (isParticipant) {
                    console.warn("Socket closed, attempting to reconnect...", closeEvent);
                    return true;
                }

                return false;
            },
        });

    const closeChat = useCallback(
        (chat: ChatType) => {
            handleCloseChat(chat);
            setShowDetails(false);
        },
        [handleCloseChat, reloadChat]
    );

    const handleChangeChat = useCallback(
        (id: string) => {
            setShowNote(false);
            setChatId(id);
        },
        [setChatId, setShowNote]
    );

    if (!isLoading && (!data || data.total === 0)) {
        toast(t("chat.no_available_chats_found"));
        navigate("/");
    }

    useEffect(() => {
        if (!chatId && data) {
            setChatId(data.items[0].id);
        }
    }, [data, chatId]);

    return (
        <>
            {" "}
            {showNote && selectedChat && (
                <Note key={selectedChat.id} onClose={() => setShowNote(false)} chat={selectedChat} />
            )}
            <Box margin="0px 0 10px 0">
                <Info id="chat-delete-info">{t("chat.auto_delete_info")}</Info>
            </Box>
            <Box
                sx={{
                    backgroundColor: theme.palette.colors.dark,
                    display: "flex",
                    gap: { xs: "4px", md: "15px" },
                    padding: { xs: "4px", md: "15px" },
                    borderRadius: "10px",
                    flexDirection: { xs: "column", md: "row" },
                }}
            >
                {/* sidebar dark */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "row", md: "column" },
                        gap: "15px",
                    }}
                >
                    <Box
                        sx={{
                            backgroundColor: theme.palette.background.default,
                            borderRadius: "8px",
                            boxShadow: `0 0 10px 5px ${theme.palette.shadows.box}`,
                            width: "55px",
                            height: "55px",
                            display: { xs: "none", md: "flex" },
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <img src={Logo} alt="logo" width={45} height={41} />
                    </Box>

                    <Tooltip title={t("chat.show_more_chats")}>
                        <IconButton
                            onClick={() => setShowSidebar((prev) => !prev)}
                            sx={{
                                display: { xs: "flex", md: "none" },
                                color: theme.palette.text.primary,
                            }}
                        >
                            <MenuIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>

                    {hasPermissions(Permissions.EDIT_CHAT_NOTE) && (
                        <Tooltip title={t("chat.notes")}>
                            <IconButton
                                onClick={() => setShowNote(!showNote)}
                                sx={{
                                    color: theme.palette.text.primary,
                                    display: { xs: "none", md: "flex" },
                                }}
                            >
                                <EventNoteIcon fontSize="large" />
                            </IconButton>
                        </Tooltip>
                    )}

                    <Tooltip title={t("chat.report")}>
                        <IconButton
                            sx={{
                                color: theme.palette.text.primary,
                            }}
                            onClick={() => setShowReportModal(!showReportModal)}
                        >
                            <ReportIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>
                    {onChangeWallpaper && (
                        <Tooltip title={t("chat.customize")}>
                            <IconButton
                                sx={{
                                    color: theme.palette.text.primary,
                                }}
                                onClick={() => setShowCustomizeModal(!showCustomizeModal)}
                            >
                                <TuneIcon fontSize="large" />
                            </IconButton>
                        </Tooltip>
                    )}
                    <Tooltip title={t("chat.contract")}>
                        <IconButton
                            sx={{
                                color: theme.palette.text.primary,
                            }}
                            onClick={() => setShowContractModal(!showContractModal)}
                        >
                            <HistoryEduIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>
                </Box>
                <ChatSidebar
                    handleDrawerToggle={() => setShowSidebar((prev) => !prev)}
                    showSidebar={showSidebar}
                    data={data}
                    onChangeChat={handleChangeChat}
                    currentChatId={Number(chatId)}
                />
                <Box
                    sx={{
                        width: "100%",
                    }}
                >
                    <Chat
                        onCloseChat={closeChat}
                        onDeleteMessage={handleDeleteMessage}
                        status={connectionStatus}
                        messages={messages}
                        onSendMessage={send}
                        chat={selectedChat}
                        onShowDetails={() => setShowDetails(true)}
                    />
                </Box>
                {showDetails && selectedChat && (
                    <ChatDetails onClose={() => setShowDetails(false)} chat={selectedChat} />
                )}
                {showReportModal && <ReportModal open={showReportModal} onClose={() => setShowReportModal(false)} />}
                {showCustomizeModal && onChangeWallpaper && (
                    <CustomizeChatModal
                        onChangeWallpaper={onChangeWallpaper}
                        open={showCustomizeModal}
                        onClose={() => setShowCustomizeModal(false)}
                    />
                )}
                {showContractModal && (
                    <ContractModal
                        chatId={chatId.toString()}
                        isOpen={showContractModal}
                        onClose={() => setShowContractModal(false)}
                    />
                )}
            </Box>
        </>
    );
};

export default ChatWindow;
