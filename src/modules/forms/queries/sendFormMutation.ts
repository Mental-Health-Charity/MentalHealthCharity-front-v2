import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { Form, MenteeForm, VolunteerForm } from "../types";

const sendFormMutation = async (
    payload: Form<MenteeForm | VolunteerForm>
): Promise<Form<MenteeForm | VolunteerForm> | undefined> => {
    const headers = getAuthHeaders();

    try {
        const res = await fetch(url.form.create, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            throw handleApiError(res);
        }

        return await res.json();
    } catch (e) {
        console.error("While sending form:", e);
        throw e;
    }
};

export default sendFormMutation;
