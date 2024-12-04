import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { ReportPayload } from "../types";

const createReportMutationOptions = async (payload: ReportPayload) => {
    try {
        const headers = getAuthHeaders();

        const res = await fetch(url.reports.create, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
            throw handleApiError(data);
        }
    } catch (error) {
        console.error("Error creating report:", error);
        throw error;
    }
};

export default createReportMutationOptions;
