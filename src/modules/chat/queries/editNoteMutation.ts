import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { EditNotePayload } from "../types";

const editNoteMutation = async ({
    content,
    id,
}: EditNotePayload): Promise<string> => {
    try {
        const headers = getAuthHeaders();

        const res = await fetch(url.chat.editNote({ id }), {
            method: "POST",
            headers,
            body: JSON.stringify({ content }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw handleApiError(data);
        }

        return data; // Zwracamy zaktualizowaną notatkę
    } catch (error) {
        console.error("Error editing note:", error);
        throw error; // Przekazanie błędu do wyższych warstw
    }
};

export default editNoteMutation;
