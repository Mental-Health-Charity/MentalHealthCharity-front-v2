import Cookies from "js-cookie";

const getAuthHeaders = () => {
    const headers = new Headers();

    const jwtTokenType = Cookies.get("jwt_type");
    const jwtToken = Cookies.get("token");

    headers.append("Content-Type", "application/json");
    headers.append("Authorization", `${jwtTokenType} ${jwtToken}`);

    return headers;
};

export default getAuthHeaders;
