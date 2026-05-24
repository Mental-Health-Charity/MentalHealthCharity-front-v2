import { queryOptions } from "@tanstack/react-query";
import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { MenteeMatchingItem } from "../types";

const fetchMenteeMatchingItems = async (endpoint: string): Promise<MenteeMatchingItem[]> => {
    const response = await fetch(endpoint, {
        headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
        await handleApiError(data);
    }

    return data;
};

export const waitingMenteesQueryOptions = () =>
    queryOptions<MenteeMatchingItem[]>({
        queryKey: ["matching", "mentees", "waiting"],
        queryFn: () => fetchMenteeMatchingItems(url.matching.waitingMentees),
    });

export const matchedMenteesQueryOptions = () =>
    queryOptions<MenteeMatchingItem[]>({
        queryKey: ["matching", "mentees", "matched"],
        queryFn: () => fetchMenteeMatchingItems(url.matching.matchedMentees),
    });

export const pausedMenteesQueryOptions = () =>
    queryOptions<MenteeMatchingItem[]>({
        queryKey: ["matching", "mentees", "paused"],
        queryFn: () => fetchMenteeMatchingItems(url.matching.pausedMentees),
    });
