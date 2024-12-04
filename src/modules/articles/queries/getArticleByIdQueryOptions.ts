import { queryOptions } from "@tanstack/react-query";
import { url } from "../../../api";
import { ReadArticleOptions } from "../types";
import { Article } from "../types";
import handleApiError from "../../shared/helpers/handleApiError";

export const getArticleByIdQueryOptions = (options: ReadArticleOptions) =>
    queryOptions<Article>({
        queryKey: ["article", options],
        queryFn: async () => {
            try {
                const response = await fetch(url.articles.readById(options));

                const data = await response.json();

                if (!response.ok) {
                    throw handleApiError(data);
                }

                return data;
            } catch (error) {
                console.error("Error fetching article:", error);
                throw error;
            }
        },
    });
