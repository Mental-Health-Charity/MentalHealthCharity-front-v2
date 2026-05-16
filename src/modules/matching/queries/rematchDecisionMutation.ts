import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { MenteeMatchingState, RematchDecisionRequest } from "../types";

const rematchDecisionMutation = async (payload: RematchDecisionRequest): Promise<MenteeMatchingState> => {
    const response = await fetch(url.matching.rematchDecision, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
        await handleApiError(data);
    }

    return data;
};

export default rematchDecisionMutation;
