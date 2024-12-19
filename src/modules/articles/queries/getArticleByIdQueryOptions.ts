import { queryOptions, UseQueryOptions } from "@tanstack/react-query";
import { baseUrl, url } from "../../../api";
import { ReadArticleOptions } from "../types";
import { Article } from "../types";
import handleApiError from "../../shared/helpers/handleApiError";

export const getArticleByIdQueryOptions = (
    options: ReadArticleOptions,
    additional: Omit<UseQueryOptions<Article>, "queryKey" | "queryFn">
) =>
    queryOptions<Article>({
        queryKey: ["article", options],
        ...additional,
        queryFn: async () => {
            try {
                const response = await fetch(url.articles.readById(options));

                const data: Article = await response.json();

                const transformedData: Article = {
                    ...data,
                    banner_url: baseUrl + data.banner_url,
                };

                if (!response.ok) {
                    throw handleApiError(data);
                }

                return transformedData;
            } catch (error) {
                console.error("Error fetching article:", error);
                throw error;
            }
        },
    });
