import { Box, Card, Typography, useTheme } from "@mui/material";
import Container from "../../../shared/components/Container";
import { Article } from "../../types";
import formatDate from "../../../shared/helpers/formatDate";
import ArticleAuthor from "../ArticleAuthor";
import Markdown from "../../../shared/components/Markdown";
import Videoplayer from "../Videoplayer";
import ArticleCard from "../ArticleCard";
import { useTranslation } from "react-i18next";

interface Props {
  article: Article;
  articles?: Article[];
}

const ArticleView = ({ article, articles }: Props) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Container>
      <Box
        sx={{
          backgroundImage: `url(${article.banner_url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "100%",
          height: "500px",
          borderRadius: "10px",
          display: "flex",
          alignItems: "flex-end",
          padding: "20px",
          justifyContent: "space-between",
          boxShadow: `0 0 10px 5px ${theme.palette.shadows.box}`,
          flexWrap: "wrap",
        }}
      >
        <Box
          sx={{
            backgroundColor: "rgba(0,0,0,0.3)",
            borderRadius: "8px",
            padding: "25px",
            display: "flex",
            flexDirection: "column",
            width: "fit-content",
            minWidth: "300px",
            maxWidth: "800px",
          }}
        >
          <Typography
            sx={{ fontSize: "36px", fontWeight: "bold" }}
            component="h1"
            color="textPrimary"
          >
            {article.title}
          </Typography>
          <Typography
            color="textPrimary"
            sx={{
              fontSize: "20px",
              fontWeight: "bold",
            }}
            component="p"
          >
            {formatDate(article.creation_date)}
          </Typography>
        </Box>
        <ArticleAuthor user={article.created_by} />
      </Box>
      {article.video_url && (
        <Videoplayer
          sx={{ height: "600px", marginTop: "20px" }}
          src={article.video_url}
        />
      )}
      <Card
        sx={{
          minHeight: "500px",
          marginTop: "20px",
          padding: "20px",
          borderRadius: "10px",
        }}
        component="article"
      >
        <Markdown readOnly content={article.content} />
      </Card>
      <Box marginTop={2} display="flex" flexDirection="column" gap={2}>
        <Typography color="secondary" fontWeight={600} fontSize={20}>
          {t("articles.more_articles")}
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: "20px",
            justifyContent: "space-between",
          }}
        >
          {articles &&
            articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
        </Box>
      </Box>
    </Container>
  );
};

export default ArticleView;
