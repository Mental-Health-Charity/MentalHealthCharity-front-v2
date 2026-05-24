import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import { User } from "../../auth/types";
import handleApiError from "../../shared/helpers/handleApiError";

interface UpdateUserAutomationExclusionPayload {
    userId: number;
    excluded_from_automation: boolean;
}

const updateUserAutomationExclusionMutation = async ({
    userId,
    excluded_from_automation,
}: UpdateUserAutomationExclusionPayload): Promise<User> => {
    const response = await fetch(url.matching.updateUserAutomationExclusion({ id: userId }), {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ excluded_from_automation }),
    });

    const data = await response.json();

    if (!response.ok) {
        await handleApiError(data);
    }

    return data;
};

export default updateUserAutomationExclusionMutation;
