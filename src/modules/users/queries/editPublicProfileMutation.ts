import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import Errors from "../../shared/constants";
import { editPublicProfilePayload, PublicProfile } from "../types";

export const editPublicProfileMutation = async ({
    id,
    ...payload
}: editPublicProfilePayload): Promise<PublicProfile> => {
    const headers = getAuthHeaders();
    const res = await fetch(url.publicProfiles.update({ id }), {
        method: "PUT",
        headers,
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        throw new Error(Errors.failed_to_update_public_profile);
    }

    const profile = await res.json();

    return profile;
};
