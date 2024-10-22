import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  Button,
  Box,
  Avatar,
  Chip,
  useTheme,
} from "@mui/material";

import { Link } from "react-router-dom";
import { Article } from "../../types";
import { useTranslation } from "react-i18next";

interface Props {
  article: Article;
}

const ArticleCard = ({ article }: Props) => {
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <Card
      sx={{
        width: "470px",
        borderRadius: 2,
        padding: "10px",
      }}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="250"
          image={article.banner_url}
          alt={article.title}
          sx={{ borderRadius: "10px" }}
        />
        <Chip
          label={article.article_category.name}
          size="small"
          sx={{
            fontWeight: "bold",
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.secondary,
            fontSize: 16,
            padding: "16px",
            textTransform: "uppercase",
            position: "absolute",
            top: 10,
            right: 10,
            boxShadow: 1,
          }}
        />
      </Box>
      <CardContent>
        <Box display="flex" alignItems="center" mb={1}>
          <Avatar
            variant="rounded"
            src={article.created_by.chat_avatar_url}
            alt={article.created_by.full_name}
            sx={{ width: 24, height: 24, mr: 1 }}
          />
          <Typography variant="body1" color="text.secondary">
            {article.created_by.full_name}
          </Typography>
        </Box>
        <Typography
          gutterBottom
          variant="h5"
          component="p"
          color="text.secondary"
          fontWeight={600}
        >
          {article.title}
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ minHeight: "40px" }}
        >
          {article.content.length > 100
            ? `${article.content.substring(0, 100)}...`
            : article.content}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          color="primary"
          component={Link}
          size="small"
          variant="contained"
          fullWidth
          to={`/article/${article.id}`}
          sx={{ padding: "5px 20px" }}
        >
          {t("articles.read_more")}
        </Button>
        <Button
          color="primary"
          component={Link}
          size="small"
          variant="outlined"
          fullWidth
          to={`/article/edit/${article.id}`}
          sx={{ padding: "3px 20px" }}
        >
          {t("articles.manage")}
        </Button>
      </CardActions>
    </Card>
  );
};

export default ArticleCard;
