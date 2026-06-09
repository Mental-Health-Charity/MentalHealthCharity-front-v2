import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { MenteeMatchingState } from "../../matching/types";

const queueMenteeFormMutation = async ({ id }: { id: number }): Promise<MenteeMatchingState> => {
    const response = await fetch(url.matching.queueForm({ id }), {
        method: "POST",
        headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
        await handleApiError(data);
    }

    return data;
};

export default queueMenteeFormMutation;
