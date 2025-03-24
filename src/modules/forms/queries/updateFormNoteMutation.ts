import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { Form, FormNotePayload, MenteeForm, VolunteerForm } from "../types";

const updateFormNoteMutation = async ({
    id,
    notes,
}: FormNotePayload): Promise<Form<MenteeForm | VolunteerForm> | undefined> => {
    const headers = getAuthHeaders();

    try {
        const res = await fetch(url.form.updateNote({ id }), {
            method: "PUT",
            headers,
            body: JSON.stringify({
                notes,
            }),
        });

        if (!res.ok) {
            throw handleApiError(res);
        }

        return await res.json();
    } catch (e) {
        console.error("While updating note:", e);
        throw e;
    }
};

export default updateFormNoteMutation;
