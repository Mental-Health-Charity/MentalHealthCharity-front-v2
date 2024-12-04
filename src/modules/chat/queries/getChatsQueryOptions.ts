import { queryOptions } from "@tanstack/react-query";
import { url } from "../../../api";
import { Pagination } from "../../shared/types";
import { Chat, SearchChatQueryOptions } from "../types";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";

export const getChatsQueryOptions = (options: SearchChatQueryOptions) =>
    queryOptions<Pagination<Chat>>({
        queryKey: ["chats", options],
        queryFn: async () => {
            try {
                const headers = getAuthHeaders();
                const response = await fetch(url.chat.readChats(options), {
                    headers,
                });

                const data = await response.json();

                if (!response.ok) {
                    throw handleApiError(data);
                }

                return data;
            } catch (error) {
                console.error("Error fetching chats:", error);
                throw error; // Przekazanie błędu do react-query
            }
        },
    });
