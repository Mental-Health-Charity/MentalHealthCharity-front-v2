import { queryOptions } from "@tanstack/react-query";
import { url } from "../../../api";
import { ReadArticleOptions } from "../types";
import { Article } from "../types";

export const getArticleByIdQueryOptions = (options: ReadArticleOptions) =>
  queryOptions<Article>({
    queryKey: ["article", options],
    queryFn: async () => {
      const response = await fetch(url.articles.readById(options));

      if (!response.ok) {
        throw new Error("Failed to fetch article");
      }

      return response.json();
    },
  });
