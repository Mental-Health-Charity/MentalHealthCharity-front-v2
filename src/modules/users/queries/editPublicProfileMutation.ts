import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { editPublicProfilePayload, PublicProfile } from "../types";

export const editPublicProfileMutation = async ({
    id,
    ...payload
}: editPublicProfilePayload): Promise<PublicProfile> => {
    try {
        const headers = getAuthHeaders();
        const res = await fetch(url.publicProfiles.update({ id }), {
            method: "PUT",
            headers,
            body: JSON.stringify(payload),
        });

        const profile = await res.json();

        return profile;
    } catch (err) {
        handleApiError(err);
        throw err;
    }
};
