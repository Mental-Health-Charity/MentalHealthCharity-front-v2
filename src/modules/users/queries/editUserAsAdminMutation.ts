import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import { User } from "../../auth/types";
import handleApiError from "../../shared/helpers/handleApiError";
import { EditUserFormValues } from "../types";

const editUserAsAdminMutation = async ({ id, payload }: { id: number; payload: EditUserFormValues }): Promise<User> => {
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

        let user = await res.json();

        const automationRes = await fetch(url.matching.updateUserAutomationExclusion({ id }), {
            method: "PUT",
            headers,
            body: JSON.stringify({
                excluded_from_automation: payload.excluded_from_automation,
            }),
        });

        if (!automationRes.ok) {
            throw handleApiError(automationRes);
        }

        user = await automationRes.json();

        return user;
    } catch (e) {
        console.error("While edit user:", e);
        throw e;
    }
};

export default editUserAsAdminMutation;
