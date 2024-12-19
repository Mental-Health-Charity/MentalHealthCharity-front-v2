import { useMutation, useQuery } from "@tanstack/react-query";
import ArticleEditor from "../modules/articles/components/ArticleEditor";
import Container from "../modules/shared/components/Container";
import SimpleCard from "../modules/shared/components/SimpleCard";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {
    CreateArticleValues,
    UpdateArticlePayload,
} from "../modules/articles/types";
import {
    ArticleRequiredRoles,
    ArticleStatus,
} from "../modules/articles/constants";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../modules/shared/components/Loader";
import useTheme from "../theme";
import { getArticleByIdQueryOptions } from "../modules/articles/queries/getArticleByIdQueryOptions";
import updateArticleMutation from "../modules/articles/queries/updateArticleBannerMutation";
import NotFoundScreen from "./NotFoundScreen";

const EditArticleScreen = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const theme = useTheme();
    const { id } = useParams();

    const { mutate: editArticle, isPending: isArticleEditPending } =
        useMutation({
            mutationFn: updateArticleMutation,
            onSuccess: () => {
                toast.success(t("articles.article_created"));

                setTimeout(() => {
                    navigate("/articles/dashboard");
                }, 2000);
            },
        });

    const { data, isLoading } = useQuery(
        getArticleByIdQueryOptions(
            { id: Number(id) },
            {
                enabled: !!id,
            }
        )
    );

    const handleEditArticle = async (values: CreateArticleValues) => {
        const transformValues: UpdateArticlePayload = {
            ...values,
            article_category_id: values.article_category_id || 0,
            article_id: Number(id),
        };

        editArticle(transformValues);
    };

    const handleCreateDraft = async (values: CreateArticleValues) => {
        const transformValues: UpdateArticlePayload = {
            ...values,
            article_category_id: values.article_category_id || 0,
            article_id: Number(id),
            status: ArticleStatus.DRAFT,
        };

        editArticle(transformValues);
    };

    const initialValues: CreateArticleValues = {
        title: data?.title || "",
        content: data?.content || "",
        banner_url: data?.banner_url,
        article_category_id: data?.article_category.id || 0,
        status: ArticleStatus.CORRECTED,
        required_role: data?.required_role || ArticleRequiredRoles.ANYONE,
        video_url: data?.video_url || "",
    };

    if (isLoading) {
        return <Loader variant="fullscreen" />;
    }

    if (!data) {
        return <NotFoundScreen />;
    }

    return (
        <Container
            parentProps={{
                sx: {
                    backgroundColor: theme.palette.colors.border,
                    boxShadow: `0px 0px 10px ${theme.palette.shadows.box}`,
                },
            }}
        >
            {isArticleEditPending && <Loader variant="fullscreen" />}
            <SimpleCard
                sx={{
                    marginBottom: "20px",

                    padding: "20px",
                }}
            >
                {data && (
                    <ArticleEditor
                        initialValues={initialValues}
                        onSaveDraft={handleCreateDraft}
                        onSubmit={(values) => handleEditArticle(values)}
                    />
                )}
            </SimpleCard>
        </Container>
    );
};

export default EditArticleScreen;
