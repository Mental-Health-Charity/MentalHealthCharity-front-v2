import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ArticleCard from "../../../articles/components/ArticleCard";
import { ArticleStatus } from "../../../articles/constants";
import { articlesQueryOptions } from "../../../articles/queries/articlesQueryOptions";
import AnimatedSection from "../AnimatedSection";

const ArticlesPreview = () => {
    const { t } = useTranslation();
    const { data } = useQuery(articlesQueryOptions({ q: "", page: 1, size: 50 }));

    const published = useMemo(() => {
        return data?.items
            .filter((article) => article.status === ArticleStatus.PUBLISHED)
            .sort((a, b) => new Date(b.creation_date).getTime() - new Date(a.creation_date).getTime())
            .slice(0, 3);
    }, [data]);

    console.log("published", published);

    if (!published || published.length === 0) return null;

    return (
        <section className="py-20 md:py-28">
            <div className="mx-auto max-w-[1200px] px-5">
                <AnimatedSection as="div" className="mb-10 flex items-end justify-between">
                    <div>
                        <h2 className="text-foreground text-3xl font-bold md:text-4xl">
                            {t("homepage.articles_preview.title")}
                        </h2>
                        <p className="text-muted-foreground mt-2 text-base">
                            {t("homepage.articles_preview.subtitle")}
                        </p>
                    </div>
                    <Link
                        to="/articles"
                        className="text-primary-brand hover:text-primary-brand-dark hidden items-center gap-1 font-medium transition-colors md:flex"
                    >
                        {t("homepage.articles_preview.view_all")}
                        <ArrowRight className="size-4" />
                    </Link>
                </AnimatedSection>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {published.map((article, i) => (
                        <AnimatedSection key={article.id} as="div" delay={i * 100}>
                            <ArticleCard article={article} />
                        </AnimatedSection>
                    ))}
                </div>

                <Link
                    to="/articles"
                    className="text-primary-brand hover:text-primary-brand-dark mt-8 flex items-center justify-center gap-1 font-medium transition-colors md:hidden"
                >
                    {t("homepage.articles_preview.view_all")}
                    <ArrowRight className="size-4" />
                </Link>
            </div>
        </section>
    );
};

export default ArticlesPreview;
