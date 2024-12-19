import { Box, Card, Chip, Typography, useTheme } from "@mui/material";
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
                    border: `2px solid ${theme.palette.colors.border}`,
                    backgroundColor: theme.palette.background.paper,
                    flexWrap: "wrap",
                }}
            >
                <ArticleAuthor user={article.created_by} />
            </Box>
            <Box
                sx={{
                    margin: "30px 0 35px 0",
                }}
            >
                <Typography
                    sx={{ fontSize: "48px", fontWeight: "bold" }}
                    component="h1"
                    color="textSecondary"
                >
                    {article.title}
                </Typography>
                <Typography
                    sx={{
                        fontSize: "20px",
                        fontWeight: 500,
                        color: theme.palette.text.light,
                    }}
                    component="p"
                >
                    {t("common.created_at", {
                        date: formatDate(article.creation_date),
                    })}
                </Typography>
                <Chip
                    label={article.article_category.name}
                    color="info"
                    sx={{
                        fontSize: "20px",
                        padding: "20px",
                        fontWeight: 500,
                        marginTop: "10px",
                    }}
                />
            </Box>
            {article.video_url && (
                <Videoplayer
                    sx={{ height: "600px", marginTop: "20px" }}
                    src={article.video_url}
                />
            )}

            <Markdown readOnly content={article.content} />

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
