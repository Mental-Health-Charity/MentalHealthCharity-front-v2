import Cookies from "js-cookie";

type GetAuthHeadersOptions = {
    withContentType?: boolean;
};

const getAuthHeaders = (options: GetAuthHeadersOptions = {}): Headers => {
    const { withContentType = true } = options;

    const headers = new Headers();

    const jwtTokenType = Cookies.get("jwt_type");
    const jwtToken = Cookies.get("token");

    if (withContentType) {
        headers.append("Content-Type", "application/json");
    }

    if (jwtTokenType && jwtToken) {
        headers.append("Authorization", `${jwtTokenType} ${jwtToken}`);
    }

    return headers;
};

export default getAuthHeaders;
