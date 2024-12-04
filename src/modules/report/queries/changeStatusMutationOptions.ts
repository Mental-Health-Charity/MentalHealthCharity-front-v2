import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { ChangeReportStatusPayload } from "../types";

const changeStatusMutationOptions = async (
    payload: ChangeReportStatusPayload
) => {
    try {
        const headers = getAuthHeaders();

        const res = await fetch(url.reports.changeStatus(payload), {
            method: "PUT",
            headers,
        });

        const data = await res.json();

        if (!res.ok) {
            throw handleApiError(data);
        }
    } catch (error) {
        console.error("Error changing report status:", error);
        throw error;
    }
};

export default changeStatusMutationOptions;
