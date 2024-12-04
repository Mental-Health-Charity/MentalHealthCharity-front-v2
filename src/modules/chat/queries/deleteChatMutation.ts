import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";

const deleteChatMutation = async (id: number) => {
    const headers = getAuthHeaders();

    try {
        const response = await fetch(url.chat.editChat({ id }), {
            method: "DELETE",
            headers,
        });

        if (!response.ok) {
            throw handleApiError(response);
        }

        return await response.json();
    } catch (e) {
        handleApiError(e);
    }
};

export default deleteChatMutation;
