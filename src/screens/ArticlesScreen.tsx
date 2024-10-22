import { useQuery } from "@tanstack/react-query";
import { articlesQueryOptions } from "../modules/articles/queries/articlesQueryOptions";
import { useState } from "react";
import { Box } from "@mui/material";
import ArticleCard from "../modules/articles/components/ArticleCard";
import Container from "../modules/shared/components/Container";
import ArticlesHeading from "../modules/articles/components/ArticlesHeading";

const ArticlesScreen = () => {
  const [query, setQuery] = useState("");
  const [page, _setPage] = useState(1);

  const { data } = useQuery(articlesQueryOptions({ query, page, size: 50 }));
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
