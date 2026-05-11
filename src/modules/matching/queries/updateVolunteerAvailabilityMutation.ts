import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { VolunteerAvailabilityStatus, VolunteerAvailabilityUpdate } from "../types";

const updateVolunteerAvailabilityMutation = async (
    payload: VolunteerAvailabilityUpdate
): Promise<VolunteerAvailabilityStatus> => {
    const response = await fetch(url.matching.volunteerAvailability, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw handleApiError(response);
    }

    return response.json();
};

export default updateVolunteerAvailabilityMutation;
