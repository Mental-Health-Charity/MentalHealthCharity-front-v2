import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { Form, MenteeForm, VolunteerForm } from "../types";

const rejectFormMutation = async ({
    id,
}: {
    id: number;
}): Promise<Form<MenteeForm | VolunteerForm> | undefined> => {
    const headers = getAuthHeaders();

    try {
        const res = await fetch(url.form.reject({ id }), {
            method: "PUT",
            headers,
            body: JSON.stringify({
                message: "Twój formularz został odrzucony",
            }),
        });

        if (!res.ok) {
            throw handleApiError(res);
        }

        return await res.json();
    } catch (e) {
        console.error("While rejecting form:", e);
        throw e;
    }
};

export default rejectFormMutation;
