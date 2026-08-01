import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { Chat, SnoozeAutoClosePayload } from "../types";

const snoozeAutoCloseMutation = async ({ id }: SnoozeAutoClosePayload): Promise<Chat> => {
    const response = await fetch(url.chat.snoozeAutoClose({ id }), {
        method: "POST",
        headers: getAuthHeaders(),
    });
    const data = await response.json();

    if (!response.ok) {
        await handleApiError(data);
    }

    return data;
};

export default snoozeAutoCloseMutation;
