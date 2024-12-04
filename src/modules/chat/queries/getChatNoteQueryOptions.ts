import { queryOptions } from "@tanstack/react-query";
import { url } from "../../../api";
import { ChatNoteOptions, Note } from "../types";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";

export const getChatNoteQueryOptions = (options: ChatNoteOptions) =>
    queryOptions<Note | null>({
        queryKey: ["chat_note"],
        refetchOnMount: true,
        enabled: !!options.id,
        refetchOnWindowFocus: true,
        queryFn: async () => {
            try {
                const headers = getAuthHeaders();
                const response = await fetch(url.chat.getNoteForChat(options), {
                    headers,
                });

                const data = await response.json();

                if (!response.ok) {
                    throw handleApiError(data);
                }

                return data;
            } catch (error) {
                console.error("Error fetching chat note:", error);
                throw error;
            }
        },
    });
