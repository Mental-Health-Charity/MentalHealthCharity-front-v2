import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ArticleCard from '../modules/articles/components/ArticleCard';
import { ArticleStatus } from '../modules/articles/constants';
import { articlesByUserQueryOptions } from '../modules/articles/queries/articlesByUserQueryOptions';
import { useUser } from '../modules/auth/components/AuthProvider';
import Container from '../modules/shared/components/Container';
import Loader from '../modules/shared/components/Loader';
import SimpleCard from '../modules/shared/components/SimpleCard';

const ArticleDashboardScreen = () => {
    const { t } = useTranslation();
    const { user } = useUser();

    const statuses = [
        {
            key: ArticleStatus.DRAFT,
            title: t('articles.dashboard.draft', { user: user?.full_name }),
            subtitle: t('articles.dashboard.draft_subtitle'),
        },
        {
            key: ArticleStatus.REJECTED,
            title: t('articles.dashboard.rejected'),
        },
        {
            key: ArticleStatus.CORRECTED,
            title: t('articles.dashboard.corrected'),
        },
        { key: ArticleStatus.SENT, title: t('articles.dashboard.sent') },
        {
            key: ArticleStatus.PUBLISHED,
            title: t('articles.dashboard.published'),
        },
        { key: ArticleStatus.DELETED, title: t('articles.dashboard.deleted') },
    ];

    const getArticles = (status: ArticleStatus) =>
        articlesByUserQueryOptions(
            {
                status,
                author: user ? user.id : 0,
                page: 1,
                size: 100,
            },
            {
                retry: 1,
                refetchOnWindowFocus: false,
                enabled: !!user,
                queryKey: ['articles', status],
            }
        );

    return (
        <Container>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <SimpleCard title={t('articles.dashboard.title')} subtitle={t('articles.dashboard.subtitle')}>
                    <Button
                        component={Link}
                        to="/articles/create"
                        variant="contained"
                        sx={{ marginTop: '20px', gap: '10px' }}
                    >
                        <AddIcon fontSize="large" /> {t('articles.add_article')}
                    </Button>
                </SimpleCard>

                {statuses.map(({ key, title, subtitle }) => {
                    const { data, isLoading } = useQuery(getArticles(key));

                    return (
                        <SimpleCard subtitle={subtitle} key={key} title={title}>
                            {isLoading && <Loader />}
                            {data && data.total > 0 ? (
                                <Box
                                    gap={2}
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                                        gap: 2,
                                        marginTop: '20px',
                                    }}
                                >
                                    {data.items.map((article) => (
                                        <Box
                                            sx={{
                                                width: '100%',
                                            }}
                                        >
                                            <ArticleCard
                                                draft={key === ArticleStatus.DRAFT}
                                                article={article}
                                                key={article.id}
                                            />
                                            {article.reject_message !== '' && <Box>{article.reject_message}</Box>}
                                        </Box>
                                    ))}
                                </Box>
                            ) : (
                                <Typography sx={{ marginTop: '10px' }}>{t('articles.dashboard.not_found')}</Typography>
                            )}
                        </SimpleCard>
                    );
                })}
            </Box>
        </Container>
    );
};

export default ArticleDashboardScreen;
