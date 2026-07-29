import { queryOptions, UseQueryOptions } from "@tanstack/react-query";
import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { Pagination } from "../../shared/types";
import { Article, ReadPublicArticlesOptions } from "../types";

export const readPublicArticlesQueryOptions = (
    options: ReadPublicArticlesOptions,
    additional?: Omit<UseQueryOptions<Pagination<Article>>, "queryFn">
) =>
    queryOptions<Pagination<Article>>({
        queryKey: ["public_articles"],
        queryFn: async () => {
            try {
                // Send the token so reviewers can list non-published articles;
                // anonymous callers still only receive published ones.
                const response = await fetch(url.articles.readPublicArticles(options), {
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
