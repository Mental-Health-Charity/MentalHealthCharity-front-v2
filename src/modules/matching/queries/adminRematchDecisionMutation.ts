import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { MenteeMatchingState, RematchDecisionRequest } from "../types";

interface AdminRematchDecisionPayload extends RematchDecisionRequest {
    userId: number;
}

const adminRematchDecisionMutation = async ({
    userId,
    ...payload
}: AdminRematchDecisionPayload): Promise<MenteeMatchingState> => {
    const response = await fetch(url.matching.adminRematchDecision({ id: userId }), {
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

export default adminRematchDecisionMutation;
