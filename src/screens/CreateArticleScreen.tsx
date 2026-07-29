import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ArticleEditor from "../modules/articles/components/ArticleEditor";
import { ArticleStatus } from "../modules/articles/constants";
import createArticleMutation from "../modules/articles/queries/createArticleMutation";
import { CreateArticlePayload, CreateArticleValues } from "../modules/articles/types";
import Container from "../modules/shared/components/Container";
import Loader from "../modules/shared/components/Loader";
import fileToBase64 from "../modules/shared/helpers/fileToBase64";

const CreateArticleScreen = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { mutate: createArticle, isPending: isArticleCreationPending } = useMutation({
        mutationFn: createArticleMutation,
    });

    const buildCreatePayload = async (
        values: CreateArticleValues,
        status: ArticleStatus
    ): Promise<CreateArticlePayload> => {
        const banner = values.banner_url instanceof File ? await fileToBase64(values.banner_url) : values.banner_url;
        return {
            ...values,
            banner_base64: banner || "",
            banner_url: "",
            status,
            article_category_id: values.article_category_id || 0,
        };
    };

    const handleCreateArticle = async (values: CreateArticleValues) => {
        createArticle(await buildCreatePayload(values, values.status), {
            onSuccess: () => {
                toast.success(t("articles.article_created"));
                setTimeout(() => navigate("/articles/dashboard"), 2000);
            },
        });
    };

    const handleCreateDraft = async (values: CreateArticleValues) => {
        createArticle(await buildCreatePayload(values, ArticleStatus.DRAFT), {
            onSuccess: (article) => {
                toast.success(t("articles.draft_saved"));
                // Continue editing the now-persisted draft instead of leaving to the
                // dashboard, so further saves update it rather than create duplicates.
                navigate(`/articles/edit/${article.id}`, { replace: true });
            },
        });
    };

    return (
        <Container parentClassName="z-0 bg-border-brand shadow-md" className="max-w-[1440px]">
            {isArticleCreationPending && <Loader variant="fullscreen" />}
            <div className="mb-5">
                <ArticleEditor
                    onSaveDraft={handleCreateDraft}
                    onSubmit={handleCreateArticle}
                    isSaving={isArticleCreationPending}
                />
            </div>
        </Container>
    );
};

export default CreateArticleScreen;
