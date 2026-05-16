import { queryOptions } from "@tanstack/react-query";
import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { MatchingAutomationSettings } from "../types";

export const matchingSettingsQueryOptions = () =>
    queryOptions<MatchingAutomationSettings>({
        queryKey: ["matching", "admin", "settings"],
        queryFn: async () => {
            const response = await fetch(url.matching.settings, {
                headers: getAuthHeaders(),
            });

            const data = await response.json();

            if (!response.ok) {
                await handleApiError(data);
            }

            return data;
        },
    });
