import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ArticleEditor from '../modules/articles/components/ArticleEditor';
import { ArticleStatus } from '../modules/articles/constants';
import createArticleMutation from '../modules/articles/queries/createArticleMutation';
import { CreateArticlePayload, CreateArticleValues } from '../modules/articles/types';
import Container from '../modules/shared/components/Container';
import Loader from '../modules/shared/components/Loader';
import SimpleCard from '../modules/shared/components/SimpleCard';
import fileToBase64 from '../modules/shared/helpers/fileToBase64';
import useTheme from '../theme';

const CreateArticleScreen = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const theme = useTheme();

    const { mutate: createArticle, isPending: isArticleCreationPending } = useMutation({
        mutationFn: createArticleMutation,
        onSuccess: () => {
            toast.success(t('articles.article_created'));

            setTimeout(() => {
                navigate('/articles/dashboard');
            }, 2000);
        },
    });

    const handleCreateArticle = async (values: CreateArticleValues) => {
        const banner = values.banner_url instanceof File ? await fileToBase64(values.banner_url) : values.banner_url;

        const transformValues: CreateArticlePayload = {
            ...values,
            banner_base64: banner || '',
            banner_url: '',
            article_category_id: values.article_category_id || 0,
        };

        createArticle(transformValues);
    };

    const handleCreateDraft = async (values: CreateArticleValues) => {
        const banner = values.banner_url instanceof File ? await fileToBase64(values.banner_url) : values.banner_url;

        const transformValues: CreateArticlePayload = {
            ...values,
            banner_base64: banner || '',
            banner_url: '',
            status: ArticleStatus.DRAFT,
            article_category_id: values.article_category_id || 0,
        };

        console.log(transformValues);

        createArticle(transformValues);
    };

    return (
        <Container
            parentProps={{
                sx: {
                    backgroundColor: theme.palette.colors.border,
                    boxShadow: `0px 0px 10px ${theme.palette.shadows.box}`,
                },
            }}
        >
            {isArticleCreationPending && <Loader variant="fullscreen" />}
            <SimpleCard
                sx={{
                    marginBottom: '20px',

                    padding: '20px',
                }}
            >
                <ArticleEditor onSaveDraft={handleCreateDraft} onSubmit={handleCreateArticle} />
            </SimpleCard>
        </Container>
    );
};

export default CreateArticleScreen;
