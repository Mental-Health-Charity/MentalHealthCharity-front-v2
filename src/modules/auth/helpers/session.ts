import Cookies from "js-cookie";
import { ApiError } from "../../shared/types";

const AUTH_COOKIE_NAMES = ["token", "jwt_type"];

export const clearAuthSession = () => {
    AUTH_COOKIE_NAMES.forEach((cookieName) => Cookies.remove(cookieName));
};

export const isAuthSessionError = (error: unknown) => {
    return error instanceof ApiError && (error.status === 401 || error.status === 403);
};

export const redirectToLogin = () => {
    const { pathname, search } = window.location;

    if (pathname === "/login") {
        return;
    }

    const next = `${pathname}${search}`;
    const params = new URLSearchParams();

    if (next !== "/") {
        params.set("next", next);
    }

    const query = params.toString();
    window.location.replace(`/login${query ? `?${query}` : ""}`);
};
