import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BookOpen, Flag, LockKeyhole, Menu, StickyNote, Users } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useIsMobile } from "../../../../hooks/useBreakpoint";
import { useUser } from "../../../auth/components/AuthProvider";
import ReportModal from "../../../report/components/ReportModal";
import { Permissions } from "../../../shared/constants";
import usePermissions from "../../../shared/hooks/usePermissions";
import useChat from "../../hooks/useChat";
import useChatListLoader from "../../hooks/useChatListLoader";
import { Chat as ChatType } from "../../types";
import AddParticipantModal from "../AddParticipantModal";
import Chat from "../Chat";
import ChatDetails from "../ChatDetails";
import ChatSidebar from "../ChatSidebar";
import CloseChatModal from "../CloseChatModal";
import ContractSidebar from "../ContractModal/ContractModal";
import CustomizeChatModal from "../CustomizeChatModal";
import NewChatModal from "../NewChatModal";
import Note from "../Note";

const ChatWindow = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const parsedChatId = id ? Number(id) : Number.NaN;
    const chatId = Number.isInteger(parsedChatId) && parsedChatId > 0 ? parsedChatId : undefined;
    const { data, aggregatedData, loadNextPage, searchQuery, setSearchQuery, isSearching } = useChatListLoader(100);
    const effectiveData = aggregatedData || data;
    const isMobile = useIsMobile();
    const [showDetails, setShowDetails] = useState(!isMobile);
    const [showNote, setShowNote] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const { user } = useUser();
    const [showCustomizeModal, setShowCustomizeModal] = useState(false);
    const [showContractModal, setShowContractModal] = useState(false);
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [showAddParticipant, setShowAddParticipant] = useState(false);
    const [showCloseChatModal, setShowCloseChatModal] = useState(false);
    const { t } = useTranslation();
    const [showSidebar, setShowSidebar] = useState(false);
    const { hasPermissions } = usePermissions();

    // Use a ref-based shouldReconnect to avoid stale closure over selectedChat
    const selectedChatRef = useRef<ChatType | undefined>(undefined);

    const {
        messages,
        connectionStatus,
        send,
        retrySend,
        selectedChat,
        isSelectedChatLoading,
        handleDeleteMessage,
        handleCloseChat,
        reloadChat,
        loadBackHistory,
        historyState,
    } = useChat(chatId, {
        shouldReconnect: () => {
            if (!chatId || !user) {
                return false;
            }

            const chat = selectedChatRef.current;
            if (!chat) {
                // Keep reconnecting while chat metadata is still loading.
                return true;
            }

            return chat.participants.some((p) => p.id === user.id);
        },
        reconnectAttempts: Infinity,
        reconnectInterval: (attemptNumber) => Math.min(1000 * 2 ** attemptNumber, 30000),
    });

    // Keep the ref in sync
    selectedChatRef.current = selectedChat;

    const closeChat = useCallback(
        (chat: ChatType) => {
            handleCloseChat(chat);
            setShowDetails(false);
        },
        [handleCloseChat]
    );

    const canCloseChat =
        selectedChat &&
        !selectedChat.is_supervisor_chat &&
        selectedChat.is_active &&
        (hasPermissions(Permissions.EDIT_CHAT_DATA) || hasPermissions(Permissions.MANAGE_CHATS));

    useEffect(() => {
        if (!chatId && effectiveData?.items.length) {
            navigate(`/chat/${effectiveData.items[0].id}`, { replace: true });
        }
    }, [chatId, effectiveData, navigate]);

    const headerActions = (
        <div className="flex items-center gap-0.5">
            {hasPermissions(Permissions.EDIT_CHAT_NOTE) && (
                <Tooltip>
                    <TooltipTrigger
                        render={
                            <button
                                onClick={() => setShowNote(!showNote)}
                                className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg p-2 transition-colors"
                                aria-label={t("chat.notes")}
                            >
                                <StickyNote className="size-5" />
                            </button>
                        }
                    />
                    <TooltipContent>{t("chat.notes")}</TooltipContent>
                </Tooltip>
            )}

            <Tooltip>
                <TooltipTrigger
                    render={
                        <button
                            onClick={() => setShowReportModal(!showReportModal)}
                            className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg p-2 transition-colors"
                            aria-label={t("chat.report")}
                        >
                            <Flag className="size-5" />
                        </button>
                    }
                />
                <TooltipContent>{t("chat.report")}</TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger
                    render={
                        <button
                            onClick={() => setShowContractModal(!showContractModal)}
                            className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg p-2 transition-colors"
                            aria-label={t("chat.contract")}
                        >
                            <BookOpen className="size-5" />
                        </button>
                    }
                />
                <TooltipContent>{t("chat.contract")}</TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger
                    render={
                        <button
                            onClick={() => setShowDetails(!showDetails)}
                            className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg p-2 transition-colors"
                            aria-label={t("chat.show_details", { defaultValue: "Details" })}
                        >
                            <Users className="size-5" />
                        </button>
                    }
                />
                <TooltipContent>{t("chat.show_details", { defaultValue: "Details" })}</TooltipContent>
            </Tooltip>

            {canCloseChat && (
                <>
                    <div className="bg-border/60 mx-1 h-5 w-px" />
                    <Tooltip>
                        <TooltipTrigger
                            render={
                                <button
                                    onClick={() => setShowCloseChatModal(true)}
                                    className="text-destructive hover:bg-destructive/10 rounded-lg p-2 transition-colors"
                                    aria-label={t("chat.close_chat")}
                                >
                                    <LockKeyhole className="size-5" />
                                </button>
                            }
                        />
                        <TooltipContent>{t("chat.close_chat")}</TooltipContent>
                    </Tooltip>
                </>
            )}
        </div>
    );

    return (
        <TooltipProvider>
            <div className="flex h-full flex-1">
                {/* Left: sidebar */}
                <ChatSidebar
                    handleDrawerToggle={() => setShowSidebar((prev) => !prev)}
                    showSidebar={showSidebar}
                    data={effectiveData}
                    loadMore={loadNextPage}
                    currentChatId={chatId}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    isSearching={isSearching}
                    onNewChat={hasPermissions(Permissions.MANAGE_CHATS) ? () => setShowNewChatModal(true) : undefined}
                />

                {/* Center: header + messages + input */}
                <div className="flex min-w-0 flex-1 flex-col">
                    {/* Header bar */}
                    <div className="border-border/50 bg-card flex h-16 shrink-0 items-center justify-between border-b px-4">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowSidebar((prev) => !prev)}
                                className="text-muted-foreground hover:text-foreground transition-colors md:hidden"
                                aria-label={t("chat.show_more_chats")}
                            >
                                <Menu className="size-6" />
                            </button>
                            {selectedChat ? (
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary-brand/20 text-primary-brand flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                                        {selectedChat.name.charAt(0).toUpperCase()}
                                    </div>
                                    <h2 className="text-foreground truncate text-sm font-semibold">
                                        {selectedChat.name}
                                    </h2>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Skeleton className="size-9 rounded-full" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            )}
                        </div>
                        {headerActions}
                    </div>

                    {/* Chat area */}

                    <Chat
                        onDeleteMessage={handleDeleteMessage}
                        onRetryMessage={retrySend}
                        status={connectionStatus}
                        messages={messages}
                        onSendMessage={send}
                        chat={selectedChat}
                        isChatInitializing={isSelectedChatLoading}
                        onLoadMoreMessages={loadBackHistory}
                        historyState={historyState}
                    />
                </div>

                {/* Right: note sidebar */}
                {showNote && selectedChat && (
                    <Note key={selectedChat.id} onClose={() => setShowNote(false)} chat={selectedChat} />
                )}

                {/* Right: contract sidebar */}
                {showContractModal && selectedChat && (
                    <ContractSidebar
                        key={`contract-${selectedChat.id}`}
                        chatId={selectedChat.id.toString()}
                        onClose={() => setShowContractModal(false)}
                    />
                )}

                {/* Right: details panel */}
                {showDetails && selectedChat && (
                    <ChatDetails
                        onClose={() => setShowDetails(false)}
                        chat={selectedChat}
                        onAddParticipant={
                            hasPermissions(Permissions.MANAGE_CHATS) ? () => setShowAddParticipant(true) : undefined
                        }
                        canManageParticipants={hasPermissions(Permissions.MANAGE_CHATS)}
                        onParticipantRemoved={reloadChat}
                        onCloseChat={canCloseChat ? () => setShowCloseChatModal(true) : undefined}
                    />
                )}
            </div>

            {showReportModal && <ReportModal open={showReportModal} onClose={() => setShowReportModal(false)} />}
            {showCustomizeModal && (
                <CustomizeChatModal open={showCustomizeModal} onClose={() => setShowCustomizeModal(false)} />
            )}
            {showNewChatModal && (
                <NewChatModal
                    open={showNewChatModal}
                    onClose={() => setShowNewChatModal(false)}
                    onSuccess={reloadChat}
                />
            )}
            {showAddParticipant && selectedChat && (
                <AddParticipantModal
                    open={showAddParticipant}
                    onClose={() => setShowAddParticipant(false)}
                    chat={selectedChat}
                    onSuccess={reloadChat}
                />
            )}
            {selectedChat && (
                <CloseChatModal
                    open={showCloseChatModal}
                    onClose={() => setShowCloseChatModal(false)}
                    onConfirm={() => {
                        closeChat(selectedChat);
                        setShowCloseChatModal(false);
                    }}
                />
            )}
        </TooltipProvider>
    );
};

export default ChatWindow;
