import { queryOptions } from "@tanstack/react-query";
import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import { ErrorMessage, Pagination } from "../../shared/types";
import { Report } from "../types";

export const getReportsQueryOptions = () =>
  queryOptions<Pagination<Report>>({
    queryKey: ["reports"],
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const headers = getAuthHeaders();
      const response = await fetch(url.reports.get, {
        headers,
      });

      if (!response.ok) {
        throw new Error(ErrorMessage.FAILED_TO_FETCH_REPORTS);
      }

      return response.json();
    },
  });
