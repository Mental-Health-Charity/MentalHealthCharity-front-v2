import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useMutation } from "@tanstack/react-query";
import { ExternalLink, Pencil, Trash2, User as UserIcon } from "lucide-react";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { baseUrl } from "../../../../api";
import { useUser } from "../../../auth/components/AuthProvider";
import ActionMenu from "../../../shared/components/ActionMenu";
import InternalLink from "../../../shared/components/InternalLink";
import Markdown from "../../../shared/components/Markdown";
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

    return (
        <InternalLink
            to={draft ? `/articles/edit/${article.id}/` : `/article/${article.id}`}
            reloadDocument
            className="w-full no-underline hover:no-underline"
        >
            <article className="bg-card ring-foreground/10 w-full overflow-hidden rounded-xl ring-1">
                <div className="relative">
                    <img
                        className="h-[350px] w-full rounded-[10px] object-cover"
                        src={baseUrl + article.banner_url}
                        alt={article.title}
                        onError={(e) => {
                            e.currentTarget.src = "https://placehold.co/600x400";
                        }}
                    />
                    <Badge className="absolute bottom-2.5 left-2.5 min-w-[100px] rounded-[10px] px-3 py-2 text-base font-bold uppercase shadow-sm">
                        {article.article_category.name}
                    </Badge>
                </div>
                <div className="p-5 pb-0">
                    <p className="text-dark mb-1 text-2xl font-semibold">{article.title}</p>

                    <Markdown
                        readOnly
                        content={
                            article.content.length > 100 ? `${article.content.substring(0, 103)}...` : article.content
                        }
                    />
                    <Separator className="my-2.5" />
                    <div className="py-[5px] pb-[15px]">
                        <div className="flex flex-nowrap items-center justify-between">
                            <div className="flex items-center">
                                <Avatar className="mr-2 size-[50px] rounded-md">
                                    <AvatarImage
                                        src={article.created_by.chat_avatar_url}
                                        alt={article.created_by.full_name}
                                    />
                                    <AvatarFallback className="rounded-md">
                                        <UserIcon className="size-5" />
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-dark text-xl font-[550]">{article.created_by.full_name}</p>
                                    <p className="text-dark text-xl">{formatDate(article.creation_date)}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                {canManageArticle && (
                                    <ActionMenu
                                        actions={[
                                            {
                                                id: "edit",
                                                label: "Edytuj",
                                                icon: <Pencil className="size-4" />,
                                                href: `/articles/edit/${article.id}/`,
                                            },
                                            {
                                                id: "delete",
                                                variant: "divider",
                                                label: "Usuń",
                                                icon: <Trash2 className="size-4" />,
                                                onClick: handleDeleteArticle,
                                            },
                                        ]}
                                    />
                                )}

                                <button className="text-muted-foreground hover:bg-muted inline-flex size-10 items-center justify-center rounded-md">
                                    <ExternalLink className="size-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </InternalLink>
    );
};

export default ArticleCard;
