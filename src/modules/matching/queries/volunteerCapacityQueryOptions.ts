import { queryOptions } from "@tanstack/react-query";
import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { VolunteerCapacityItem } from "../types";

export const volunteerCapacityQueryOptions = () =>
    queryOptions<VolunteerCapacityItem[]>({
        queryKey: ["matching", "volunteers", "capacity"],
        queryFn: async () => {
            const response = await fetch(url.matching.volunteers, {
                headers: getAuthHeaders(),
            });

            const data = await response.json();

            if (!response.ok) {
                await handleApiError(data);
            }

            return data;
        },
    });
