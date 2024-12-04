import { queryOptions } from "@tanstack/react-query";
import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import { Pagination } from "../../shared/types";
import { Report } from "../types";
import handleApiError from "../../shared/helpers/handleApiError";

export const getReportsQueryOptions = () =>
    queryOptions<Pagination<Report>>({
        queryKey: ["reports"],
        refetchOnWindowFocus: true,
        queryFn: async () => {
            const headers = getAuthHeaders();

            try {
                const response = await fetch(url.reports.get, { headers });
                const data = await response.json();

                if (!response.ok) {
                    throw handleApiError(response);
                }

                return data;
            } catch (error) {
                console.error("Error fetching reports:", error);
                throw error;
            }
        },
    });
