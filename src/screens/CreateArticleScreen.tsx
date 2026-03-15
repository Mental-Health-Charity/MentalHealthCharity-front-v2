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
import SimpleCard from "../modules/shared/components/SimpleCard";
import fileToBase64 from "../modules/shared/helpers/fileToBase64";

const CreateArticleScreen = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { mutate: createArticle, isPending: isArticleCreationPending } = useMutation({
        mutationFn: createArticleMutation,
        onSuccess: () => {
            toast.success(t("articles.article_created"));

            setTimeout(() => {
                navigate("/articles/dashboard");
            }, 2000);
        },
    });

    const handleCreateArticle = async (values: CreateArticleValues) => {
        const banner = values.banner_url instanceof File ? await fileToBase64(values.banner_url) : values.banner_url;

        const transformValues: CreateArticlePayload = {
            ...values,
            banner_base64: banner || "",
            banner_url: "",
            article_category_id: values.article_category_id || 0,
        };

        createArticle(transformValues);
    };

    const handleCreateDraft = async (values: CreateArticleValues) => {
        const banner = values.banner_url instanceof File ? await fileToBase64(values.banner_url) : values.banner_url;

        const transformValues: CreateArticlePayload = {
            ...values,
            banner_base64: banner || "",
            banner_url: "",
            status: ArticleStatus.DRAFT,
            article_category_id: values.article_category_id || 0,
        };

        createArticle(transformValues);
    };

    return (
        <Container parentClassName="z-0 bg-border-brand shadow-md">
            {isArticleCreationPending && <Loader variant="fullscreen" />}
            <SimpleCard className="mb-5 p-5">
                <ArticleEditor onSaveDraft={handleCreateDraft} onSubmit={handleCreateArticle} />
            </SimpleCard>
        </Container>
    );
};

export default CreateArticleScreen;
