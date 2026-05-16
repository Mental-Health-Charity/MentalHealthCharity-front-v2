import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { Chat, UpdateChatAutoMatchingPayload } from "../types";

const updateChatAutoMatchingMutation = async ({
    id,
    auto_matching_enabled,
}: UpdateChatAutoMatchingPayload): Promise<Chat> => {
    const response = await fetch(url.matching.updateChatAutoMatching({ id }), {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ auto_matching_enabled }),
    });

    const data = await response.json();

    if (!response.ok) {
        await handleApiError(data);
    }

    return data;
};

export default updateChatAutoMatchingMutation;
