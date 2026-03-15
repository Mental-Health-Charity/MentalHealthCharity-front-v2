import { Button } from "@/components/ui/button";
import { Gavel } from "lucide-react";
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
        <div className="grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-5">
            {articles.map((article) => (
                <div key={article.id} className="w-full">
                    <div className="relative z-[1] w-full">
                        <ArticleCard article={article} />
                    </div>
                    <Button
                        onClick={() => setArticleToManage(article)}
                        className="z-0 -mt-1.5 w-full gap-2.5 px-2.5 pt-3.5 pb-2.5"
                    >
                        <Gavel className="size-5" />
                        Rozstrzygnij
                    </Button>
                </div>
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
        </div>
    );
};

export default ArticlesManager;
