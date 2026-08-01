import { queryOptions } from "@tanstack/react-query";
import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { ChatInactivitySettings } from "../types";

export const chatInactivitySettingsQueryOptions = () =>
    queryOptions<ChatInactivitySettings>({
        queryKey: ["chat", "inactivity-settings"],
        queryFn: async () => {
            const response = await fetch(url.chat.inactivitySettings, {
                headers: getAuthHeaders(),
            });
            const data = await response.json();

            if (!response.ok) {
                await handleApiError(data);
            }

            return data;
        },
    });
