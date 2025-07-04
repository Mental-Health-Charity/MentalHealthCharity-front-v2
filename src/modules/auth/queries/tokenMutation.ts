import Cookies from "js-cookie";
import { url } from "../../../api";
import handleApiError from "../../shared/helpers/handleApiError";
import { LoginAccessTokenResponse, LoginFormValues } from "../types";

export const loginMutation = async (data: LoginFormValues): Promise<LoginAccessTokenResponse> => {
    try {
        const loginResponse = await fetch(url.login.loginAccessToken, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                username: data.email,
                password: data.password,
            }),
        });

        const tokenData = await loginResponse.json();

        if (!loginResponse.ok) {
            throw handleApiError(tokenData);
        }

        Cookies.set("token", tokenData.access_token, { expires: 7 });
        Cookies.set("jwt_type", tokenData.token_type, { expires: 7 });

        return tokenData;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
};
