import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import bgImage from '../assets/static/admin_panel_bg.svg';
import Card from '../modules/shared/components/Card';
import Container from '../modules/shared/components/Container';

const TosScreen = () => {
    const { t } = useTranslation();
    return (
        <Container
            sx={{
                backgroundImage: `url(${bgImage})`,
                backgroundPosition: 'center',
                backgroundSize: '100%',
                width: '100%',
            }}
        >
            <Card
                title={t('tos.title')}
                subtitle={t('tos.subtitle')}
                sx={{
                    width: '100%',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                        marginTop: '20px',
                    }}
                >
                    <Link target="_blank" to="/klauzula-informacyjna-RODO.pdf">
                        {t('tos.clause')}
                    </Link>
                    <Link target="_blank" to="/polityka-prywatnosci-i-cookies.pdf">
                        {t('tos.privacy_policy')}
                    </Link>
                    <Link target="_blank" to="/przetwarzanie-danych-osobowych.pdf">
                        {t('tos.data_processing')}
                    </Link>
                    <Link target="_blank" to="/regulamin-serwisu.pdf">
                        {t('tos.terms')}
                    </Link>
                </Box>
            </Card>
        </Container>
    );
};

export default TosScreen;
