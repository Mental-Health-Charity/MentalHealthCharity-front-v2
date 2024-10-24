import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import { ErrorMessage } from "../../shared/types";
import { ReportPayload } from "../types";

const createReportMutationOptions = async (payload: ReportPayload) => {
  const headers = getAuthHeaders();

  const res = await fetch(url.reports.create, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(ErrorMessage.FAILED_TO_SAVE_NOTE);
  }
};

export default createReportMutationOptions;
