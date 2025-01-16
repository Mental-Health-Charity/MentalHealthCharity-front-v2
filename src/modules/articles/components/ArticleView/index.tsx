import { Box, Chip, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Container from '../../../shared/components/Container';
import Markdown from '../../../shared/components/Markdown';
import formatDate from '../../../shared/helpers/formatDate';
import { Article } from '../../types';
import ArticleAuthor from '../ArticleAuthor';
import ArticleCard from '../ArticleCard';
import Videoplayer from '../Videoplayer';

interface Props {
    article: Article;
    articles?: Article[];
}

const ArticleView = ({ article, articles }: Props) => {
    const theme = useTheme();
    const { t } = useTranslation();

    return (
        <Container
            sx={{
                padding: '5px',
            }}
        >
            <Box
                sx={{
                    backgroundImage: `url(${article.banner_url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    width: '100%',
                    minHeight: '500px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '20px',
                    border: `2px solid ${theme.palette.colors.border}`,
                    backgroundColor: theme.palette.background.paper,
                    flexWrap: 'wrap',
                }}
            >
                <ArticleAuthor user={article.created_by} />
            </Box>
            <Box
                sx={{
                    margin: '30px 0 35px 0',
                }}
            >
                <Typography sx={{ fontSize: '48px', fontWeight: 'bold' }} component="h1" color="textSecondary">
                    {article.title}
                </Typography>
                <Typography
                    sx={{
                        fontSize: '20px',
                        fontWeight: 500,
                        color: theme.palette.text.light,
                    }}
                    component="p"
                >
                    {t('common.created_at', {
                        date: formatDate(article.creation_date),
                    })}
                </Typography>
                <Chip
                    label={article.article_category.name}
                    color="info"
                    sx={{
                        fontSize: '20px',
                        padding: '20px',
                        fontWeight: 500,
                        marginTop: '10px',
                    }}
                />
            </Box>
            {article.video_url && <Videoplayer sx={{ height: '600px', marginTop: '20px' }} src={article.video_url} />}

            <Markdown readOnly content={article.content} />

            <Box marginTop={2} display="flex" flexDirection="column" gap={2}>
                <Typography color="secondary" fontWeight={600} fontSize={20}>
                    {t('articles.more_articles')}
                </Typography>
                <Box
                    gap={2}
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: 2,
                        marginTop: '20px',
                    }}
                >
                    {articles && articles.map((article) => <ArticleCard key={article.id} article={article} />)}
                </Box>
            </Box>
        </Container>
    );
};

export default ArticleView;
