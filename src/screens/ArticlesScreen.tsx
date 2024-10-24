import { useQuery } from "@tanstack/react-query";
import { articlesQueryOptions } from "../modules/articles/queries/articlesQueryOptions";
import { useState, useEffect, useCallback } from "react";
import { Box } from "@mui/material";
import ArticleCard from "../modules/articles/components/ArticleCard";
import Container from "../modules/shared/components/Container";
import ArticlesHeading from "../modules/articles/components/ArticlesHeading";
import debounce from "lodash.debounce";

const ArticlesScreen = () => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [page, _setPage] = useState(1);

  const debouncedSetQuery = useCallback(
    debounce((q) => {
      setDebouncedQuery(q);
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSetQuery(query);
  }, [query, debouncedSetQuery]);

  const { data } = useQuery(
    articlesQueryOptions({ q: debouncedQuery, page, size: 50 })
  );

  return (
    <Container waves>
      <ArticlesHeading onSearch={setQuery} search={query} />
      <Box
        gap={2}
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {data &&
          data.items.map((article) => (
            <ArticleCard article={article} key={article.id} />
          ))}
      </Box>
    </Container>
  );
};

export default ArticlesScreen;
