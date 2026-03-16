import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import { Settings } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useUser } from "../../../auth/components/AuthProvider";
import ChangeImageInput from "../../../shared/components/ChangeImageInput";
import Loader from "../../../shared/components/Loader";
import Markdown from "../../../shared/components/Markdown";
import fileToBase64 from "../../../shared/helpers/fileToBase64";
import { Roles } from "../../../users/constants";
import {
    ArticleRequiredRoles,
    ArticleStatus,
    translatedArticleRequiredRoles,
    translatedArticleStatus,
} from "../../constants";
import { getCategoriesQueryOptions } from "../../queries/getCategoriesQueryOptions";
import updateArticleBannerMutation from "../../queries/updateArticleBannerMutation";
import { CreateArticleValues } from "../../types";
import CreateArticleCategoryModal from "../CreateCategoryModal";
import Videoplayer from "../Videoplayer";

interface Props {
    initialValues?: CreateArticleValues;
    onSubmit: (values: CreateArticleValues) => void;
    onSaveDraft: (values: CreateArticleValues) => void;
    articleId?: number;
}

const ArticleEditor = ({ initialValues, onSubmit, onSaveDraft, articleId }: Props) => {
    const { t } = useTranslation();
    const { user, isLoading } = useUser();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: categories, isLoading: isCategoriesLoading, refetch } = useQuery(getCategoriesQueryOptions());
    const { mutate: updateArticleBanner, isPending: isArticleBannerUpdatePending } = useMutation({
        mutationFn: updateArticleBannerMutation,
        onSuccess: () => {
            toast.success(t("articles.article_banner_updated"));
        },
    });

    const handleUpdateApiArticleBanner = async (banner: File) => {
        if (!articleId) return;

        const newBanner = await fileToBase64(banner);

        updateArticleBanner({
            article_id: articleId,
            banner: newBanner,
        });
    };

    const formik = useFormik<CreateArticleValues>({
        initialValues: {
            title: "",
            content: "",
            article_category_id: null,
            banner_url: undefined,
            required_role: ArticleRequiredRoles.ANYONE,
            status: ArticleStatus.SENT,
            video_url: "",
            ...initialValues,
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            title: Yup.string().required(t("validation.required")),
            content: Yup.string().required(t("validation.required")),
            article_category_id: Yup.string().required(t("validation.required")),
            video_url: Yup.string().url(t("validation.invalid_url")),
        }),
        onSubmit: (values) => {
            onSubmit(values);
        },
    });

    const banner = useMemo(() => {
        if (formik.values.banner_url) {
            if (typeof formik.values.banner_url === "string") {
                return `url(${formik.values.banner_url})`;
            }
            return `url(${URL.createObjectURL(formik.values.banner_url)})`;
        }

        return "url(https://placehold.co/1600x500)";
    }, [formik.values.banner_url]);

    if (isLoading || !user) {
        return <Loader variant="fullscreen" />;
    }

    const allowedStatuses = useMemo(
        () => [
            {
                value: ArticleStatus.SENT,
                role: [Roles.ADMIN, Roles.REDACTOR, Roles.VOLUNTEER, Roles.VOLUNTEERSUPERVISOR],
            },
            {
                value: ArticleStatus.PUBLISHED,
                role: [Roles.ADMIN, Roles.REDACTOR, Roles.VOLUNTEERSUPERVISOR],
            },
            {
                value: ArticleStatus.REJECTED,
                role: [Roles.ADMIN, Roles.REDACTOR, Roles.VOLUNTEERSUPERVISOR],
            },
            {
                value: ArticleStatus.DRAFT,
                role: [Roles.ADMIN, Roles.REDACTOR, Roles.VOLUNTEER, Roles.VOLUNTEERSUPERVISOR],
            },
            {
                value: ArticleStatus.CORRECTED,
                role: [Roles.ADMIN, Roles.REDACTOR, Roles.VOLUNTEER, Roles.VOLUNTEERSUPERVISOR],
            },
            {
                value: ArticleStatus.DELETED,
                role: [Roles.ADMIN, Roles.REDACTOR, Roles.VOLUNTEERSUPERVISOR],
            },
        ],
        [t, ArticleStatus]
    );

    return (
        <form onSubmit={formik.handleSubmit}>
            <div
                className="border-border-brand bg-card flex h-[500px] w-full flex-wrap items-end justify-between rounded-[10px] border-2 bg-cover bg-center p-5"
                style={{ backgroundImage: banner }}
            >
                <div className="flex gap-5">
                    <ChangeImageInput
                        value={typeof formik.values.banner_url === "string" ? undefined : formik.values.banner_url}
                        isLoading={isArticleBannerUpdatePending}
                        onChange={(image) => {
                            if (articleId && image) {
                                handleUpdateApiArticleBanner(image);
                            } else {
                                formik.setFieldValue("banner_url", image);
                            }
                        }}
                    />
                </div>
            </div>
            <div className="my-5 flex flex-wrap gap-5 md:flex-nowrap">
                <div className="w-full space-y-1.5">
                    <Label htmlFor="title">{t("articles.form.title")}</Label>
                    <Input
                        id="title"
                        name="title"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.title && formik.errors.title && (
                        <p className="text-destructive text-sm">{formik.errors.title as string}</p>
                    )}
                </div>
                <div className="flex w-full flex-col gap-3 md:flex-row md:items-end">
                    <div className="w-full min-w-0 flex-1 space-y-1.5">
                        <Label htmlFor="article_category_id">{t("articles.form.article_category_id")}</Label>
                        <select
                            id="article_category_id"
                            name="article_category_id"
                            disabled={isCategoriesLoading}
                            onChange={(e) => formik.setFieldValue("article_category_id", e.target.value)}
                            onBlur={formik.handleBlur}
                            className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-lg border bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:ring-3"
                        >
                            <option value="">---</option>
                            {categories?.items.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {formik.touched.article_category_id && formik.errors.article_category_id && (
                            <p className="text-destructive text-sm">{formik.errors.article_category_id}</p>
                        )}
                        {isCategoriesLoading && <Loader />}
                    </div>
                    <Button
                        type="button"
                        className="h-10 w-full shrink-0 gap-2.5 px-4 md:w-auto"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <Settings className="size-5" />
                        {t("articles.manage_categories")}
                    </Button>
                </div>
            </div>
            {formik.values.video_url && !formik.errors.video_url && (
                <Videoplayer className="my-5 h-[600px]" src={formik.values.video_url} />
            )}
            <div className="mb-5 w-full space-y-1.5">
                <Label htmlFor="video_url">{t("articles.form.video_url")}</Label>
                <Input
                    id="video_url"
                    name="video_url"
                    value={formik.values.video_url}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.video_url && formik.errors.video_url && (
                    <p className="text-destructive text-sm">{formik.errors.video_url as string}</p>
                )}
            </div>
            <div
                className="mb-2.5 min-h-[500px]"
                style={{
                    outline:
                        formik.touched.content && formik.errors.content
                            ? "2px solid var(--color-danger-brand)"
                            : "none",
                }}
            >
                <Markdown
                    onChange={(markdown) => formik.setFieldValue("content", markdown)}
                    className="markdown-editor"
                    readOnly={false}
                    placeholder={t("articles.form.content")}
                    content={formik.values.content}
                />
            </div>

            <div className="flex w-full flex-wrap items-center justify-between gap-4 md:flex-nowrap">
                <div className="mt-4 flex flex-wrap gap-4 md:flex-nowrap md:gap-10">
                    <Button type="submit">{t("articles.send")}</Button>
                    <Button
                        onClick={() => {
                            if (!formik.values.article_category_id) {
                                toast.error(t("articles.category_required"));
                                return;
                            }

                            onSaveDraft(formik.values);
                        }}
                        variant="outline"
                        type="button"
                    >
                        {t("articles.save_draft")}
                    </Button>
                </div>

                <div className="flex flex-wrap gap-4 md:flex-nowrap">
                    <div className="space-y-1.5">
                        <Label htmlFor="required_role">{t("articles.form.required_role")}</Label>
                        <select
                            id="required_role"
                            name="required_role"
                            disabled={isCategoriesLoading}
                            value={formik.values.required_role}
                            onChange={(e) => formik.setFieldValue("required_role", e.target.value)}
                            onBlur={formik.handleBlur}
                            className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-8 w-[200px] rounded-lg border bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:ring-3"
                        >
                            {Object.values(ArticleRequiredRoles).map((role) => (
                                <option key={role} value={role}>
                                    {translatedArticleRequiredRoles[role]}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="status">{t("articles.form.status")}</Label>
                        <select
                            id="status"
                            name="status"
                            disabled={isCategoriesLoading}
                            value={formik.values.status}
                            onChange={(e) => formik.setFieldValue("status", e.target.value)}
                            onBlur={formik.handleBlur}
                            className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-8 w-[200px] rounded-lg border bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:ring-3"
                        >
                            {allowedStatuses
                                .filter(({ role }) => role.includes(user.user_role))
                                .map(({ value }) => (
                                    <option key={value} value={value}>
                                        {translatedArticleStatus[value]}
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>
            </div>
            <CreateArticleCategoryModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={refetch} />
        </form>
    );
};

export default ArticleEditor;
