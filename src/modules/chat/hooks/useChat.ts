import { useMutation, useQuery } from "@tanstack/react-query";
import { t } from "i18next";
import Cookies from "js-cookie";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import useWebSocket, { Options, ReadyState } from "react-use-websocket";
import { url } from "../../../api";
import { useUser } from "../../auth/components/AuthProvider";
import { UnknownUser } from "../constants";
import { ChatDataParser } from "../helpers/ChatDataParser";
import { fetchChatHistory } from "../queries/chatHistoryQueryOptions";
import deleteChatMessageMutation from "../queries/deleteChatMessageMutation";
import editChatMutation from "../queries/editChatMutation";
import { getChatById } from "../queries/getChatById";
import { markAsReadMutation } from "../queries/markAsReadMutation";
import { Chat, ConnectionStatus, Message } from "../types";

/** Page size for backwards history pagination */
const HISTORY_PAGE_SIZE = 50;

export interface HistoryPaginationState {
    currentPage: number;
    totalPages: number;
    hasMore: boolean;
    isLoadingHistory: boolean;
}

const useChat = (chatId: number, options?: Options) => {
    const token = Cookies.get("token");
    const [messages, setMessages] = useState<Message[]>([]);
    const [pendingMessages, setPendingMessages] = useState<Message[]>([]);

    // Pagination state for backwards history loading
    const [historyState, setHistoryState] = useState<HistoryPaginationState>({
        currentPage: 1,
        totalPages: 1,
        hasMore: true,
        isLoadingHistory: false,
    });

    // Track loaded pages to prevent duplicate fetches
    const loadedPagesRef = useRef<Set<number>>(new Set());

    // Mutation for fetching history pages
    const { mutateAsync: fetchHistory } = useMutation({
        mutationFn: fetchChatHistory,
        onError: (error) => {
            console.error("Failed to fetch chat history:", error);
            toast.error(t("chat.failed_to_load_history"));
        },
    });

    const { mutate: markAsRead } = useMutation({
        mutationFn: markAsReadMutation,
    });
    const { data: selectedChat, refetch: reloadChat } = useQuery(getChatById({ id: chatId || -9 }));
    const { mutate: deleteChatMessage } = useMutation({
        mutationFn: deleteChatMessageMutation,
    });

    const { mutate: editChat } = useMutation({
        mutationFn: editChatMutation,

        onSuccess: () => {
            toast.success(t("chat.edit_chat_success"));
            reloadChat();
        },
    });

    const parser = new ChatDataParser()
        .onNewMessage((msg) => {
            const sender =
                selectedChat && selectedChat.participants.find((participant) => participant.id === msg.sender_id);

            const newMessage: Message = {
                ...msg,
                chat_id: chatId,
                sender: sender || UnknownUser,
            };

            setPendingMessages((prev) =>
                prev.filter((msg) => msg.content !== newMessage.content || msg.sender.id !== newMessage.sender.id)
            );

            setMessages((prev) => [newMessage, ...prev]);
            markAsRead({ id: chatId });
        })
        .onDelete(({ id }) => {
            setMessages((prev) => prev.filter((m) => m.id !== id));
        });

    const { user } = useUser();

    const handleCloseChat = useCallback(
        (chat: Chat) => {
            editChat({
                id: chat.id,
                is_active: false,
                name: chat.name,
            });
        },
        [editChat, reloadChat]
    );

    if (!token) {
        throw new Error("Token not found");
    }

    const { readyState, lastMessage, sendJsonMessage } = useWebSocket(
        url.chat.connect({
            token,
            chat_id: String(chatId),
        }),
        options
    );

    const send = (content: string) => {
        const tempId = Date.now();
        const pendingMessage: Message = {
            id: tempId,
            content,
            sender: user || UnknownUser,
            chat_id: chatId,
            creation_date: new Date().toISOString(),
            isPending: true,
        };

        setPendingMessages((prev) => [pendingMessage, ...prev]);
        sendJsonMessage({ chatId, content });
    };

    useEffect(() => {
        if (lastMessage !== null) {
            try {
                parser.parse(lastMessage.data);
            } catch (error) {
                console.error("Failed to parse WebSocket message:", error);
            }
        }
    }, [lastMessage]);

    // Load initial page when chatId changes
    useEffect(() => {
        const loadInitialHistory = async () => {
            if (!chatId || chatId <= 0) return;

            // Reset state for new chat
            setMessages([]);
            loadedPagesRef.current.clear();
            setHistoryState({
                currentPage: 1,
                totalPages: 1,
                hasMore: true,
                isLoadingHistory: true,
            });

            try {
                const response = await fetchHistory({
                    chatId,
                    page: 1,
                    size: HISTORY_PAGE_SIZE,
                });

                loadedPagesRef.current.add(1);
                setMessages(response.items);
                setHistoryState({
                    currentPage: 1,
                    totalPages: response.pages,
                    hasMore: response.page < response.pages,
                    isLoadingHistory: false,
                });
            } catch (error) {
                console.error("Failed to load initial history:", error);
                setHistoryState((prev) => ({
                    ...prev,
                    isLoadingHistory: false,
                }));
            }
        };

        loadInitialHistory();
    }, [chatId, fetchHistory]);

    /**
     * Load older messages (backwards pagination).
     * This function is safe to call multiple times - it won't fetch
     * the same page twice and handles concurrent calls gracefully.
     *
     * @returns Promise that resolves when loading is complete
     */
    const loadBackHistory = useCallback(async (): Promise<void> => {
        // Guard: Don't load if already loading or no more pages
        if (historyState.isLoadingHistory || !historyState.hasMore) {
            return;
        }

        const nextPage = historyState.currentPage + 1;

        // Guard: Don't fetch already loaded pages
        if (loadedPagesRef.current.has(nextPage)) {
            return;
        }

        // Guard: Don't exceed total pages
        if (nextPage > historyState.totalPages) {
            setHistoryState((prev) => ({ ...prev, hasMore: false }));
            return;
        }

        setHistoryState((prev) => ({ ...prev, isLoadingHistory: true }));

        try {
            const response = await fetchHistory({
                chatId,
                page: nextPage,
                size: HISTORY_PAGE_SIZE,
            });

            loadedPagesRef.current.add(nextPage);

            // Append older messages to the end (messages are sorted newest first)
            setMessages((prev) => {
                // Deduplicate by message ID to handle any edge cases
                const existingIds = new Set(prev.map((m) => m.id));
                const newMessages = response.items.filter((m) => !existingIds.has(m.id));
                return [...prev, ...newMessages];
            });

            setHistoryState({
                currentPage: nextPage,
                totalPages: response.pages,
                hasMore: nextPage < response.pages,
                isLoadingHistory: false,
            });
        } catch (error) {
            console.error("Failed to load history page:", error);
            setHistoryState((prev) => ({
                ...prev,
                isLoadingHistory: false,
            }));
            throw error; // Re-throw so caller can handle if needed
        }
    }, [chatId, historyState, fetchHistory]);

    const connectionStatus: ConnectionStatus = {
        [ReadyState.CONNECTING]: {
            text: t("chat.connecting"),
            isError: false,
            isLoading: true,
            state: ReadyState.CONNECTING,
        },
        [ReadyState.OPEN]: {
            text: t("chat.open"),
            isError: false,
            isLoading: false,
            state: ReadyState.OPEN,
        },
        [ReadyState.CLOSING]: {
            text: t("chat.closing"),
            isError: true,
            isLoading: true,
            state: ReadyState.CLOSING,
        },
        [ReadyState.CLOSED]: {
            text: t("chat.closed"),
            isError: true,
            isLoading: false,
            state: ReadyState.CLOSED,
        },
        [ReadyState.UNINSTANTIATED]: {
            text: t("chat.uninstantiated"),
            isError: true,
            isLoading: false,
            state: ReadyState.UNINSTANTIATED,
        },
    }[readyState];

    const handleDeleteMessage = useCallback((messageId: number) => {
        deleteChatMessage({ id: messageId });
    }, []);

    const allMessages = [...pendingMessages, ...messages];

    return {
        send,
        messages: allMessages,
        connectionStatus,
        selectedChat,
        handleDeleteMessage,
        handleCloseChat,
        reloadChat,
        loadBackHistory,
        historyState,
    };
};

export default useChat;
