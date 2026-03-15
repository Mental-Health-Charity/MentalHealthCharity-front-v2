import { useTranslation } from "react-i18next";
import ArticleCard from "../../../articles/components/ArticleCard";
import { Article } from "../../../articles/types";
import SimpleCard from "../../../shared/components/SimpleCard";

interface Props {
    articles: Article[];
}

const UserProfileArticles = ({ articles }: Props) => {
    const { t } = useTranslation();
    return (
        <SimpleCard subtitle={t("profile.articles_subtitle")}>
            <div className="mt-2.5 flex flex-wrap justify-between gap-2.5">
                {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                ))}
            </div>
        </SimpleCard>
    );
};

export default UserProfileArticles;
