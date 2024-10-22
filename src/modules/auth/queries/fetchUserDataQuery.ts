import Cookies from "js-cookie";
import { User } from "../types";
import { url } from "../../../api";

const fetchUserData = async (): Promise<User> => {
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

  return response.json();
};

export default fetchUserData;
