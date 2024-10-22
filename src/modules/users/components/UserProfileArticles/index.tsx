import { useTranslation } from "react-i18next";
import SimpleCard from "../../../shared/components/SimpleCard";
import { Article } from "../../../articles/types";
import ArticleCard from "../../../articles/components/ArticleCard";
import { Box } from "@mui/material";

interface Props {
  articles: Article[];
}

const UserProfileArticles = ({ articles }: Props) => {
  const { t } = useTranslation();
  return (
    <SimpleCard
      subtitleProps={{
        fontSize: "20px",
      }}
      subtitle={t("profile.articles_subtitle")}
    >
      <Box
        sx={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          justifyContent: "space-between",
          marginTop: "10px",
        }}
      >
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </Box>
    </SimpleCard>
  );
};

export default UserProfileArticles;
