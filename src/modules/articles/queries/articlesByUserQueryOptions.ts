import { queryOptions } from "@tanstack/react-query";
import { url } from "../../../api";
import { ReadPublicArticlesOptions } from "../types";
import { Article } from "../types";
import { Pagination } from "../../shared/types";

export const articlesByUserQueryOptions = (
  options: ReadPublicArticlesOptions
) =>
  queryOptions<Pagination<Article>>({
    queryKey: ["articles", options],
    queryFn: async () => {
      const response = await fetch(url.articles.readByUser(options));

      if (!response.ok) {
        throw new Error("Failed to fetch articles");
      }

      return response.json();
    },
  });
