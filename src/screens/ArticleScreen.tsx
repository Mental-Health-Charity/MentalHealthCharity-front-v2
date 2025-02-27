import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import ArticleView from '../modules/articles/components/ArticleView';
import { ArticleStatus } from '../modules/articles/constants';
import { articlesQueryOptions } from '../modules/articles/queries/articlesQueryOptions';
import { getArticleByIdQueryOptions } from '../modules/articles/queries/getArticleByIdQueryOptions';
import Loader from '../modules/shared/components/Loader';
import NotFoundScreen from './NotFoundScreen';

const ArticleScreen = () => {
    const { id } = useParams<{ id: string }>();
    const { data } = useQuery(getArticleByIdQueryOptions({ id: Number(id) || -1 }, {}));
    const { data: articles, isLoading } = useQuery(articlesQueryOptions({ q: '', page: 1, size: 50 }));

    const getRandomArticles = useCallback(() => {
        // TODO: Waiting for backend to fix
        const filtered = articles
            ? articles.items.filter(
                  (article) => article.status === ArticleStatus.PUBLISHED && article.id !== Number(id)
              )
            : [];
        return filtered.sort(() => Math.random() - 0.5).slice(0, 3);
    }, [articles, id]);

    const suggestedArticles = getRandomArticles();

    if (isLoading) {
        return <Loader variant="fullscreen" />;
    }

    if (!id || !data) {
        return <NotFoundScreen />;
    }

    return <ArticleView articles={suggestedArticles} article={data} />;
};

export default ArticleScreen;
