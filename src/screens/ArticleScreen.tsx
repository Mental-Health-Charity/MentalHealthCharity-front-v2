import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ArticleView from '../modules/articles/components/ArticleView';
import { articlesQueryOptions } from '../modules/articles/queries/articlesQueryOptions';
import { getArticleByIdQueryOptions } from '../modules/articles/queries/getArticleByIdQueryOptions';

const ArticleScreen = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data } = useQuery(getArticleByIdQueryOptions({ id: Number(id) || -1 }, {}));
    const { data: articles } = useQuery(articlesQueryOptions({ q: '', page: 1, size: 50 }));

    const getRandomArticles = useCallback(() => {
        if (!articles?.items) return [];
        const randomArticles = [];
        const usedIndices = new Set<number>();
        const maxTries = 10;
        let tries = 0;

        while (randomArticles.length < 3 && usedIndices.size < articles.items.length && tries < maxTries) {
            const randomIndex = Math.floor(Math.random() * articles.items.length);
            if (!usedIndices.has(randomIndex) && randomIndex !== Number(id)) {
                usedIndices.add(randomIndex);
                randomArticles.push(articles.items[randomIndex]);
            }
            tries++;
        }

        return randomArticles;
    }, [articles, id]);

    const suggestedArticles = getRandomArticles();

    if (!id || !data) {
        navigate('/404');
        return null;
    }

    return <ArticleView articles={suggestedArticles} article={data} />;
};

export default ArticleScreen;
