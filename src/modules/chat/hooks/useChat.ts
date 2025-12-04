import { useMutation, useQuery } from "@tanstack/react-query";
import { t } from "i18next";
import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import useWebSocket, { Options, ReadyState } from "react-use-websocket";
import { url } from "../../../api";
import { useUser } from "../../auth/components/AuthProvider";
import { UnknownUser } from "../constants";
import { ChatDataParser } from "../helpers/ChatDataParser";
import { chatHistoryQueryOptions } from "../queries/chatHistoryQueryOptions";
import deleteChatMessageMutation from "../queries/deleteChatMessageMutation";
import editChatMutation from "../queries/editChatMutation";
import { getChatById } from "../queries/getChatById";
import { markAsReadMutation } from "../queries/markAsReadMutation";
import { Chat, ConnectionStatus, Message } from "../types";

const useChat = (chatId: number, options?: Options) => {
    const token = Cookies.get("token");
    const [messages, setMessages] = useState<Message[]>([]);
    const [pendingMessages, setPendingMessages] = useState<Message[]>([]);
    const { data: messageHistory } = useQuery(chatHistoryQueryOptions({ chatId }));
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

    useEffect(() => {
        if (messageHistory) {
            setMessages(messageHistory.items);
        }
    }, [messageHistory]);

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
    };
};

export default useChat;
