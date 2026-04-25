import Cookies from "js-cookie";
import { url } from "../../../api";
import { ApiError } from "../../shared/types";
import { User } from "../types";

async function parseBody(response: Response) {
    const text = await response.text();
    if (!text) return null;

    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}

const fetchUserData = async (): Promise<User> => {
    try {
        const token = Cookies.get("token");
        const tokenType = Cookies.get("jwt_type");

        if (!token || !tokenType) {
            throw new ApiError("Missing token", 401);
        }

        const response = await fetch(url.users.readUsersMe, {
            headers: {
                Authorization: `${tokenType} ${token}`,
            },
        });

        const data = await parseBody(response);

        if (!response.ok) {
            const message = data?.detail ?? data?.message ?? response.statusText;
            throw new ApiError(message, response.status, data);
        }

        return data;
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
};

export default fetchUserData;
