import { url } from "../../../api";
import { apiClient } from "../../shared/helpers/apiClient";
import { ChangePasswordBeginPayload } from "../types";

export const changePasswordBegin = (payload: ChangePasswordBeginPayload) =>
    apiClient.post(url.users.changePasswordBegin, payload);
