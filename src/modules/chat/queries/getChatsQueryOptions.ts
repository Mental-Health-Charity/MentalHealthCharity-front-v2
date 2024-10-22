import { queryOptions } from "@tanstack/react-query";
import { url } from "../../../api";
import { DefaultPaginationOptions, Pagination } from "../../shared/types";
import { Chat } from "../types";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";

export const getChatsQueryOptions = (options: DefaultPaginationOptions) =>
  queryOptions<Pagination<Chat>>({
    queryKey: ["chats", options],
    queryFn: async () => {
      const headers = getAuthHeaders();
      const response = await fetch(url.chat.readChats(options), {
        headers,
      });

      if (!response.ok) {
        throw new Error("failed_to_fetch_chat_note");
      }

      return response.json();
    },
  });
