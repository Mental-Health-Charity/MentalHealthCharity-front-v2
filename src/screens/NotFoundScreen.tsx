import { Typography } from '@mui/material';
import Container from '../modules/shared/components/Container';
import { useTranslation } from 'react-i18next';
import Layout from '../modules/shared/components/Layout';
import bgImg from '../assets/static/line_bg.webp';

const NotFoundScreen = () => {
    const { t } = useTranslation();

    return (
        <Layout>
            <Container
                sx={{
                    display: { xs: 'flex', sm: 'flex', md: 'flex' },
                    justifyContent: { xs: 'center', sm: 'center' },
                    alignItems: { xs: 'center', sm: 'center' },
                    textAlign: { xs: 'center' },
                    backgroundImage: `url(${bgImg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        display: { xs: 'block', md: 'none' }, // Wyświetlaj h4 tylko na xs
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
                    }}
                >
                    {t('not_found_screen.title')}
                </Typography>
                <Typography
                    variant="h2"
                    sx={{
                        display: { xs: 'none', md: 'block' }, // Wyświetlaj h2 tylko na md i większych
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
                    }}
                >
                    {t('not_found_screen.title')}
                </Typography>
                <Typography
                    variant="body1"
                    sx={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)', fontSize: { xs: '1rem', sm: '1rem' } }}
                >
                    {t('not_found_screen.subtitle')}
                </Typography>
            </Container>
        </Layout>
    );
};

export default NotFoundScreen;
