import { ApiError } from "../types";

async function parseBody(res: Response) {
    const text = await res.text();
    if (!text) return null;
    const contentType = res.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
        try {
            return JSON.parse(text);
        } catch {
            return text;
        }
    }
    return text;
}

export async function fetchJson(input: RequestInfo, init?: RequestInit) {
    const res = await fetch(input, init);
    const data = await parseBody(res);

    if (!res.ok) {
        const message = data?.detail ?? data?.message ?? res.statusText ?? `HTTP ${res.status}`;
        throw new ApiError(message, res.status, data); // <- KLUCZ: throw!
    }

    return data;
}
