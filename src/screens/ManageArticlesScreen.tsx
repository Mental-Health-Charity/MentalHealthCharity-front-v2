import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Filter } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import ArticlesManager from "../modules/articles/components/ArticlesManager";
import { ArticleStatus, translatedAdminArticleStatus } from "../modules/articles/constants";
import changeStatusMutation from "../modules/articles/queries/changeStatusMutation";
import { readPublicArticlesQueryOptions } from "../modules/articles/queries/readPublicArticlesQueryOptions";
import { UpdateStatusFormValues } from "../modules/articles/types";
import AdminLayout from "../modules/shared/components/AdminLayout";
import Loader from "../modules/shared/components/Loader";
import SimpleCard from "../modules/shared/components/SimpleCard";
import SearchUser from "../modules/users/components/SearchUser";

const ManageArticlesScreen = () => {
    const { t } = useTranslation();
    const [status, setStatus] = useState<ArticleStatus>(ArticleStatus.SENT);
    const [filterByUser, setFilterByUser] = useState<number | undefined>();

    const { data, isLoading, refetch } = useQuery(
        readPublicArticlesQueryOptions(
            {
                status,
                page: 1,
                size: 100,
                author: filterByUser,
            },
            {
                queryKey: ["readPublicArticles", { status, page: 1, size: 100, author: filterByUser }],
            }
        )
    );

    const { mutate } = useMutation({
        mutationFn: changeStatusMutation,
        onSuccess: () => {
            toast.success(t("manage_articles.article_status_changed"));
            refetch();
        },
    });

    const handleChangeStatus = ({ reject_message, status }: UpdateStatusFormValues, id: number) => {
        mutate({ id, status, reject_message });
    };

    return (
        <AdminLayout>
            <SimpleCard title={t("manage_articles.title")} subtitle={t("manage_articles.subtitle")}>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger render={<div />}>
                            <SearchUser disabled onChange={(user) => setFilterByUser(user?.id)} />
                        </TooltipTrigger>
                        <TooltipContent>{t("common.unavailable_in_beta")}</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <div className="mt-5 flex flex-wrap gap-2.5">
                    {Object.keys(ArticleStatus).map((option) => (
                        <Button
                            key={option}
                            className="text-white"
                            style={{ opacity: option === status ? 1 : 0.5 }}
                            onClick={() => setStatus(option as ArticleStatus)}
                        >
                            <Filter className="size-4" />
                            {translatedAdminArticleStatus[option as ArticleStatus]}
                        </Button>
                    ))}
                </div>
            </SimpleCard>
            {isLoading && <Loader />}
            {data && data.total === 0 && <p className="text-dark text-center text-lg">{t("common.not_found")}</p>}
            {data && data.items && <ArticlesManager onChangeStatus={handleChangeStatus} articles={data.items} />}
        </AdminLayout>
    );
};

export default ManageArticlesScreen;
