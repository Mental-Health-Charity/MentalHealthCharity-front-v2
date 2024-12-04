import Cookies from "js-cookie";
import { User } from "../types";
import { url } from "../../../api";
import handleApiError from "../../shared/helpers/handleApiError";

const fetchUserData = async (): Promise<User> => {
    try {
        const token = Cookies.get("token");
        const tokenType = Cookies.get("jwt_type");

        if (!token || !tokenType) {
            throw new Error("Brak tokenu.");
        }

        const response = await fetch(url.users.readUsersMe, {
            headers: {
                Authorization: `${tokenType} ${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw handleApiError(data);
        }

        return data;
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
};

export default fetchUserData;
