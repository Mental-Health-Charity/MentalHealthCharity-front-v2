import { LoginAccessTokenResponse, LoginFormValues } from "../types";
import { url } from "../../../api";
import Cookies from "js-cookie";

export const loginMutation = async (
  data: LoginFormValues
): Promise<LoginAccessTokenResponse> => {
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

  if (!loginResponse.ok) {
    throw new Error("An error occurred while logging in.");
  }

  const tokenData: LoginAccessTokenResponse = await loginResponse.json();

  Cookies.set("token", tokenData.access_token, { expires: 7 });
  Cookies.set("jwt_type", tokenData.token_type, { expires: 7 });

  return tokenData;
};
