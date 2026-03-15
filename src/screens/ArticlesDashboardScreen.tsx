import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ArticleCard from "../modules/articles/components/ArticleCard";
import { ArticleStatus } from "../modules/articles/constants";
import { articlesByUserQueryOptions } from "../modules/articles/queries/articlesByUserQueryOptions";
import { useUser } from "../modules/auth/components/AuthProvider";
import Container from "../modules/shared/components/Container";
import Loader from "../modules/shared/components/Loader";
import SimpleCard from "../modules/shared/components/SimpleCard";

const ArticleDashboardScreen = () => {
    const { t } = useTranslation();
    const { user } = useUser();

    const statuses = [
        {
            key: ArticleStatus.DRAFT,
            title: t("articles.dashboard.draft", { user: user?.full_name }),
            subtitle: t("articles.dashboard.draft_subtitle"),
        },
        {
            key: ArticleStatus.REJECTED,
            title: t("articles.dashboard.rejected"),
        },
        {
            key: ArticleStatus.CORRECTED,
            title: t("articles.dashboard.corrected"),
        },
        { key: ArticleStatus.SENT, title: t("articles.dashboard.sent") },
        {
            key: ArticleStatus.PUBLISHED,
            title: t("articles.dashboard.published"),
        },
        { key: ArticleStatus.DELETED, title: t("articles.dashboard.deleted") },
    ];

    const getArticles = (status: ArticleStatus) =>
        articlesByUserQueryOptions(
            {
                status,
                author: user ? user.id : 0,
                page: 1,
                size: 100,
            },
            {
                retry: 1,
                refetchOnWindowFocus: false,
                enabled: !!user,
                queryKey: ["articles", status],
            }
        );

    return (
        <Container>
            <div className="flex flex-col gap-4">
                <SimpleCard title={t("articles.dashboard.title")} subtitle={t("articles.dashboard.subtitle")}>
                    <Button className="mt-5 gap-2.5" render={<Link to="/articles/create" />}>
                        <Plus className="size-6" /> {t("articles.add_article")}
                    </Button>
                </SimpleCard>

                {statuses.map(({ key, title, subtitle }) => {
                    const { data, isLoading } = useQuery(getArticles(key));

                    return (
                        <SimpleCard subtitle={subtitle} key={key} title={title}>
                            {isLoading && <Loader />}
                            {data && data.total > 0 ? (
                                <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4">
                                    {data.items.map((article) => (
                                        <div key={article.id} className="w-full">
                                            <ArticleCard draft={key === ArticleStatus.DRAFT} article={article} />
                                            {article.reject_message !== "" && <div>{article.reject_message}</div>}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-2.5">{t("articles.dashboard.not_found")}</p>
                            )}
                        </SimpleCard>
                    );
                })}
            </div>
        </Container>
    );
};

export default ArticleDashboardScreen;
