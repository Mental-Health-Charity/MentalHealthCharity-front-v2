import { url } from "../../../api";
import { apiClient } from "../../shared/helpers/apiClient";
import { LoginAccessTokenResponse, LoginFormValues } from "../types";

export const loginMutation = async (data: LoginFormValues): Promise<LoginAccessTokenResponse> => {
    const fd = new FormData();
    fd.append("username", data.email);
    fd.append("password", data.password);

    return apiClient.postFormData(url.login.loginAccessToken, fd);
};
