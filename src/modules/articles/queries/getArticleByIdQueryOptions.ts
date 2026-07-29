import { queryOptions, UseQueryOptions } from "@tanstack/react-query";
import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
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
                // Send the token when available so authors/reviewers can load
                // their own unpublished articles; anonymous callers still get
                // published ones.
                const response = await fetch(url.articles.readById(options), {
                    headers: getAuthHeaders({ withContentType: false }),
                });

                const data: Article = await response.json();

                if (!response.ok) {
                    throw handleApiError(data);
                }

                // Keep banner_url as the raw path the server returned; it is
                // resolved to an absolute URL at render time via resolveAssetUrl.
                // (Prepending baseUrl here caused it to be persisted back on edit
                // and then doubled on the next read.)
                return data;
            } catch (error) {
                console.error("Error fetching article:", error);
                throw error;
            }
        },
    });
