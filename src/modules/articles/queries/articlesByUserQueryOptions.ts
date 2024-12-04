import { queryOptions, UseQueryOptions } from "@tanstack/react-query";
import { url } from "../../../api";
import { ReadPublicArticlesOptions } from "../types";
import { Article } from "../types";
import { Pagination } from "../../shared/types";
import handleApiError from "../../shared/helpers/handleApiError";

export const articlesByUserQueryOptions = (
    options: ReadPublicArticlesOptions,
    additional: Omit<
        UseQueryOptions<Pagination<Article>>,
        "queryKey" | "queryFn"
    >
) =>
    queryOptions<Pagination<Article>>({
        queryKey: ["articles"],
        queryFn: async () => {
            try {
                const response = await fetch(url.articles.readByUser(options));

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
