import { RegisterFormValues, RegisterResponse } from "../types";
import { url } from "../../../api";
import handleApiError from "../../shared/helpers/handleApiError";

export const registerMutation = async (
    data: RegisterFormValues
): Promise<RegisterResponse> => {
    try {
        const registerResponse = await fetch(url.users.createUserOpen, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: data.email,
                password: data.password,
                full_name: data.full_name,
            }),
        });

        const newUser = await registerResponse.json();

        if (!registerResponse.ok) {
            throw handleApiError(newUser);
        }

        return newUser;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
};
