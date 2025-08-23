import { QueryClient } from "@tanstack/react-query";
import handleApiError from "./handleApiError";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false, onError: (err) => handleApiError(err) },
    },
});
