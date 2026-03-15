import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BookOpen, CalendarDays, Flag, Menu, SlidersHorizontal } from "lucide-react";
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
import useChatListLoader from "../../hooks/useChatListLoader";
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
    const { id } = useParams<{ id: string }>();
    const { data, isLoading, aggregatedData, loadNextPage } = useChatListLoader(100);
    const effectiveData = aggregatedData || data;
    const [showDetails, setShowDetails] = useState(false);
    const [showNote, setShowNote] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const { user } = useUser();
    const [showCustomizeModal, setShowCustomizeModal] = useState(false);
    const [showContractModal, setShowContractModal] = useState(false);
    const { t } = useTranslation();
    const [chatId, setChatId] = useState(id || "");
    const navigate = useNavigate();
    const [showSidebar, setShowSidebar] = useState(false);
    const { hasPermissions } = usePermissions();

    const {
        messages,
        connectionStatus,
        send,
        selectedChat,
        handleDeleteMessage,
        handleCloseChat,
        reloadChat,
        loadBackHistory,
        historyState,
    } = useChat(Number(chatId), {
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

    if (!isLoading && (!effectiveData || effectiveData.total === 0)) {
        toast(t("chat.no_available_chats_found"));
        navigate("/");
    }

    useEffect(() => {
        if (!chatId && effectiveData) {
            setChatId(String(effectiveData.items[0].id));
        }
    }, [effectiveData, chatId]);

    return (
        <TooltipProvider>
            {showNote && selectedChat && (
                <Note key={selectedChat.id} onClose={() => setShowNote(false)} chat={selectedChat} />
            )}
            <div className="mb-2.5">
                <Info id="chat-delete-info">{t("chat.auto_delete_info")}</Info>
            </div>
            <div className="bg-dark flex flex-col gap-1 rounded-[10px] p-1 md:flex-row md:gap-4 md:p-4">
                {/* sidebar dark */}
                <div className="flex flex-row gap-4 md:flex-col">
                    <div className="bg-background shadow-box hidden size-[55px] items-center justify-center rounded-lg md:flex">
                        <img src={Logo} alt="logo" width={45} height={41} />
                    </div>

                    <Tooltip>
                        <TooltipTrigger
                            render={
                                <button
                                    onClick={() => setShowSidebar((prev) => !prev)}
                                    className="text-bg-brand flex md:hidden"
                                >
                                    <Menu className="size-7" />
                                </button>
                            }
                        />
                        <TooltipContent>{t("chat.show_more_chats")}</TooltipContent>
                    </Tooltip>

                    {hasPermissions(Permissions.EDIT_CHAT_NOTE) && (
                        <Tooltip>
                            <TooltipTrigger
                                render={
                                    <button
                                        onClick={() => setShowNote(!showNote)}
                                        className="text-bg-brand hidden md:flex"
                                    >
                                        <CalendarDays className="size-7" />
                                    </button>
                                }
                            />
                            <TooltipContent>{t("chat.notes")}</TooltipContent>
                        </Tooltip>
                    )}

                    <Tooltip>
                        <TooltipTrigger
                            render={
                                <button onClick={() => setShowReportModal(!showReportModal)} className="text-bg-brand">
                                    <Flag className="size-7" />
                                </button>
                            }
                        />
                        <TooltipContent>{t("chat.report")}</TooltipContent>
                    </Tooltip>

                    {onChangeWallpaper && (
                        <Tooltip>
                            <TooltipTrigger
                                render={
                                    <button
                                        onClick={() => setShowCustomizeModal(!showCustomizeModal)}
                                        className="text-bg-brand"
                                    >
                                        <SlidersHorizontal className="size-7" />
                                    </button>
                                }
                            />
                            <TooltipContent>{t("chat.customize")}</TooltipContent>
                        </Tooltip>
                    )}

                    <Tooltip>
                        <TooltipTrigger
                            render={
                                <button
                                    onClick={() => setShowContractModal(!showContractModal)}
                                    className="text-bg-brand"
                                >
                                    <BookOpen className="size-7" />
                                </button>
                            }
                        />
                        <TooltipContent>{t("chat.contract")}</TooltipContent>
                    </Tooltip>
                </div>
                <ChatSidebar
                    handleDrawerToggle={() => setShowSidebar((prev) => !prev)}
                    showSidebar={showSidebar}
                    data={effectiveData}
                    loadMore={loadNextPage}
                    onChangeChat={handleChangeChat}
                    currentChatId={Number(chatId)}
                />
                <div className="w-full">
                    <Chat
                        onCloseChat={closeChat}
                        onDeleteMessage={handleDeleteMessage}
                        status={connectionStatus}
                        messages={messages}
                        onSendMessage={send}
                        chat={selectedChat}
                        onShowDetails={() => setShowDetails(true)}
                        onLoadMoreMessages={loadBackHistory}
                        historyState={historyState}
                    />
                </div>
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
            </div>
        </TooltipProvider>
    );
};

export default ChatWindow;
