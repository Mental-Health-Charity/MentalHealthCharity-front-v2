import { queryOptions, UseQueryOptions } from "@tanstack/react-query";
import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { MenteeMatchingState } from "../types";

export const myMatchingStateQueryOptions = (
    additionals?: Omit<UseQueryOptions<MenteeMatchingState | null>, "queryKey" | "queryFn">
) =>
    queryOptions<MenteeMatchingState | null>({
        queryKey: ["matching", "me", "state"],
        queryFn: async () => {
            const response = await fetch(url.matching.myState, {
                headers: getAuthHeaders(),
            });

            const data = await response.json();

            if (!response.ok) {
                await handleApiError(data);
            }

            return data;
        },
        ...additionals,
    });
