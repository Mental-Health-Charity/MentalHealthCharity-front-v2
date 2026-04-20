import { url } from "../../../api";
import handleApiError from "../../shared/helpers/handleApiError";
import { RegisterPayload, RegisterResponse } from "../types";

export const registerMutation = async (data: RegisterPayload): Promise<RegisterResponse> => {
    try {
        const payload: Record<string, string> = {
            email: data.email,
            password: data.password,
            full_name: data.full_name,
        };

        if (data.intent) {
            payload.intent = data.intent;
        }

        if (data.next) {
            payload.next = data.next;
        }

        const registerResponse = await fetch(url.users.createUserOpen, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
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
