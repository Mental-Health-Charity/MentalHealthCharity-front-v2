import { ChangePasswordValues} from '../../users/types.ts';
import { url } from "../../../api.ts";
import handleApiError from "../../shared/helpers/handleApiError";

import getAuthHeaders from '../../auth/helpers/getAuthHeaders.ts';

export const ChangePasswordMutation = async (payload: ChangePasswordValues): Promise<string> => {
    const headers = getAuthHeaders();
    try {
        const res = await fetch(url.users.changePassword, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            throw handleApiError(res)
        }
        return "";
    } catch (error) {
        console.error('Error during changing password', error);
        throw error;
    }
};