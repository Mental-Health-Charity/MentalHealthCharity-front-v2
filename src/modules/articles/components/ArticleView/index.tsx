import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, Clock, User as UserIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { baseUrl } from "../../../../api";
import Markdown from "../../../shared/components/Markdown";
import formatDate from "../../../shared/helpers/formatDate";
import { translatedRoles } from "../../../users/constants";
import { Article } from "../../types";
import ArticleCard from "../ArticleCard";
import Videoplayer from "../Videoplayer";

interface Props {
    article: Article;
    articles?: Article[];
}

const estimateReadingTime = (content: string) => {
    const words = content.replace(/[#*_~`>[\]()!|-]/g, "").split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));
};

const ArticleView = ({ article, articles }: Props) => {
    const { t } = useTranslation();
    const readingTime = estimateReadingTime(article.content);

    return (
        <article className="min-h-screen">
            {/* Hero banner */}
            <div className="relative overflow-hidden">
                <div className="relative flex min-h-[360px] items-end md:min-h-[480px]">
                    {/* Background image */}
                    <img
                        src={baseUrl + article.banner_url}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="from-background via-background/80 absolute inset-0 bg-gradient-to-t to-transparent" />

                    {/* Back button */}
                    <Link
                        to="/articles"
                        className="hover:text-foreground absolute top-6 left-6 z-10 flex items-center gap-2 rounded-full bg-black/20 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-md transition-colors"
                    >
                        <ArrowLeft className="size-4" />
                        {t("articles.all_articles", { defaultValue: "All articles" })}
                    </Link>

                    {/* Hero content */}
                    <div className="relative z-10 mx-auto w-full max-w-[800px] px-6 pb-10 md:px-8 md:pb-14">
                        <Badge className="bg-primary-brand/90 mb-4 border-0 px-3 py-1 text-xs font-semibold tracking-wide text-white uppercase backdrop-blur-sm">
                            {article.article_category.name}
                        </Badge>
                        <h1 className="text-foreground text-3xl leading-tight font-bold tracking-tight md:text-4xl lg:text-5xl lg:leading-tight">
                            {article.title}
                        </h1>

                        {/* Meta row */}
                        <div className="mt-5 flex flex-wrap items-center gap-4">
                            <Link
                                to={`/profile/${article.created_by.id}`}
                                className="flex items-center gap-2.5 no-underline transition-opacity hover:opacity-80"
                            >
                                <Avatar className="ring-background/50 size-10 ring-2">
                                    <AvatarImage
                                        src={article.created_by.chat_avatar_url}
                                        alt={article.created_by.full_name}
                                    />
                                    <AvatarFallback>
                                        <UserIcon className="size-4" />
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-foreground text-sm font-semibold">
                                        {article.created_by.full_name}
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                        {translatedRoles[article.created_by.user_role]}
                                    </p>
                                </div>
                            </Link>

                            <Separator orientation="vertical" className="!h-6 opacity-30" />

                            <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
                                <Calendar className="size-3.5" />
                                <span>{formatDate(article.creation_date)}</span>
                            </div>

                            <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
                                <Clock className="size-3.5" />
                                <span>
                                    {t("articles.reading_time", {
                                        defaultValue: "{{count}} min read",
                                        count: readingTime,
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Article body */}
            <div className="mx-auto max-w-[800px] px-6 md:px-8">
                <div className="py-10 md:py-14">
                    {article.video_url && (
                        <Videoplayer
                            className="mb-10 aspect-video overflow-hidden rounded-2xl shadow-lg"
                            src={article.video_url}
                        />
                    )}

                    <div className="article-content">
                        <Markdown readOnly content={article.content} />
                    </div>
                </div>
            </div>

            {/* More articles */}
            {articles && articles.length > 0 && (
                <div className="bg-muted/30 border-border/30 border-t">
                    <div className="mx-auto max-w-[1200px] px-6 py-14 md:px-8 md:py-20">
                        <h2 className="text-foreground mb-8 text-center text-2xl font-bold">
                            {t("articles.more_articles")}
                        </h2>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {articles.map((a) => (
                                <ArticleCard key={a.id} article={a} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </article>
    );
};

export default ArticleView;
