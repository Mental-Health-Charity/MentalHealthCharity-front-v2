import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { url } from "../../../api";

const useUnreadMessages = () => {
    const [unreadChats, setUnreadChats] = useState<Record<number, number>>({});
    const token = Cookies.get("token");

    const { lastMessage: unreadMessages } = useWebSocket(token ? url.chat.connectUnreadMessages({ token }) : null, {
        shouldReconnect: () => true,
        reconnectAttempts: Infinity,
        reconnectInterval: (attemptNumber) => Math.min(1000 * 2 ** attemptNumber, 30000),
    });

    useEffect(() => {
        if (unreadMessages !== null) {
            try {
                const parsedMessage = JSON.parse(unreadMessages.data);
                if (parsedMessage && typeof parsedMessage.unread_chats === "object") {
                    setUnreadChats(parsedMessage.unread_chats);
                }
            } catch {
                console.error("Failed to parse unread messages WebSocket payload");
            }
        }
    }, [unreadMessages]);

    return { unreadChats };
};

export default useUnreadMessages;
