import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import useTheme from "../../../../theme";
import { useUser } from "../../../auth/components/AuthProvider";
import ArticleAuthor from "../ArticleAuthor";
import Videoplayer from "../Videoplayer";
import Markdown from "../../../shared/components/Markdown";
import { useTranslation } from "react-i18next";
import { CreateArticleValues } from "../../types";
import Loader from "../../../shared/components/Loader";
import {
    ArticleRequiredRoles,
    ArticleStatus,
    translatedArticleRequiredRoles,
    translatedArticleStatus,
} from "../../constants";
import SettingsIcon from "@mui/icons-material/Settings";
import ChangeImageInput from "../../../shared/components/ChangeImageInput";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategoriesQueryOptions } from "../../queries/getCategoriesQueryOptions";
import CreateArticleCategoryModal from "../CreateCategoryModal";

interface Props {
    initialValues?: CreateArticleValues;
    onSubmit: (values: CreateArticleValues) => void;
    onSaveDraft: (values: CreateArticleValues) => void;
}

const ArticleEditor = ({ initialValues, onSubmit, onSaveDraft }: Props) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const { user, isLoading } = useUser();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        data: categories,
        isLoading: isCategoriesLoading,
        refetch,
    } = useQuery(getCategoriesQueryOptions());

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
            article_category_id: Yup.string().required(
                t("validation.required")
            ),
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

    return (
        <Box component="form" onSubmit={formik.handleSubmit}>
            <button
                type="button"
                onClick={() => console.log(formik.values, initialValues)}
            >
                debug
            </button>
            <Box
                sx={{
                    backgroundImage: banner,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    width: "100%",
                    height: "500px",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    padding: "20px",
                    border: `2px solid ${theme.palette.colors.border}`,
                    backgroundColor: theme.palette.background.paper,
                    flexWrap: "wrap",
                }}
            >
                <ArticleAuthor user={user} />
                <Box
                    sx={{
                        display: "flex",
                        gap: "20px",
                    }}
                >
                    <ChangeImageInput
                        value={
                            typeof formik.values.banner_url === "string"
                                ? undefined
                                : formik.values.banner_url
                        }
                        onChange={(image) =>
                            formik.setFieldValue("banner_url", image)
                        }
                    />
                </Box>
            </Box>
            <Box sx={{ margin: "20px 0", display: "flex", gap: "20px" }}>
                <TextField
                    fullWidth
                    label={t("articles.form.title")}
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.title && Boolean(formik.errors.title)}
                    helperText={
                        formik.touched.title && (formik.errors.title as string)
                    }
                />
                <Box width="100%" display="flex" gap={2}>
                    <FormControl fullWidth>
                        <InputLabel id="category-label">
                            {t("articles.form.article_category_id")}
                        </InputLabel>
                        <Select
                            disabled={isCategoriesLoading}
                            labelId="category-label"
                            name="article_category_id"
                            onChange={(e) =>
                                formik.setFieldValue(
                                    "article_category_id",
                                    e.target.value
                                )
                            }
                            onBlur={formik.handleBlur}
                            error={
                                formik.touched.article_category_id &&
                                Boolean(formik.errors.article_category_id)
                            }
                        >
                            {categories?.items.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>
                        {isCategoriesLoading && <Loader />}
                    </FormControl>
                    <Button
                        type="button"
                        style={{
                            maxWidth: "342px",
                            gap: "10px",
                        }}
                        fullWidth
                        variant="contained"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <SettingsIcon />
                        {t("articles.manage_categories")}
                    </Button>
                </Box>
            </Box>
            {formik.values.video_url && !formik.errors.video_url && (
                <Videoplayer
                    sx={{ height: "600px", margin: "20px 0" }}
                    src={formik.values.video_url}
                />
            )}
            <TextField
                fullWidth
                label={t("articles.form.video_url")}
                name="video_url"
                value={formik.values.video_url}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                    formik.touched.video_url && Boolean(formik.errors.video_url)
                }
                helperText={
                    formik.touched.video_url &&
                    (formik.errors.video_url as string)
                }
                sx={{ marginBottom: "20px" }}
            />
            <Box
                sx={{
                    minHeight: "500px",
                    outline:
                        formik.touched.content && formik.errors.content
                            ? `2px solid ${theme.palette.colors.danger}`
                            : "none",
                    marginBottom: "10px",
                }}
            >
                <Markdown
                    onChange={(markdown) =>
                        formik.setFieldValue("content", markdown)
                    }
                    className="markdown-editor"
                    readOnly={false}
                    placeholder={t("articles.form.content")}
                    content={formik.values.content}
                />
            </Box>

            <Box
                display="flex"
                gap={2}
                alignItems="center"
                width="100%"
                justifyContent="space-between"
            >
                <Box marginTop={2} display="flex" gap={5}>
                    <Button variant="contained" color="primary" type="submit">
                        {t("articles.send")}
                    </Button>
                    <Button
                        onClick={() => onSaveDraft(formik.values)}
                        variant="outlined"
                        color="primary"
                        type="button"
                    >
                        {t("articles.save_draft")}
                    </Button>
                </Box>

                <Box gap={2} display="flex">
                    <FormControl>
                        <InputLabel id="required_role">
                            {t("articles.form.required_role")}
                        </InputLabel>
                        <Select
                            sx={{
                                width: "200px",
                            }}
                            disabled={isCategoriesLoading}
                            labelId="required_role"
                            name="required_role"
                            value={formik.values.required_role}
                            onChange={(e) =>
                                formik.setFieldValue(
                                    "required_role",
                                    e.target.value
                                )
                            }
                            onBlur={formik.handleBlur}
                            error={
                                formik.touched.required_role &&
                                Boolean(formik.errors.required_role)
                            }
                        >
                            {Object.values(ArticleRequiredRoles).map((role) => (
                                <MenuItem key={role} value={role}>
                                    {translatedArticleRequiredRoles[role]}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel id="status">
                            {t("articles.form.status")}
                        </InputLabel>
                        <Select
                            sx={{
                                width: "200px",
                            }}
                            disabled={isCategoriesLoading}
                            labelId="status"
                            name="status"
                            value={formik.values.status}
                            onChange={(e) =>
                                formik.setFieldValue("status", e.target.value)
                            }
                            onBlur={formik.handleBlur}
                            error={
                                formik.touched.status &&
                                Boolean(formik.errors.status)
                            }
                        >
                            {Object.values(ArticleStatus).map((status) => (
                                <MenuItem key={status} value={status}>
                                    {translatedArticleStatus[status]}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Box>
            <CreateArticleCategoryModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={refetch}
            />
        </Box>
    );
};

export default ArticleEditor;
