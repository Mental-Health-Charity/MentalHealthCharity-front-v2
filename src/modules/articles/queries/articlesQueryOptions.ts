import { queryOptions } from "@tanstack/react-query";
import { url } from "../../../api";
import { SearchPublicArticlesOptions } from "../types";
import { Article } from "../types";
import { Pagination } from "../../shared/types";
import handleApiError from "../../shared/helpers/handleApiError";

export const articlesQueryOptions = (options: SearchPublicArticlesOptions) =>
    queryOptions<Pagination<Article>>({
        queryKey: ["articles", options],
        queryFn: async () => {
            try {
                const response = await fetch(
                    url.articles.searchPublicArticles(options)
                );

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
    });
