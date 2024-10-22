import useWebSocket, { ReadyState } from "react-use-websocket";
import { url } from "../../../api";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Options } from "react-use-websocket";
import { ConnectionStatus, Message, SocketMessage } from "../types";
import { useQuery } from "@tanstack/react-query";
import { chatHistoryQueryOptions } from "../queries/chatHistoryQueryOptions";
import { getChatById } from "../queries/getChatById";
import { UnknownUser } from "../constants";
import { t } from "i18next";

const useChat = (chatId: number, options?: Options) => {
  const token = Cookies.get("token");
  const [messages, setMessages] = useState<Message[]>([]);
  const { data: messageHistory } = useQuery(
    chatHistoryQueryOptions({ chatId })
  );
  const { data: selectedChat } = useQuery(getChatById({ id: chatId || -9 }));

  if (!token) {
    throw new Error("Token not found");
  }

  const { readyState, sendMessage, lastMessage, sendJsonMessage } =
    useWebSocket(
      url.chat.connect({
        token,
        chat_id: String(chatId),
      }),
      options
    );

  const send = (message: string) => {
    console.log("send", message);

    sendJsonMessage({ chatId, content: message });
  };

  useEffect(() => {
    if (lastMessage !== null) {
      const parsedMessage: SocketMessage = JSON.parse(lastMessage.data);

      const sender =
        selectedChat &&
        selectedChat.participants.find(
          (participant) => participant.id === parsedMessage.sender_id
        );

      const message: Message = {
        ...parsedMessage,
        sender: sender || UnknownUser,
      };

      setMessages((prev) => [message, ...prev]);
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

  return { send, messages, connectionStatus, selectedChat };
};

export default useChat;
