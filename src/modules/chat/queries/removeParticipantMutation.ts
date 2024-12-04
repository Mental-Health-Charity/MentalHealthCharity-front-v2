import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { ParticipantOptions } from "../types";

const removeParticipantMutation = async (payload: ParticipantOptions) => {
    const headers = getAuthHeaders();

    try {
        const response = await fetch(url.chat.removeParticipant(payload), {
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

export default removeParticipantMutation;
