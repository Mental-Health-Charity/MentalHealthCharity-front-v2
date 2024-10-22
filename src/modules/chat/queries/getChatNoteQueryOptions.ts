import { queryOptions } from "@tanstack/react-query";
import { url } from "../../../api";
import { ChatNoteOptions, Note } from "../types";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import { ErrorMessage } from "../../shared/types";

export const getChatNoteQueryOptions = (options: ChatNoteOptions) =>
  queryOptions<Note | null>({
    queryKey: ["chat_note"],
    refetchOnMount: true,
    enabled: !!options.id,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const headers = getAuthHeaders();
      const response = await fetch(url.chat.getNoteForChat(options), {
        headers,
      });

      if (!response.ok) {
        throw new Error(ErrorMessage.FAILED_TO_FETCH_CHAT_NOTE);
      }

      return response.json();
    },
  });
