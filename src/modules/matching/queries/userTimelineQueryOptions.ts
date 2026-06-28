import { queryOptions } from "@tanstack/react-query";
import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import { fetchJson } from "../../shared/helpers/fetchJson";
import { UserTimelineOptions, UserTimelineResponse } from "../types";

export const userTimelineQueryOptions = (options: UserTimelineOptions, enabled: boolean) =>
    queryOptions<UserTimelineResponse>({
        queryKey: ["matching", "user-timeline", options.user_id ?? options.email],
        queryFn: () =>
            fetchJson(url.matching.userTimeline(options), {
                headers: getAuthHeaders(),
            }) as Promise<UserTimelineResponse>,
        enabled,
        retry: false,
    });
