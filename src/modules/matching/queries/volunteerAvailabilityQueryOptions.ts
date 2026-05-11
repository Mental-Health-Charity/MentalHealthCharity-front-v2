import { queryOptions, UseQueryOptions } from "@tanstack/react-query";
import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { VolunteerAvailabilityStatus } from "../types";

export const volunteerAvailabilityQueryOptions = (
    additionals?: Omit<UseQueryOptions<VolunteerAvailabilityStatus>, "queryKey" | "queryFn">
) =>
    queryOptions<VolunteerAvailabilityStatus>({
        queryKey: ["volunteerAvailability"],
        queryFn: async () => {
            const response = await fetch(url.matching.volunteerAvailability, {
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                throw handleApiError(response);
            }

            return response.json();
        },
        ...additionals,
    });
