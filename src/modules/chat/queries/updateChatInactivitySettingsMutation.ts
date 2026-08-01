import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { ChatInactivitySettings, ChatInactivitySettingsUpdate } from "../types";

const updateChatInactivitySettingsMutation = async (
    payload: ChatInactivitySettingsUpdate
): Promise<ChatInactivitySettings> => {
    const response = await fetch(url.chat.inactivitySettings, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok) {
        await handleApiError(data);
    }

    return data;
};

export default updateChatInactivitySettingsMutation;
