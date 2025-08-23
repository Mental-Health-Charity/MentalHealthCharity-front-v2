/* eslint-disable */
import { fetchJson } from "./fetchJson";

export const apiClient = {
    get: (url: string, opts?: RequestInit) => fetchJson(url, { method: "GET", ...opts }),
    post: (url: string, body?: any, opts?: RequestInit) =>
        fetchJson(url, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...(opts?.headers ?? {}) },
            body: body ? JSON.stringify(body) : undefined,
            ...opts,
        }),
    put: (url: string, body?: any, opts?: RequestInit) =>
        fetchJson(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json", ...(opts?.headers ?? {}) },
            body: body ? JSON.stringify(body) : undefined,
            ...opts,
        }),
    del: (url: string, opts?: RequestInit) => fetchJson(url, { method: "DELETE", ...opts }),
};
