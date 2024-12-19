import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Box,
    Avatar,
    Chip,
    useTheme,
    Divider,
    IconButton,
} from "@mui/material";

import { Link } from "react-router-dom";
import { Article } from "../../types";
import EditIcon from "@mui/icons-material/Edit";
import { baseUrl } from "../../../../api";
import formatDate from "../../../shared/helpers/formatDate";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ActionMenu from "../../../shared/components/ActionMenu";
import DeleteIcon from "@mui/icons-material/Delete";
import { useUser } from "../../../auth/components/AuthProvider";
import usePermissions from "../../../shared/hooks/usePermissions";
import { Permissions } from "../../../shared/constants";
import { useMutation } from "@tanstack/react-query";
import updateArticleMutation from "../../queries/updateArticleBannerMutation";
import { ArticleStatus } from "../../constants";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

interface Props {
    article: Article;
    onRefetch?: () => void;
}

const ArticleCard = ({ article, onRefetch }: Props) => {
    const theme = useTheme();
    const { user } = useUser();
    const { t } = useTranslation();
    const { hasPermissions } = usePermissions(user);
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
            title: article.title,
            content: article.content,
            video_url: article.video_url,
            article_category_id: article.article_category.id,
            required_role: article.required_role,
            status: ArticleStatus.DELETED,
        });
    }, [mutate, article]);

    const canManageArticle =
        hasPermissions(Permissions.MANAGE_ARTICLES) ||
        user?.id === article.created_by.id;

    return (
        <Link
            to={`/article/${article.id}`}
            style={{
                textDecoration: "none",
                width: "100%",
            }}
        >
            <Card
                sx={{
                    width: "100%",
                    borderRadius: 2,
                    padding: "0",
                }}
                component="article"
            >
                <Box sx={{ position: "relative" }}>
                    <CardMedia
                        component="img"
                        height="350"
                        image={baseUrl + article.banner_url}
                        alt={article.title}
                        sx={{ borderRadius: "10px" }}
                        onError={(e) => {
                            e.currentTarget.src =
                                "https://placehold.co/600x400";
                        }}
                    />
                    <Chip
                        label={article.article_category.name}
                        size="small"
                        sx={{
                            fontWeight: "bold",
                            backgroundColor: theme.palette.primary.main,
                            color: theme.palette.text.primary,
                            fontSize: 16,
                            padding: "16px 8px",
                            textTransform: "uppercase",
                            position: "absolute",
                            bottom: 10,
                            left: 10,
                            borderRadius: 10,
                            minWidth: 100,
                            boxShadow: 1,
                        }}
                    />
                </Box>
                <CardContent
                    sx={{
                        paddingBottom: "0px !important",
                        padding: "20px 20px",
                    }}
                >
                    <Typography
                        gutterBottom
                        variant="h5"
                        component="p"
                        fontSize={24}
                        color="text.secondary"
                        fontWeight={600}
                    >
                        {article.title}
                    </Typography>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                        fontSize={20}
                        sx={{ minHeight: "60px" }}
                    >
                        {article.content.length > 100
                            ? `${article.content.substring(0, 100)}...`
                            : article.content}
                    </Typography>
                    <Divider
                        sx={{
                            margin: "10px 0",
                        }}
                    />
                    <Box
                        sx={{
                            padding: "5px 0 15px 0",
                        }}
                    >
                        <Box
                            flexWrap="nowrap"
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Box display="flex" alignItems="center">
                                <Avatar
                                    variant="rounded"
                                    src={article.created_by.chat_avatar_url}
                                    alt={article.created_by.full_name}
                                    sx={{ width: 50, height: 50, mr: 1 }}
                                />
                                <Box>
                                    <Typography
                                        fontWeight={550}
                                        fontSize={20}
                                        variant="body1"
                                        color="text.secondary"
                                    >
                                        {article.created_by.full_name}
                                    </Typography>
                                    <Typography
                                        fontSize={20}
                                        variant="body1"
                                        color="text.secondary"
                                    >
                                        {formatDate(article.creation_date)}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box>
                                {canManageArticle && (
                                    <ActionMenu
                                        actions={[
                                            {
                                                id: "edit",
                                                label: "Edytuj",
                                                icon: <EditIcon />,
                                                href: `/articles/edit/${article.id}/`,
                                            },
                                            {
                                                id: "delete",
                                                variant: "divider",
                                                label: "Usuń",
                                                icon: <DeleteIcon />,
                                                onClick: handleDeleteArticle,
                                            },
                                        ]}
                                    />
                                )}

                                <IconButton>
                                    <OpenInNewIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Link>
    );
};

export default ArticleCard;
