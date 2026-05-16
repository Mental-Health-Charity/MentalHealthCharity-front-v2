import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { MatchingRunResult } from "../types";

const runMatchingMutation = async (): Promise<MatchingRunResult> => {
    const response = await fetch(url.matching.run, {
        method: "POST",
        headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
        await handleApiError(data);
    }

    return data;
};

export default runMatchingMutation;
