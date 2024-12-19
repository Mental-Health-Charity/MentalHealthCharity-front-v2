import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import { User } from "../../auth/types";
import handleApiError from "../../shared/helpers/handleApiError";
import { EditUserFormValues } from "../types";

const editUserAsAdminMutation = async ({
    id,
    payload,
}: {
    id: number;
    payload: EditUserFormValues;
}): Promise<User> => {
    const headers = getAuthHeaders();

    try {
        const res = await fetch(url.users.updateUserByAdmin({ id }), {
            method: "PUT",
            headers,
            body: JSON.stringify({
                ...payload,
                is_active: true,
            }),
        });

        if (!res.ok) {
            throw handleApiError(res);
        }

        return await res.json();
    } catch (e) {
        console.error("While edit user:", e);
        throw e;
    }
};

export default editUserAsAdminMutation;
