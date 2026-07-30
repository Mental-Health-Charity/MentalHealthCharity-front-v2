import { queryOptions, UseQueryOptions } from "@tanstack/react-query";
import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import { ReadPublicArticlesOptions } from "../types";
import { Article } from "../types";
import { Pagination } from "../../shared/types";
import handleApiError from "../../shared/helpers/handleApiError";

export const articlesByUserQueryOptions = (
    options: ReadPublicArticlesOptions,
    additional?: Omit<UseQueryOptions<Pagination<Article>>, "queryFn">
) =>
    queryOptions<Pagination<Article>>({
        queryKey: ["articles"],
        queryFn: async () => {
            try {
                // Send the token so the author (and reviewers) can see their own
                // non-published articles; others only receive published ones.
                const response = await fetch(url.articles.readByUser(options), {
                    headers: getAuthHeaders({ withContentType: false }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw handleApiError(data);
                }

                return data;
            } catch (error) {
                console.error("Error fetching articles:", error);
                throw error;
            }
        },
        ...additional,
    });
