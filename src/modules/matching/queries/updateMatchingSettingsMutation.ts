import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { MatchingAutomationSettings, MatchingAutomationSettingsUpdate } from "../types";

const updateMatchingSettingsMutation = async (
    payload: MatchingAutomationSettingsUpdate
): Promise<MatchingAutomationSettings> => {
    const response = await fetch(url.matching.settings, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
        await handleApiError(data);
    }

    return data;
};

export default updateMatchingSettingsMutation;
