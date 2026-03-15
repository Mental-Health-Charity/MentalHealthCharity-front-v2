import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import Container from "../../../shared/components/Container";
import Markdown from "../../../shared/components/Markdown";
import formatDate from "../../../shared/helpers/formatDate";
import { Article } from "../../types";
import ArticleAuthor from "../ArticleAuthor";
import ArticleCard from "../ArticleCard";
import Videoplayer from "../Videoplayer";

interface Props {
    article: Article;
    articles?: Article[];
}

const ArticleView = ({ article, articles }: Props) => {
    const { t } = useTranslation();

    return (
        <Container className="p-[5px]">
            <div
                className="border-border-brand bg-paper flex min-h-[500px] w-full flex-wrap items-end rounded-[10px] border-2 bg-cover bg-center p-5"
                style={{ backgroundImage: `url(${article.banner_url})` }}
            >
                <ArticleAuthor user={article.created_by} />
            </div>
            <div className="my-[30px] mb-[35px]">
                <h1 className="text-dark text-4xl font-bold md:text-5xl">{article.title}</h1>
                <p className="text-text-light text-xl font-medium">
                    {t("common.created_at", {
                        date: formatDate(article.creation_date),
                    })}
                </p>
                <Badge className="mt-2.5 px-4 py-2 text-xl font-medium uppercase">
                    {article.article_category.name}
                </Badge>
            </div>
            {article.video_url && <Videoplayer className="mt-5 h-[600px]" src={article.video_url} />}

            <Markdown readOnly content={article.content} />

            <div className="mt-4 flex flex-col gap-4">
                <p className="text-primary-brand text-xl font-semibold">{t("articles.more_articles")}</p>
                <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4">
                    {articles && articles.map((article) => <ArticleCard key={article.id} article={article} />)}
                </div>
            </div>
        </Container>
    );
};

export default ArticleView;
