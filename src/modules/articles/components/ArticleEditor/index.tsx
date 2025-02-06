import SettingsIcon from '@mui/icons-material/Settings';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import useTheme from '../../../../theme';
import { useUser } from '../../../auth/components/AuthProvider';
import ChangeImageInput from '../../../shared/components/ChangeImageInput';
import Loader from '../../../shared/components/Loader';
import Markdown from '../../../shared/components/Markdown';
import fileToBase64 from '../../../shared/helpers/fileToBase64';
import { Roles } from '../../../users/constants';
import {
    ArticleRequiredRoles,
    ArticleStatus,
    translatedArticleRequiredRoles,
    translatedArticleStatus,
} from '../../constants';
import { getCategoriesQueryOptions } from '../../queries/getCategoriesQueryOptions';
import updateArticleBannerMutation from '../../queries/updateArticleBannerMutation';
import { CreateArticleValues } from '../../types';
import CreateArticleCategoryModal from '../CreateCategoryModal';
import Videoplayer from '../Videoplayer';

interface Props {
    initialValues?: CreateArticleValues;
    onSubmit: (values: CreateArticleValues) => void;
    onSaveDraft: (values: CreateArticleValues) => void;
    articleId?: number;
}

const ArticleEditor = ({ initialValues, onSubmit, onSaveDraft, articleId }: Props) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const { user, isLoading } = useUser();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: categories, isLoading: isCategoriesLoading, refetch } = useQuery(getCategoriesQueryOptions());
    const { mutate: updateArticleBanner, isPending: isArticleBannerUpdatePending } = useMutation({
        mutationFn: updateArticleBannerMutation,
        onSuccess: () => {
            toast.success(t('articles.article_banner_updated'));
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
            title: '',
            content: '',
            article_category_id: null,
            banner_url: undefined,
            required_role: ArticleRequiredRoles.ANYONE,
            status: ArticleStatus.SENT,
            video_url: '',
            ...initialValues,
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            title: Yup.string().required(t('validation.required')),
            content: Yup.string().required(t('validation.required')),
            article_category_id: Yup.string().required(t('validation.required')),
            video_url: Yup.string().url(t('validation.invalid_url')),
        }),
        onSubmit: (values) => {
            onSubmit(values);
        },
    });

    const banner = useMemo(() => {
        if (formik.values.banner_url) {
            if (typeof formik.values.banner_url === 'string') {
                return `url(${formik.values.banner_url})`;
            }
            return `url(${URL.createObjectURL(formik.values.banner_url)})`;
        }

        return 'url(https://placehold.co/1600x500)';
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
        <Box component="form" onSubmit={formik.handleSubmit}>
            <Box
                sx={{
                    backgroundImage: banner,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    width: '100%',
                    height: '500px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    padding: '20px',
                    border: `2px solid ${theme.palette.colors.border}`,
                    backgroundColor: theme.palette.background.paper,
                    flexWrap: 'wrap',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        gap: '20px',
                    }}
                >
                    <ChangeImageInput
                        value={typeof formik.values.banner_url === 'string' ? undefined : formik.values.banner_url}
                        isLoading={isArticleBannerUpdatePending}
                        onChange={(image) => {
                            if (articleId && image) {
                                handleUpdateApiArticleBanner(image);
                            } else {
                                formik.setFieldValue('banner_url', image);
                            }
                        }}
                    />
                </Box>
            </Box>
            <Box flexWrap={{ md: 'nowrap', xs: 'wrap' }} sx={{ margin: '20px 0', display: 'flex', gap: '20px' }}>
                <TextField
                    fullWidth
                    label={t('articles.form.title')}
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.title && Boolean(formik.errors.title)}
                    helperText={formik.touched.title && (formik.errors.title as string)}
                />
                <Box flexWrap={{ md: 'nowrap', xs: 'wrap' }} width="100%" display="flex" gap={2}>
                    <FormControl fullWidth>
                        <InputLabel id="category-label">{t('articles.form.article_category_id')}</InputLabel>
                        <Select
                            disabled={isCategoriesLoading}
                            labelId="category-label"
                            name="article_category_id"
                            onChange={(e) => formik.setFieldValue('article_category_id', e.target.value)}
                            onBlur={formik.handleBlur}
                            error={formik.touched.article_category_id && Boolean(formik.errors.article_category_id)}
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
                            gap: '10px',
                        }}
                        fullWidth
                        variant="contained"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <SettingsIcon />
                        {t('articles.manage_categories')}
                    </Button>
                </Box>
            </Box>
            {formik.values.video_url && !formik.errors.video_url && (
                <Videoplayer sx={{ height: '600px', margin: '20px 0' }} src={formik.values.video_url} />
            )}
            <TextField
                fullWidth
                label={t('articles.form.video_url')}
                name="video_url"
                value={formik.values.video_url}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.video_url && Boolean(formik.errors.video_url)}
                helperText={formik.touched.video_url && (formik.errors.video_url as string)}
                sx={{ marginBottom: '20px' }}
            />
            <Box
                sx={{
                    minHeight: '500px',
                    outline:
                        formik.touched.content && formik.errors.content
                            ? `2px solid ${theme.palette.colors.danger}`
                            : 'none',
                    marginBottom: '10px',
                }}
            >
                <Markdown
                    onChange={(markdown) => formik.setFieldValue('content', markdown)}
                    className="markdown-editor"
                    readOnly={false}
                    placeholder={t('articles.form.content')}
                    content={formik.values.content}
                />
            </Box>

            <Box
                display="flex"
                gap={2}
                alignItems="center"
                width="100%"
                flexWrap={{ xs: 'wrap', md: 'nowrap' }}
                justifyContent="space-between"
            >
                <Box flexWrap={{ xs: 'wrap', md: 'nowrap' }} marginTop={2} display="flex" gap={{ xs: 2, md: 5 }}>
                    <Button variant="contained" color="primary" type="submit">
                        {t('articles.send')}
                    </Button>
                    <Button
                        onClick={() => {
                            if (!formik.values.article_category_id) {
                                toast.error(t('articles.category_required'));
                                return;
                            }

                            onSaveDraft(formik.values);
                        }}
                        variant="outlined"
                        color="primary"
                        type="button"
                    >
                        {t('articles.save_draft')}
                    </Button>
                </Box>

                <Box flexWrap={{ xs: 'wrap', md: 'nowrap' }} gap={2} display="flex">
                    <FormControl>
                        <InputLabel id="required_role">{t('articles.form.required_role')}</InputLabel>
                        <Select
                            sx={{
                                width: '200px',
                            }}
                            disabled={isCategoriesLoading}
                            labelId="required_role"
                            name="required_role"
                            value={formik.values.required_role}
                            onChange={(e) => formik.setFieldValue('required_role', e.target.value)}
                            onBlur={formik.handleBlur}
                            error={formik.touched.required_role && Boolean(formik.errors.required_role)}
                        >
                            {Object.values(ArticleRequiredRoles).map((role) => (
                                <MenuItem key={role} value={role}>
                                    {translatedArticleRequiredRoles[role]}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel id="status">{t('articles.form.status')}</InputLabel>
                        <Select
                            sx={{
                                width: '200px',
                            }}
                            disabled={isCategoriesLoading}
                            labelId="status"
                            name="status"
                            value={formik.values.status}
                            onChange={(e) => formik.setFieldValue('status', e.target.value)}
                            onBlur={formik.handleBlur}
                            error={formik.touched.status && Boolean(formik.errors.status)}
                        >
                            {allowedStatuses
                                .filter(({ role }) => role.includes(user.user_role))
                                .map(({ value }) => (
                                    <MenuItem key={value} value={value}>
                                        {translatedArticleStatus[value]}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                </Box>
            </Box>
            <CreateArticleCategoryModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={refetch} />
        </Box>
    );
};

export default ArticleEditor;
