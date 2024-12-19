import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { Form, MenteeForm, VolunteerForm } from "../types";

const acceptFormMutation = async ({
    id,
}: {
    id: number;
}): Promise<Form<MenteeForm | VolunteerForm> | undefined> => {
    const headers = getAuthHeaders();

    try {
        const res = await fetch(url.form.accept({ id }), {
            method: "PUT",
            headers,
        });

        if (!res.ok) {
            throw handleApiError(res);
        }

        return await res.json();
    } catch (e) {
        console.error("While accepting form:", e);
        throw e;
    }
};

export default acceptFormMutation;
