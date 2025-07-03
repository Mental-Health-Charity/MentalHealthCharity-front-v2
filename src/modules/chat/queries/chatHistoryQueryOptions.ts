import { queryOptions } from "@tanstack/react-query";
import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import { Pagination } from "../../shared/types";
import { GetChatMessagesOptions, Message } from "../types";

export const chatHistoryQueryOptions = (options: GetChatMessagesOptions) =>
    queryOptions<Pagination<Message>>({
        queryKey: ["messages", options],
        queryFn: async () => {
            const headers = getAuthHeaders();
            const response = await fetch(url.chat.readMessages(options), {
                headers,
            });

            if (!response.ok) {
                throw new Error("Failed to fetch messages");
            }

            return response.json();
        },
    });
