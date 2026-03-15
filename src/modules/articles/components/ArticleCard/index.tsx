import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useMutation } from "@tanstack/react-query";
import { Pencil, Trash2, User as UserIcon } from "lucide-react";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { baseUrl } from "../../../../api";
import { useUser } from "../../../auth/components/AuthProvider";
import ActionMenu from "../../../shared/components/ActionMenu";
import InternalLink from "../../../shared/components/InternalLink";
import { Permissions } from "../../../shared/constants";
import formatDate from "../../../shared/helpers/formatDate";
import usePermissions from "../../../shared/hooks/usePermissions";
import { ArticleStatus } from "../../constants";
import updateArticleMutation from "../../queries/updateArticleMutation";
import { Article } from "../../types";

interface Props {
    article: Article;
    onRefetch?: () => void;
    draft?: boolean;
}

const stripMarkdown = (text: string) => {
    return text
        .replace(/[#*_~`>[\]()!|-]/g, "")
        .replace(/\n+/g, " ")
        .trim();
};

const ArticleCard = ({ article, onRefetch, draft }: Props) => {
    const { user } = useUser();
    const { t } = useTranslation();
    const { hasPermissions } = usePermissions();
    const { mutate } = useMutation({
        mutationFn: updateArticleMutation,
        onSuccess: () => {
            onRefetch && onRefetch();
            toast.success(t("articles.article_deleted_success"));
        },
    });

    const handleDeleteArticle = useCallback(() => {
        mutate({
            article_id: article.id,
            banner_base64: article.banner_url,
            title: article.title,
            content: article.content,
            video_url: article.video_url,
            article_category_id: article.article_category.id,
            required_role: article.required_role,
            status: ArticleStatus.DELETED,
        });
    }, [mutate, article]);

    const canManageArticle = hasPermissions(Permissions.MANAGE_ARTICLES) || user?.id === article.created_by.id;
    const plainPreview = stripMarkdown(article.content).substring(0, 120);

    return (
        <InternalLink
            to={draft ? `/articles/edit/${article.id}/` : `/article/${article.id}`}
            reloadDocument
            className="group w-full no-underline hover:no-underline"
        >
            <article className="bg-card flex h-full w-full flex-col overflow-hidden rounded-xl border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                {/* Image */}
                <div className="relative overflow-hidden">
                    <img
                        className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        src={baseUrl + article.banner_url}
                        alt={article.title}
                        onError={(e) => {
                            e.currentTarget.src = "https://placehold.co/600x400";
                        }}
                    />
                    <Badge className="text-foreground dark:bg-card/80 absolute bottom-3 left-3 rounded-md bg-white/80 px-2.5 py-1 text-xs font-semibold uppercase shadow-sm backdrop-blur-sm">
                        {article.article_category.name}
                    </Badge>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-foreground group-hover:text-primary-brand line-clamp-2 text-lg font-semibold transition-colors">
                        {article.title}
                    </h3>
                    <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">{plainPreview}...</p>

                    {/* Author row */}
                    <div className="mt-auto flex items-center justify-between pt-4">
                        <div className="flex items-center gap-2.5">
                            <Avatar className="size-8 rounded-full">
                                <AvatarImage
                                    src={article.created_by.chat_avatar_url}
                                    alt={article.created_by.full_name}
                                />
                                <AvatarFallback className="rounded-full text-xs">
                                    <UserIcon className="size-3.5" />
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-foreground text-xs font-medium">{article.created_by.full_name}</p>
                                <p className="text-muted-foreground text-[11px]">{formatDate(article.creation_date)}</p>
                            </div>
                        </div>
                        {canManageArticle && (
                            <div onClick={(e) => e.preventDefault()}>
                                <ActionMenu
                                    actions={[
                                        {
                                            id: "edit",
                                            label: t("common.edit"),
                                            icon: <Pencil className="size-4" />,
                                            href: `/articles/edit/${article.id}/`,
                                        },
                                        {
                                            id: "delete",
                                            variant: "divider",
                                            label: t("common.remove"),
                                            icon: <Trash2 className="size-4" />,
                                            onClick: handleDeleteArticle,
                                        },
                                    ]}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </article>
        </InternalLink>
    );
};

export default ArticleCard;
