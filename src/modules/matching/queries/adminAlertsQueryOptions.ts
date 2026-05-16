import { queryOptions } from "@tanstack/react-query";
import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { AdminAlert } from "../types";

export const adminAlertsQueryOptions = () =>
    queryOptions<AdminAlert[]>({
        queryKey: ["matching", "admin", "alerts"],
        queryFn: async () => {
            const response = await fetch(url.matching.alerts, {
                headers: getAuthHeaders(),
            });

            const data = await response.json();

            if (!response.ok) {
                await handleApiError(data);
            }

            return data;
        },
    });
