import GavelIcon from "@mui/icons-material/Gavel";
import { Box, Button } from "@mui/material";
import { useState } from "react";
import { Article, UpdateStatusFormValues } from "../../types";
import ArticleCard from "../ArticleCard";
import ManageArticleModal from "../ManageArticleModal";

interface Props {
    articles: Article[];
    onChangeStatus: (values: UpdateStatusFormValues, id: number) => void;
}

const ArticlesManager = ({ articles, onChangeStatus }: Props) => {
    const [articleToManage, setArticleToManage] = useState<Article | null>(null);

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
                gap: "20px",
            }}
        >
            {articles.map((article) => (
                <Box width="100%">
                    <Box width="100%" sx={{ zIndex: 1, position: "relative" }}>
                        <ArticleCard key={article.id} article={article} />
                    </Box>
                    <Button
                        onClick={() => setArticleToManage(article)}
                        fullWidth
                        sx={{
                            marginTop: "-6px",
                            padding: "14px 10px 10px 10px",
                            zIndex: 0,
                            gap: "10px",
                        }}
                        variant="contained"
                    >
                        <GavelIcon />
                        Rozstrzygnij
                    </Button>
                </Box>
            ))}
            {articleToManage && (
                <ManageArticleModal
                    onSubmit={(values) => {
                        onChangeStatus(values, articleToManage.id);
                        setArticleToManage(null);
                    }}
                    onClose={() => setArticleToManage(null)}
                    open={!!articleToManage}
                />
            )}
        </Box>
    );
};

export default ArticlesManager;
