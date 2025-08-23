import { url } from "../../../api";
import { apiClient } from "../../shared/helpers/apiClient";
import { ChangePasswordCompletePayload } from "../types";

export const changePasswordCompleteMutation = (payload: ChangePasswordCompletePayload) =>
    apiClient.post(url.users.changePasswordComplete, payload);
