import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { ManualPairRequest, ManualPairResponse } from "../types";

const manualPairMutation = async (payload: ManualPairRequest): Promise<ManualPairResponse> => {
    const response = await fetch(url.matching.manualPair, {
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

export default manualPairMutation;
