import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";

export const confirmContractForChatMutation = async ({ id, body }: { id: string; body: Record<string, boolean> }) => {
    const headers = getAuthHeaders();

    try {
        const res = await fetch(url.chat.confirmContract({ id }), {
            method: "POST",
            body: JSON.stringify(body),
            headers,
        });

        if (!res.ok) {
            throw handleApiError(res);
        }

        return await res.json();
    } catch (e) {
        console.error("Error while confirming contract:", e);
        throw e;
    }
};
