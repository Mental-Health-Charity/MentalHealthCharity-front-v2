import { useQuery } from "@tanstack/react-query";
import { t } from "i18next";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import useWebSocket, { Options, ReadyState } from "react-use-websocket";
import { url } from "../../../api";
import { useUser } from "../../auth/components/AuthProvider";
import { UnknownUser } from "../constants";
import { chatHistoryQueryOptions } from "../queries/chatHistoryQueryOptions";
import { getChatById } from "../queries/getChatById";
import { ConnectionStatus, Message, SocketMessage } from "../types";

const useChat = (chatId: number, options?: Options) => {
    const token = Cookies.get("token");
    const [messages, setMessages] = useState<Message[]>([]);
    const [pendingMessages, setPendingMessages] = useState<Message[]>([]);
    const { data: messageHistory } = useQuery(chatHistoryQueryOptions({ chatId }));
    const { data: selectedChat } = useQuery(getChatById({ id: chatId || -9 }));

    const { user } = useUser();

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

        // Dodaj do pendingów
        setPendingMessages((prev) => [pendingMessage, ...prev]);

        // Wyślij wiadomość
        sendJsonMessage({ chatId, content });
    };

    useEffect(() => {
        if (lastMessage !== null) {
            const parsedMessage: SocketMessage = JSON.parse(lastMessage.data);

            const sender =
                selectedChat &&
                selectedChat.participants.find((participant) => participant.id === parsedMessage.sender_id);

            const newMessage: Message = {
                ...parsedMessage,
                chat_id: chatId,
                sender: sender || UnknownUser,
            };

            setPendingMessages((prev) =>
                prev.filter((msg) => msg.content !== newMessage.content || msg.sender.id !== newMessage.sender.id)
            );

            setMessages((prev) => [newMessage, ...prev]);
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

    const allMessages = [...pendingMessages, ...messages];

    return { send, messages: allMessages, connectionStatus, selectedChat };
};

export default useChat;
