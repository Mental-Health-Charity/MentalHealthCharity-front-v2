import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { PublicProfile } from "../types";

const updateAvatarMutation = async ({ id, avatar }: { id: number; avatar: File }): Promise<PublicProfile> => {
    const headers = getAuthHeaders();
    headers.delete("Content-Type");
    headers.delete("content-type");

    const formData = new FormData();
    formData.append("avatar", avatar, avatar.name);

    try {
        const res = await fetch(url.users.updateUserAvatar({ id }), {
            method: "PUT",
            headers,
            body: formData,
        });

        if (!res.ok) {
            throw handleApiError(res);
        }

        return await res.json();
    } catch (e) {
        handleApiError(e);
        throw e;
    }
};

export default updateAvatarMutation;
