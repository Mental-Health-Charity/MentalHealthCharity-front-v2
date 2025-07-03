import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { Chat, EditChatPayload } from "../types";

const editChatMutation = async ({ is_active, name, id }: EditChatPayload): Promise<Chat> => {
    try {
        const headers = getAuthHeaders();

        const res = await fetch(url.chat.editChat({ id }), {
            method: "PUT",
            headers,
            body: JSON.stringify({
                is_active,
                name,
            }),
        });

        if (!res.ok) {
            throw handleApiError(res);
        }

        return await res.json();
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};

export default editChatMutation;
