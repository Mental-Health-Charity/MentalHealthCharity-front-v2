import { useQuery } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ArticleCard from "../modules/articles/components/ArticleCard";
import ArticlesHeading from "../modules/articles/components/ArticlesHeading";
import { ArticleStatus } from "../modules/articles/constants";
import { articlesQueryOptions } from "../modules/articles/queries/articlesQueryOptions";
import AnimatedSection from "../modules/shared/components/AnimatedSection";

const ArticlesScreen = () => {
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState(query);
    const page = 1;
    const { t } = useTranslation();

    const debouncedSetQuery = useCallback(
        debounce((q) => {
            setDebouncedQuery(q);
        }, 500),
        []
    );

    useEffect(() => {
        debouncedSetQuery(query);
    }, [query, debouncedSetQuery]);

    const { data, isLoading } = useQuery(articlesQueryOptions({ q: debouncedQuery, page, size: 50 }));

    // TODO: Waiting for backend to fix
    const published = useMemo(() => {
        return data?.items
            .filter((article) => article.status === ArticleStatus.PUBLISHED)
            .sort((a, b) => new Date(b.creation_date).getTime() - new Date(a.creation_date).getTime());
    }, [data]);

    return (
        <div>
            {/* Gradient header */}
            <div className="from-primary-brand-50 to-background bg-gradient-to-b px-5 pt-12 pb-8 md:pt-20 md:pb-12">
                <div className="mx-auto max-w-[1200px]">
                    <h1 className="text-foreground text-3xl font-bold md:text-4xl">{t("articles.title")}</h1>
                    <p className="text-muted-foreground mt-2 max-w-[600px] text-base md:text-lg">
                        {t("articles.subtitle")}
                    </p>
                    <div className="mt-6">
                        <ArticlesHeading onSearch={setQuery} search={query} />
                    </div>
                </div>
            </div>

            {/* Articles grid */}
            <div className="mx-auto max-w-[1200px] py-10">
                <div className="grid min-h-[400px] grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {!isLoading && (!published || published.length === 0) && (
                        <p className="text-muted-foreground col-span-full mt-12 text-center text-lg">
                            {t("common.not_found")}
                        </p>
                    )}
                    {published &&
                        published.map((article, i) => (
                            <AnimatedSection as="div" key={article.id} delay={i * 100}>
                                <ArticleCard article={article} />
                            </AnimatedSection>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default ArticlesScreen;
