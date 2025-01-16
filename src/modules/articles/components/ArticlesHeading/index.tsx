import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Avatar, Box, Button, Card, TextField, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import person_image from '../../../../assets/static/person.png';
import { Permissions } from '../../../shared/constants';
import usePermissions from '../../../shared/hooks/usePermissions';

interface Props {
    onSearch: (query: string) => void;
    search: string;
}

const ArticlesHeading = ({ onSearch, search }: Props) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const { hasPermissions } = usePermissions();

    return (
        <>
            <Card
                sx={{
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    width: '100%',
                    margin: '20px auto',
                    padding: '15px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'start',
                    gap: '20px',
                }}
            >
                <Box
                    sx={{
                        display: { xs: 'none', md: 'block' },
                    }}
                >
                    <Avatar
                        src={person_image}
                        variant="rounded"
                        style={{
                            width: '160px',
                            height: '160px',
                            borderRadius: '10px',
                            backgroundColor: theme.palette.primary.main,
                            boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.15)',
                        }}
                    />
                </Box>
                <Box
                    sx={{
                        gap: '6px',
                        display: 'flex',
                        flexDirection: 'column',

                        borderRadius: '8px',
                        padding: '10px',
                    }}
                >
                    <Typography component="h1" color={theme.palette.primary.main} fontWeight={700} variant="h4">
                        {t('articles.title')}
                    </Typography>
                    <Typography color={theme.palette.text.secondary} component="h2" variant="h6">
                        {t('articles.subtitle')}
                    </Typography>
                </Box>
            </Card>
            <Card
                style={{
                    width: '100%',
                    margin: '0 auto 20px auto',
                    padding: '15px',
                }}
            >
                <Box sx={{ display: 'flex', gap: '20px', flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
                    <TextField
                        label={t('common.search')}
                        fullWidth
                        variant="filled"
                        value={search}
                        onChange={(e) => onSearch(e.target.value)}
                    />
                    {hasPermissions(Permissions.CREATE_ARTICLE) && (
                        <Button
                            fullWidth
                            component={Link}
                            to="/articles/dashboard"
                            variant="contained"
                            sx={{ gap: '5px', width: '300px' }}
                        >
                            <AddCircleIcon fontSize="large" />
                            {t('articles.add_article')}
                        </Button>
                    )}
                </Box>
            </Card>
        </>
    );
};

export default ArticlesHeading;
