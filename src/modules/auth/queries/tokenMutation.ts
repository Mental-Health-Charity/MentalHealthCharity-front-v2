import { url } from "../../../api";
import { apiClient } from "../../shared/helpers/apiClient";
import { LoginAccessTokenResponse, LoginFormValues } from "../types";

export const loginMutation = async (data: LoginFormValues): Promise<LoginAccessTokenResponse> =>
    apiClient.post(url.login.loginAccessToken, {
        username: data.email,
        password: data.password,
    });
