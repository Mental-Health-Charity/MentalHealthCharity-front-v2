import {
    Avatar,
    Box,
    Card,
    CardContent,
    CardMedia,
    Chip,
    Divider,
    IconButton,
    Typography,
    useTheme,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { baseUrl } from '../../../../api';
import { useUser } from '../../../auth/components/AuthProvider';
import ActionMenu from '../../../shared/components/ActionMenu';
import InternalLink from '../../../shared/components/InternalLink/styles';
import { Permissions } from '../../../shared/constants';
import formatDate from '../../../shared/helpers/formatDate';
import usePermissions from '../../../shared/hooks/usePermissions';
import { ArticleStatus } from '../../constants';
import updateArticleMutation from '../../queries/updateArticleMutation';
import { Article } from '../../types';

interface Props {
    article: Article;
    onRefetch?: () => void;
    draft?: boolean;
}

const ArticleCard = ({ article, onRefetch, draft }: Props) => {
    const theme = useTheme();
    const { user } = useUser();
    const { t } = useTranslation();
    const { hasPermissions } = usePermissions();
    const { mutate } = useMutation({
        mutationFn: updateArticleMutation,
        onSuccess: () => {
            onRefetch && onRefetch();
            toast.success(t('articles.article_deleted_success'));
        },
    });

    const handleDeleteArticle = useCallback(() => {
        mutate({
            article_id: article.id,
            banner_base64: article.banner_url,
            title: article.title,
            content: article.content,
            video_url: article.video_url,
            article_category_id: article.article_category.id,
            required_role: article.required_role,
            status: ArticleStatus.DELETED,
        });
    }, [mutate, article]);

    const canManageArticle = hasPermissions(Permissions.MANAGE_ARTICLES) || user?.id === article.created_by.id;

    return (
        <InternalLink
            to={draft ? `/articles/edit/${article.id}/` : `/article/${article.id}`}
            reloadDocument
            style={{
                textDecoration: 'none',
                width: '100%',
            }}
        >
            <Card
                sx={{
                    width: '100%',
                    borderRadius: 2,
                    padding: '0',
                }}
                component="article"
            >
                <Box sx={{ position: 'relative' }}>
                    <CardMedia
                        component="img"
                        height="350"
                        image={baseUrl + article.banner_url}
                        alt={article.title}
                        sx={{ borderRadius: '10px' }}
                        onError={(e) => {
                            e.currentTarget.src = 'https://placehold.co/600x400';
                        }}
                    />
                    <Chip
                        label={article.article_category.name}
                        size="small"
                        sx={{
                            fontWeight: 'bold',
                            backgroundColor: theme.palette.primary.main,
                            color: theme.palette.text.primary,
                            fontSize: 16,
                            padding: '16px 8px',
                            textTransform: 'uppercase',
                            position: 'absolute',
                            bottom: 10,
                            left: 10,
                            borderRadius: 10,
                            minWidth: 100,
                            boxShadow: 1,
                        }}
                    />
                </Box>
                <CardContent
                    sx={{
                        paddingBottom: '0px !important',
                        padding: '20px 20px',
                    }}
                >
                    <Typography
                        gutterBottom
                        variant="h5"
                        component="p"
                        fontSize={24}
                        color="text.secondary"
                        fontWeight={600}
                    >
                        {article.title}
                    </Typography>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                        fontSize={20}
                        sx={{
                            minHeight: '60px',
                            wordBreak: 'break-word',
                            // max 1 line
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                        }}
                    >
                        {article.content.length > 100 ? `${article.content.substring(0, 103)}...` : article.content}
                    </Typography>
                    <Divider
                        sx={{
                            margin: '10px 0',
                        }}
                    />
                    <Box
                        sx={{
                            padding: '5px 0 15px 0',
                        }}
                    >
                        <Box flexWrap="nowrap" display="flex" justifyContent="space-between" alignItems="center">
                            <Box display="flex" alignItems="center">
                                <Avatar
                                    variant="rounded"
                                    src={article.created_by.chat_avatar_url}
                                    alt={article.created_by.full_name}
                                    sx={{ width: 50, height: 50, mr: 1 }}
                                />
                                <Box>
                                    <Typography fontWeight={550} fontSize={20} variant="body1" color="text.secondary">
                                        {article.created_by.full_name}
                                    </Typography>
                                    <Typography fontSize={20} variant="body1" color="text.secondary">
                                        {formatDate(article.creation_date)}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box>
                                {canManageArticle && (
                                    <ActionMenu
                                        actions={[
                                            {
                                                id: 'edit',
                                                label: 'Edytuj',
                                                icon: <EditIcon />,
                                                href: `/articles/edit/${article.id}/`,
                                            },
                                            {
                                                id: 'delete',
                                                variant: 'divider',
                                                label: 'Usuń',
                                                icon: <DeleteIcon />,
                                                onClick: handleDeleteArticle,
                                            },
                                        ]}
                                    />
                                )}

                                <IconButton>
                                    <OpenInNewIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </InternalLink>
    );
};

export default ArticleCard;
