import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { Chat, CreateChatPayload } from "../types";

const createChatMutation = async (payload: CreateChatPayload): Promise<Chat | undefined> => {
    const headers = getAuthHeaders();

    try {
        const res = await fetch(url.chat.createChat, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            throw handleApiError(res);
        }

        return await res.json();
    } catch (e) {
        console.error("Error creating chat:", e);
        throw e;
    }
};

export default createChatMutation;
