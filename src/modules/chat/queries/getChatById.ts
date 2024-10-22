import { queryOptions } from "@tanstack/react-query";
import { url } from "../../../api";
import { Chat, ReadChatOptions } from "../types";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";

export const getChatById = (options: ReadChatOptions) =>
  queryOptions<Chat>({
    queryKey: ["chat", options],
    queryFn: async () => {
      const headers = getAuthHeaders();
      const response = await fetch(url.chat.readChat(options), {
        headers,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch chat");
      }

      return response.json();
    },
  });
