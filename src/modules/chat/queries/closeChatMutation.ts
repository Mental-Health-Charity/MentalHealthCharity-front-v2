import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { Chat, CloseChatPayload } from "../types";

const closeChatMutation = async ({ id }: CloseChatPayload): Promise<Chat> => {
    const response = await fetch(url.chat.closeChat({ id }), {
        method: "PUT",
        headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
        await handleApiError(data);
    }

    return data;
};

export default closeChatMutation;
