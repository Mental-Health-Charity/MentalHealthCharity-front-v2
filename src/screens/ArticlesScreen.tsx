import { Box, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ArticleCard from '../modules/articles/components/ArticleCard';
import ArticlesHeading from '../modules/articles/components/ArticlesHeading';
import { articlesQueryOptions } from '../modules/articles/queries/articlesQueryOptions';
import Container from '../modules/shared/components/Container';

const ArticlesScreen = () => {
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState(query);
    const [page, _setPage] = useState(1);
    const { t } = useTranslation();

    const debouncedSetQuery = useCallback(
        debounce((q) => {
            setDebouncedQuery(q);
        }, 500),
        []
    );

    useEffect(() => {
        debouncedSetQuery(query);
    }, [query, debouncedSetQuery]);

    const { data, isLoading } = useQuery(articlesQueryOptions({ q: debouncedQuery, page, size: 50 }));

    return (
        <Container
            sx={{
                maxWidth: '1600px',
            }}
            waves
        >
            <ArticlesHeading onSearch={setQuery} search={query} />
            <Box
                gap={2}
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
                    gap: 2,
                }}
            >
                {!isLoading && (!data || data.items.length === 0) && <Typography>{t('common.not_found')}</Typography>}
                {data && data.items.map((article) => <ArticleCard article={article} key={article.id} />)}
            </Box>
        </Container>
    );
};

export default ArticlesScreen;
