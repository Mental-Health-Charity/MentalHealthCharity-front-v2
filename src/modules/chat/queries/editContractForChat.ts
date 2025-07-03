import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";

export const editContractForChatMutation = async ({ id, body }: { id: string; body: string }) => {
    const headers = getAuthHeaders();

    try {
        const res = await fetch(url.chat.editContract({ id }), {
            method: "POST",
            body: JSON.stringify({ content: body }),
            headers,
        });

        if (!res.ok) {
            throw handleApiError(res);
        }

        return await res.json();
    } catch (e) {
        console.error("Error while editing contract:", e);
        throw e;
    }
};
