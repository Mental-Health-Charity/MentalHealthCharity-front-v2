import { useTranslation } from "react-i18next";
import AdminLayout from "../modules/shared/components/AdminLayout";
import SimpleCard from "../modules/shared/components/SimpleCard";
import { readPublicArticlesQueryOptions } from "../modules/articles/queries/readPublicArticlesQueryOptions";
import {
    ArticleStatus,
    translatedAdminArticleStatus,
} from "../modules/articles/constants";
import { useMutation, useQuery } from "@tanstack/react-query";
import Loader from "../modules/shared/components/Loader";
import ArticlesManager from "../modules/articles/components/ArticlesManager";
import changeStatusMutation from "../modules/articles/queries/changeStatusMutation";
import toast from "react-hot-toast";
import { UpdateStatusFormValues } from "../modules/articles/types";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
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
                queryKey: [
                    "readPublicArticles",
                    { status, page: 1, size: 100, author: filterByUser },
                ],
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

    const handleChangeStatus = (
        { reject_message, status }: UpdateStatusFormValues,
        id: number
    ) => {
        mutate({ id, status, reject_message });
    };

    return (
        <AdminLayout>
            <SimpleCard
                title={t("manage_articles.title")}
                subtitle={t("manage_articles.subtitle")}
            >
                <Tooltip title={t("common.unavailable_in_beta")}>
                    <Box>
                        <SearchUser
                            disabled
                            onChange={(user) => setFilterByUser(user?.id)}
                        />
                    </Box>
                </Tooltip>
                <Box sx={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                    {Object.keys(ArticleStatus).map((option) => (
                        <Button
                            sx={{
                                backgroundColor: "primary.main",
                                color: "white",
                                opacity: option === status ? 1 : 0.5,
                            }}
                            onClick={() => setStatus(option as ArticleStatus)}
                        >
                            <FilterAltIcon />
                            {
                                translatedAdminArticleStatus[
                                    option as ArticleStatus
                                ]
                            }
                        </Button>
                    ))}
                </Box>
            </SimpleCard>
            {isLoading && <Loader />}
            {data && data.total === 0 && (
                <Typography
                    color="textSecondary"
                    variant="h6"
                    textAlign="center"
                >
                    {t("common.not_found")}
                </Typography>
            )}
            {data && data.items && (
                <ArticlesManager
                    onChangeStatus={handleChangeStatus}
                    articles={data.items}
                />
            )}
        </AdminLayout>
    );
};

export default ManageArticlesScreen;
